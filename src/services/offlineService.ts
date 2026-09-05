/**
 * offlineService.ts — Offline Queue Manager (IndexedDB)
 *
 * Manages a durable queue of pending assessments using IndexedDB.
 * Survives app crashes, browser cache clears, and close/reopen cycles.
 *
 * Design: PHASE_4_BRAINSTORM.md § 3 (Offline Queue Architecture)
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';

// =========================================================================
// TYPES & INTERFACES
// =========================================================================

export type SyncStatus = 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED';

export interface PendingAssessment {
  local_id: string; // Client-generated UUID, immutable, unique key
  assessment_id: string | null; // Server-assigned after sync (null until synced)
  competency_id: string;
  user_id: string;
  final_level: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  answers: Record<string, string>; // { question_id: answer_index }
  branch_path: string; // 'L1' | 'L2_L3' | 'L3_L4' | 'L5'
  created_at: string; // ISO8601, client timestamp (offline)
  submitted_at: string | null; // ISO8601, server timestamp (after sync)
  sync_status: SyncStatus; // PENDING | SYNCING | SYNCED | FAILED
  sync_error: string | null; // Error message if sync failed
  retry_count: number; // Number of failed sync attempts
  last_retry_at: string | null; // ISO8601 of last retry
}

/**
 * IndexedDB Schema Definition
 */
interface StatvidyaDB extends DBSchema {
  pending_assessments: {
    key: string; // local_id
    value: PendingAssessment;
    indexes: {
      'by-sync-status': SyncStatus;
      'by-created-at': string;
      'by-user-id': string;
    };
  };
}

const DB_NAME = 'statvidya';
const DB_VERSION = 1;
const STORE_NAME = 'pending_assessments';

// =========================================================================
// SINGLETON DATABASE INSTANCE
// =========================================================================

let dbInstance: IDBPDatabase<StatvidyaDB> | null = null;

/**
 * openDatabase — Initialize IndexedDB connection
 *
 * Creates the database and object store if they don't exist.
 * Safe to call multiple times (returns existing connection).
 *
 * @returns Promise<IDBPDatabase>
 */
async function openDatabase(): Promise<IDBPDatabase<StatvidyaDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<StatvidyaDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'local_id' });
        store.createIndex('by-sync-status', 'sync_status');
        store.createIndex('by-created-at', 'created_at');
        store.createIndex('by-user-id', 'user_id');
      }
    },
  });

  return dbInstance;
}

export async function _resetDatabaseForTesting(): Promise<void> {
  const db = await openDatabase();
  await db.clear(STORE_NAME);
}

// =========================================================================
// QUEUE MANAGER INTERFACE
// =========================================================================

export interface OfflineQueueManager {
  queueAssessment(payload: Omit<PendingAssessment, 'sync_status' | 'sync_error' | 'retry_count' | 'last_retry_at' | 'submitted_at'>): Promise<string>;
  getPendingCount(): Promise<number>;
  getPendingAssessments(limit?: number): Promise<PendingAssessment[]>;
  getPendingAssessmentByLocalId(local_id: string): Promise<PendingAssessment | undefined>;
  markSyncing(local_id: string): Promise<void>;
  markSynced(local_id: string, assessment_id: string, submitted_at: string): Promise<void>;
  markFailed(local_id: string, error: string): Promise<void>;
  clearQueue(): Promise<void>;
  flushPendingOnline(): Promise<FlushResult>;
}

export interface FlushResult {
  total: number;
  synced: number;
  failed: number;
  errors: Array<{ local_id: string; error: string }>;
}

// =========================================================================
// IMPLEMENTATION
// =========================================================================

/**
 * queueAssessment — Add completed assessment to queue
 *
 * Writes assessment to IndexedDB with status=PENDING before returning.
 * This ensures durability: if app crashes after submission form, assessment is safe.
 *
 * @param payload Assessment result (without sync metadata)
 * @returns local_id (client UUID, immutable identifier for this submission)
 */
export async function queueAssessment(
  payload: Omit<PendingAssessment, 'sync_status' | 'sync_error' | 'retry_count' | 'last_retry_at' | 'submitted_at'>
): Promise<string> {
  const db = await openDatabase();

  const pendingAssessment: PendingAssessment = {
    ...payload,
    sync_status: 'PENDING',
    sync_error: null,
    retry_count: 0,
    last_retry_at: null,
    submitted_at: null,
    assessment_id: null,
  };

  await db.add(STORE_NAME, pendingAssessment);

  return payload.local_id;
}

/**
 * getPendingCount — Get number of assessments awaiting sync
 *
 * Used by UI to show: "🔴 3 Assessments Pending"
 *
 * @returns Count of assessments with sync_status != 'SYNCED'
 */
export async function getPendingCount(): Promise<number> {
  const db = await openDatabase();
  const index = db.transaction(STORE_NAME).store.index('by-sync-status');

  let count = 0;
  for (const status of ['PENDING', 'SYNCING', 'FAILED'] as const) {
    const matches = await index.getAll(status);
    count += matches.length;
  }

  return count;
}

/**
 * getPendingAssessments — Fetch all assessments not yet synced
 *
 * Returns assessments in order of creation (oldest first, for fair retry).
 * Excludes already SYNCED assessments.
 *
 * @param limit Optional: max number to return (default 100)
 * @returns Array of pending assessments
 */
export async function getPendingAssessments(limit: number = 100): Promise<PendingAssessment[]> {
  const db = await openDatabase();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const index = tx.store.index('by-created-at');

  const results: PendingAssessment[] = [];
  let count = 0;

  for await (const cursor of index.iterate()) {
    if (cursor.value.sync_status !== 'SYNCED') {
      results.push(cursor.value);
      count++;
      if (count >= limit) {
        break;
      }
    }
  }

  return results;
}

/**
 * getPendingAssessmentByLocalId — Fetch single assessment by local_id
 *
 * @param local_id Client-generated UUID
 * @returns Assessment or undefined if not found
 */
export async function getPendingAssessmentByLocalId(local_id: string): Promise<PendingAssessment | undefined> {
  const db = await openDatabase();
  return db.get(STORE_NAME, local_id);
}

/**
 * markSyncing — Mark assessment as currently syncing
 *
 * Called when starting to POST to Edge Function.
 * Prevents duplicate concurrent syncs if user retries.
 *
 * @param local_id Assessment local_id
 */
export async function markSyncing(local_id: string): Promise<void> {
  const db = await openDatabase();
  const assessment = await db.get(STORE_NAME, local_id);

  if (!assessment) {
    throw new Error(`Assessment ${local_id} not found`);
  }

  await db.put(STORE_NAME, {
    ...assessment,
    sync_status: 'SYNCING',
  });
}

/**
 * markSynced — Mark assessment as successfully synced
 *
 * Called after Edge Function returns 200 with assessment_id.
 * Removes from pending queue; user won't see "Pending" banner anymore.
 *
 * @param local_id Assessment local_id
 * @param assessment_id Server-assigned UUID
 * @param submitted_at Server timestamp
 */
export async function markSynced(local_id: string, assessment_id: string, submitted_at: string): Promise<void> {
  const db = await openDatabase();
  const assessment = await db.get(STORE_NAME, local_id);

  if (!assessment) {
    throw new Error(`Assessment ${local_id} not found`);
  }

  await db.put(STORE_NAME, {
    ...assessment,
    assessment_id,
    submitted_at,
    sync_status: 'SYNCED',
    sync_error: null,
    retry_count: 0,
  });
}

/**
 * markFailed — Mark assessment sync as failed
 *
 * Increments retry_count and records error message.
 * Assessment remains in queue for exponential backoff retry.
 *
 * @param local_id Assessment local_id
 * @param error Error message (e.g., "Network timeout", "400: Invalid answers")
 */
export async function markFailed(local_id: string, error: string): Promise<void> {
  const db = await openDatabase();
  const assessment = await db.get(STORE_NAME, local_id);

  if (!assessment) {
    throw new Error(`Assessment ${local_id} not found`);
  }

  await db.put(STORE_NAME, {
    ...assessment,
    sync_status: 'FAILED',
    sync_error: error,
    retry_count: assessment.retry_count + 1,
    last_retry_at: new Date().toISOString(),
  });
}

/**
 * clearQueue — Manually clear all pending assessments
 *
 * CAUTION: Only called after explicit user action (and logged to audit).
 * Deletes all assessments from queue (not synced to server).
 *
 * @throws Error if any assessments have retry_count > 0 (force-confirm required)
 */
export async function clearQueue(): Promise<void> {
  const db = await openDatabase();
  const pending = await getPendingAssessments(10000);

  if (pending.some((a) => a.retry_count > 0)) {
    throw new Error(
      'Cannot clear queue: some assessments have failed retries. User must explicitly confirm loss.'
    );
  }

  const tx = db.transaction(STORE_NAME, 'readwrite');
  for (const assessment of pending) {
    await tx.store.delete(assessment.local_id);
  }
  await tx.done;
}

/**
 * flushPendingOnline — Auto-sync all pending assessments (called on window.online)
 *
 * High-level orchestration: gets all pending, batches them, calls Edge Function,
 * updates queue based on responses, handles partial failures.
 *
 * NOTE: This is a simplified version; actual retry logic lives in useQueueSync hook.
 *
 * @returns FlushResult summary (total, synced, failed, errors)
 */
export async function flushPendingOnline(): Promise<FlushResult> {
  const pending = await getPendingAssessments(100);

  const result: FlushResult = {
    total: pending.length,
    synced: 0,
    failed: 0,
    errors: [],
  };

  for (const assessment of pending) {
    if (assessment.sync_status === 'SYNCED') {
      result.synced++;
      continue;
    }

    // In real implementation, this would call Edge Function
    // For now, just return summary structure
    result.failed++;
  }

  return result;
}

// =========================================================================
// SINGLETON MANAGER EXPORT
// =========================================================================

const offlineQueueManager: OfflineQueueManager = {
  queueAssessment,
  getPendingCount,
  getPendingAssessments,
  getPendingAssessmentByLocalId,
  markSyncing,
  markSynced,
  markFailed,
  clearQueue,
  flushPendingOnline,
};

export default offlineQueueManager;
