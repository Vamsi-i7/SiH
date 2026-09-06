/**
 * src/hooks/useQueueSync.ts
 *
 * Auto-flush hook: syncs pending offline assessments to the Edge Function
 * when the browser comes online.
 *
 * Features:
 *  - window.online event listener to trigger flush
 *  - Exponential backoff with jitter (1s → 2s → 4s → … → 60s cap)
 *  - Per-item idempotent submission (safe to retry same local_id)
 *  - Race-condition guard (only one flush in-flight at a time)
 *  - Returns syncing state + counts so OfflineIndicator can display progress
 *
 * Usage:
 *   const { isSyncing, pendingCount, syncedCount, failedCount, flush } = useQueueSync();
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { auth } from '@/lib/firebase';
import {
  getPendingAssessments,
  getPendingCount,
  markSyncing,
  markSynced,
  markFailed,
  type PendingAssessment,
  type FlushResult,
} from '@/services/offlineService';

// ============================================================================
// CONSTANTS
// ============================================================================

// TODO: Enable when edge function sync is implemented
// const EDGE_FN_PATH = '/functions/v1/evaluate-assessment';
const MAX_RETRIES = 5;
const BASE_BACKOFF_MS = 1_000; // 1 second
const MAX_BACKOFF_MS = 60_000; // 60 seconds
const REQUEST_TIMEOUT_MS = 30_000; // 30 seconds per request
const SYNC_BATCH_SIZE = 10; // Process 10 at a time

// ============================================================================
// TYPES
// ============================================================================

export interface QueueSyncState {
  isSyncing: boolean;
  pendingCount: number;
  syncedCount: number;
  failedCount: number;
  lastSyncAt: string | null;
  lastError: string | null;
  flush: () => Promise<FlushResult>;
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Exponential backoff with full jitter.
 * Formula: random(0, min(cap, base * 2^attempt))
 */
function backoffWithJitter(attempt: number): number {
  const base = Math.min(MAX_BACKOFF_MS, BASE_BACKOFF_MS * Math.pow(2, attempt));
  return Math.random() * base;
}

/**
 * POST a single pending assessment to the Edge Function.
 * Returns the server assessment_id on success, throws on failure.
 */
async function syncAssessment(
  assessment: PendingAssessment,
  edgeFnUrl: string,
  accessToken: string
): Promise<{ assessment_id: string; submitted_at: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(edgeFnUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        local_id: assessment.local_id,
        competency_id: assessment.competency_id,
        user_id: assessment.user_id,
        final_level: assessment.final_level,
        answers: assessment.answers,
        branch_path: assessment.branch_path,
        created_at: assessment.created_at,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'unknown error');
      throw new Error(`${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    return {
      assessment_id: data.assessment_id as string,
      submitted_at: data.submitted_at as string,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

// ============================================================================
// HOOK
// ============================================================================

export function useQueueSync(): QueueSyncState {
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncedCount, setSyncedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  // Guard: prevent concurrent flush runs
  const flushLockRef = useRef(false);

  // Refresh pending count from IndexedDB
  const refreshCount = useCallback(async () => {
    const count = await getPendingCount();
    setPendingCount(count);
  }, []);

  /**
   * flush — Attempt to sync all pending assessments to the Edge Function.
   *
   * - Acquires lock (only 1 flush at a time)
   * - Gets all PENDING and FAILED (below retry cap) assessments
   * - For each, POSTs to Edge Function with exponential backoff
   * - Updates IndexedDB status after each attempt
   * - Releases lock when done
   */
  const flush = useCallback(async (): Promise<FlushResult> => {
    if (flushLockRef.current) {
      return { total: 0, synced: 0, failed: 0, errors: [] };
    }

    flushLockRef.current = true;
    setIsSyncing(true);
    setLastError(null);

    const result: FlushResult = { total: 0, synced: 0, failed: 0, errors: [] };

    try {
      // Get Firebase Auth user token
      const user = auth.currentUser;
      const accessToken = user ? await user.getIdToken() : 'demo-token';
      const syncUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/assessment/sync`;

      // Fetch pending + failed (below retry cap) assessments
      const pending = await getPendingAssessments(SYNC_BATCH_SIZE);
      const retryable = pending.filter(
        (a) => a.sync_status === 'PENDING' || (a.sync_status === 'FAILED' && a.retry_count < MAX_RETRIES)
      );

      result.total = retryable.length;

      for (const assessment of retryable) {
        const attempt = assessment.retry_count;

        try {
          // Mark as syncing (prevents duplicate concurrent syncs)
          await markSyncing(assessment.local_id);

          // Exponential backoff delay on retries (not first attempt)
          if (attempt > 0) {
            const delay = backoffWithJitter(attempt);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }

          const { assessment_id, submitted_at } = await syncAssessment(
            assessment,
            syncUrl,
            accessToken
          );

          await markSynced(assessment.local_id, assessment_id, submitted_at);
          result.synced++;
          setSyncedCount((prev) => prev + 1);
        } catch (err) {
          const errorMsg = (err as Error).message ?? 'Sync failed';
          await markFailed(assessment.local_id, errorMsg);
          result.failed++;
          result.errors.push({ local_id: assessment.local_id, error: errorMsg });
          setFailedCount((prev) => prev + 1);

          // Surface the first error to UI
          if (result.errors.length === 1) {
            setLastError(errorMsg);
          }
        }
      }

      if (result.synced > 0) {
        setLastSyncAt(new Date().toISOString());
      }
    } finally {
      flushLockRef.current = false;
      setIsSyncing(false);
      await refreshCount();
    }

    return result;
  }, [refreshCount]);

  // ─── Effects ────────────────────────────────────────────────────────────────

  // Initial count on mount
  useEffect(() => {
    let active = true;
    getPendingCount().then((count) => {
      if (active) {
        setPendingCount(count);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Flush when window comes online
  useEffect(() => {
    const handleOnline = () => {
      flush();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [flush]);

  // Poll pending count every 30s (background refresh so badge stays accurate)
  useEffect(() => {
    const interval = setInterval(refreshCount, 30_000);
    return () => clearInterval(interval);
  }, [refreshCount]);

  // Flush on mount if already online and queue has items
  useEffect(() => {
    if (navigator.onLine) {
      getPendingCount().then((count) => {
        if (count > 0) {
          flush();
        }
      });
    }
  }, [flush]);

  return {
    isSyncing,
    pendingCount,
    syncedCount,
    failedCount,
    lastSyncAt,
    lastError,
    flush,
  };
}
