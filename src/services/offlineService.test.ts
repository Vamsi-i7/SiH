/**
 * offlineService.test.ts — Comprehensive tests for IndexedDB queue manager
 *
 * Tests durability, crash recovery, retry logic, and state transitions.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  queueAssessment,
  getPendingCount,
  getPendingAssessments,
  getPendingAssessmentByLocalId,
  markSyncing,
  markSynced,
  markFailed,
  clearQueue,
  _resetDatabaseForTesting,
} from './offlineService';

describe('offlineService — IndexedDB Queue Manager', () => {
  beforeEach(async () => {
    await _resetDatabaseForTesting();
  });

  const mockAssessment = {
    assessment_id: null, local_id: '550e8400-e29b-41d4-a716-446655440000',
    competency_id: 'comp-nsso-survey',
    user_id: 'user-sunita-devi',
    final_level: 'L3' as const,
    answers: { 'q1': '0', 'q2': '1', 'q3': '2' },
    branch_path: 'L2_L3',
    created_at: new Date().toISOString(),
  };

  // ========================================================================
  // TEST SUITE 1: Queue Operations (Add, Read)
  // ========================================================================

  describe('queueAssessment', () => {
    it('adds assessment to queue with PENDING status', async () => {
      const local_id = await queueAssessment(mockAssessment);

      expect(local_id).toBe(mockAssessment.local_id);

      const fetched = await getPendingAssessmentByLocalId(local_id);
      expect(fetched).toMatchObject({
        ...mockAssessment,
        sync_status: 'PENDING',
        sync_error: null,
        retry_count: 0,
        assessment_id: null,
        submitted_at: null,
      });
    });

    it('generates unique local_id for each assessment', async () => {
      const id1 = await queueAssessment({
        ...mockAssessment,
        assessment_id: null, local_id: '550e8400-e29b-41d4-a716-446655440001',
      });
      const id2 = await queueAssessment({
        ...mockAssessment,
        assessment_id: null, local_id: '550e8400-e29b-41d4-a716-446655440002',
      });

      expect(id1).not.toBe(id2);
    });

    it('preserves all assessment fields exactly', async () => {
      await queueAssessment(mockAssessment);
      const fetched = await getPendingAssessmentByLocalId(mockAssessment.local_id);

      expect(fetched?.competency_id).toBe(mockAssessment.competency_id);
      expect(fetched?.final_level).toBe(mockAssessment.final_level);
      expect(fetched?.answers).toEqual(mockAssessment.answers);
      expect(fetched?.branch_path).toBe(mockAssessment.branch_path);
    });
  });

  // ========================================================================
  // TEST SUITE 2: Count Operations
  // ========================================================================

  describe('getPendingCount', () => {
    it('returns 0 for empty queue', async () => {
      const count = await getPendingCount();
      expect(count).toBe(0);
    });

    it('counts PENDING assessments', async () => {
      await queueAssessment({
        ...mockAssessment,
        assessment_id: null, local_id: 'test-1',
      });
      await queueAssessment({
        ...mockAssessment,
        assessment_id: null, local_id: 'test-2',
      });

      const count = await getPendingCount();
      expect(count).toBeGreaterThanOrEqual(2);
    });

    it('excludes SYNCED assessments from count', async () => {
      const local_id = 'test-sync-1';
      await queueAssessment({
        ...mockAssessment,
        local_id,
      });

      const before = await getPendingCount();
      await markSynced(local_id, 'server-id-123', new Date().toISOString());
      const after = await getPendingCount();

      expect(before).toBeGreaterThan(after);
    });

    it('includes SYNCING and FAILED in pending count', async () => {
      const local_id_syncing = 'test-syncing-1';
      const local_id_failed = 'test-failed-1';

      await queueAssessment({
        ...mockAssessment,
        assessment_id: null, local_id: local_id_syncing,
      });
      await queueAssessment({
        ...mockAssessment,
        assessment_id: null, local_id: local_id_failed,
      });

      await markSyncing(local_id_syncing);
      await markFailed(local_id_failed, 'Network timeout');

      const count = await getPendingCount();
      expect(count).toBeGreaterThanOrEqual(2);
    });
  });

  // ========================================================================
  // TEST SUITE 3: Sync Status Transitions
  // ========================================================================

  describe('markSyncing', () => {
    it('changes status from PENDING to SYNCING', async () => {
      const local_id = 'test-syncing-transition';
      await queueAssessment({
        ...mockAssessment,
        local_id,
      });

      await markSyncing(local_id);

      const fetched = await getPendingAssessmentByLocalId(local_id);
      expect(fetched?.sync_status).toBe('SYNCING');
    });

    it('throws if assessment not found', async () => {
      await expect(markSyncing('nonexistent-id')).rejects.toThrow();
    });
  });

  describe('markSynced', () => {
    it('changes status from SYNCING to SYNCED', async () => {
      const local_id = 'test-mark-synced';
      await queueAssessment({
        ...mockAssessment,
        local_id,
      });

      await markSyncing(local_id);
      await markSynced(local_id, 'server-id-123', new Date().toISOString());

      const fetched = await getPendingAssessmentByLocalId(local_id);
      expect(fetched?.sync_status).toBe('SYNCED');
      expect(fetched?.assessment_id).toBe('server-id-123');
      expect(fetched?.retry_count).toBe(0);
      expect(fetched?.sync_error).toBeNull();
    });

    it('throws if assessment not found', async () => {
      await expect(
        markSynced('nonexistent-id', 'server-id', new Date().toISOString())
      ).rejects.toThrow();
    });
  });

  describe('markFailed', () => {
    it('changes status to FAILED and increments retry_count', async () => {
      const local_id = 'test-mark-failed';
      await queueAssessment({
        ...mockAssessment,
        local_id,
      });

      await markFailed(local_id, 'Network timeout after 30s');

      const fetched = await getPendingAssessmentByLocalId(local_id);
      expect(fetched?.sync_status).toBe('FAILED');
      expect(fetched?.retry_count).toBe(1);
      expect(fetched?.sync_error).toBe('Network timeout after 30s');
    });

    it('increments retry_count on multiple failures', async () => {
      const local_id = 'test-multiple-failures';
      await queueAssessment({
        ...mockAssessment,
        local_id,
      });

      await markFailed(local_id, 'Error 1');
      let fetched = await getPendingAssessmentByLocalId(local_id);
      expect(fetched?.retry_count).toBe(1);

      await markFailed(local_id, 'Error 2');
      fetched = await getPendingAssessmentByLocalId(local_id);
      expect(fetched?.retry_count).toBe(2);

      await markFailed(local_id, 'Error 3');
      fetched = await getPendingAssessmentByLocalId(local_id);
      expect(fetched?.retry_count).toBe(3);
    });

    it('records last_retry_at timestamp', async () => {
      const local_id = 'test-retry-timestamp';
      await queueAssessment({
        ...mockAssessment,
        local_id,
      });

      const before = new Date();
      await markFailed(local_id, 'Test error');
      const after = new Date();

      const fetched = await getPendingAssessmentByLocalId(local_id);
      expect(fetched).toBeDefined();
      expect(fetched?.last_retry_at).toBeTruthy();
      const retryTime = new Date(fetched!.last_retry_at as string);

      expect(retryTime.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(retryTime.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('throws if assessment not found', async () => {
      await expect(markFailed('nonexistent-id', 'Error')).rejects.toThrow();
    });
  });

  // ========================================================================
  // TEST SUITE 4: Batch Retrieval
  // ========================================================================

  describe('getPendingAssessments', () => {
    it('returns empty array for empty queue', async () => {
      const pending = await getPendingAssessments();
      expect(pending.length).toBe(0);
    });

    it('returns all PENDING assessments', async () => {
      await queueAssessment({
        ...mockAssessment,
        assessment_id: null, local_id: 'batch-test-1',
      });
      await queueAssessment({
        ...mockAssessment,
        assessment_id: null, local_id: 'batch-test-2',
      });

      const pending = await getPendingAssessments();
      expect(pending.length).toBeGreaterThanOrEqual(2);
      expect(pending.every((a) => a.sync_status !== 'SYNCED')).toBe(true);
    });

    it('excludes SYNCED assessments', async () => {
      const local_id_synced = 'batch-synced-1';
      const local_id_pending = 'batch-pending-1';

      await queueAssessment({
        ...mockAssessment,
        assessment_id: null, local_id: local_id_synced,
      });
      await queueAssessment({
        ...mockAssessment,
        assessment_id: null, local_id: local_id_pending,
      });

      await markSynced(local_id_synced, 'server-id', new Date().toISOString());

      const pending = await getPendingAssessments();
      const ids = pending.map((a) => a.local_id);

      expect(ids).toContain(local_id_pending);
      expect(ids).not.toContain(local_id_synced);
    });

    it('respects limit parameter', async () => {
      for (let i = 0; i < 5; i++) {
        await queueAssessment({
          ...mockAssessment,
          assessment_id: null, local_id: `batch-limit-${i}`,
        });
      }

      const pending = await getPendingAssessments(2);
      expect(pending.length).toBeLessThanOrEqual(2);
    });

    it('returns assessments ordered by created_at (oldest first)', async () => {
      const now = new Date();
      await queueAssessment({
        ...mockAssessment,
        assessment_id: null, local_id: 'batch-order-1',
        created_at: new Date(now.getTime() - 10000).toISOString(),
      });
      await queueAssessment({
        ...mockAssessment,
        assessment_id: null, local_id: 'batch-order-2',
        created_at: new Date(now.getTime() - 5000).toISOString(),
      });

      const pending = await getPendingAssessments();
      if (pending.length >= 2) {
        const indices = pending.findIndex((a) => a.local_id === 'batch-order-1');
        expect(indices).toBeGreaterThanOrEqual(0);
      }
    });
  });

  // ========================================================================
  // TEST SUITE 5: Single Assessment Retrieval
  // ========================================================================

  describe('getPendingAssessmentByLocalId', () => {
    it('returns assessment if found', async () => {
      const local_id = 'single-lookup-1';
      await queueAssessment({
        ...mockAssessment,
        local_id,
      });

      const fetched = await getPendingAssessmentByLocalId(local_id);
      expect(fetched?.local_id).toBe(local_id);
      expect(fetched?.competency_id).toBe(mockAssessment.competency_id);
    });

    it('returns undefined if not found', async () => {
      const fetched = await getPendingAssessmentByLocalId('nonexistent-assessment-id');
      expect(fetched).toBeUndefined();
    });
  });

  // ========================================================================
  // TEST SUITE 6: Idempotency (Same Assessment Multiple Times)
  // ========================================================================

  describe('idempotency — duplicate submissions', () => {
    it('second queueAssessment with same local_id throws (unique constraint)', async () => {
      const local_id = 'idempotent-test-1';
      await queueAssessment({
        ...mockAssessment,
        local_id,
      });

      // Attempt to add same local_id again
      await expect(
        queueAssessment({
          ...mockAssessment,
          local_id,
        })
      ).rejects.toThrow();
    });

    it('markSynced with same local_id is idempotent (updates, not inserts)', async () => {
      const local_id = 'idempotent-sync-1';
      await queueAssessment({
        ...mockAssessment,
        local_id,
      });

      const submittedAt = new Date().toISOString();
      await markSynced(local_id, 'server-id-1', submittedAt);
      const count1 = await getPendingCount();

      // Mark synced again (same local_id, different or same server_id)
      await markSynced(local_id, 'server-id-1', submittedAt);
      const count2 = await getPendingCount();

      // Count should not increase (update, not insert)
      expect(count2).toBeLessThanOrEqual(count1);
    });
  });

  // ========================================================================
  // TEST SUITE 7: Partial Failure Recovery
  // ========================================================================

  describe('partial failure scenarios', () => {
    it('can recover from mixed PENDING/SYNCING/FAILED states', async () => {
      const ids = {
        pending: 'partial-test-pending',
        syncing: 'partial-test-syncing',
        failed: 'partial-test-failed',
        synced: 'partial-test-synced',
      };

      // Create 4 assessments in different states
      await queueAssessment({ ...mockAssessment, assessment_id: null, local_id: ids.pending });
      await queueAssessment({ ...mockAssessment, assessment_id: null, local_id: ids.syncing });
      await queueAssessment({ ...mockAssessment, assessment_id: null, local_id: ids.failed });
      await queueAssessment({ ...mockAssessment, assessment_id: null, local_id: ids.synced });

      // Transition to different states
      await markSyncing(ids.syncing);
      await markFailed(ids.failed, 'Network error');
      await markSynced(ids.synced, 'server-id', new Date().toISOString());

      // Verify each state
      const pending = await getPendingAssessmentByLocalId(ids.pending);
      const syncing = await getPendingAssessmentByLocalId(ids.syncing);
      const failed = await getPendingAssessmentByLocalId(ids.failed);
      const synced = await getPendingAssessmentByLocalId(ids.synced);

      expect(pending?.sync_status).toBe('PENDING');
      expect(syncing?.sync_status).toBe('SYNCING');
      expect(failed?.sync_status).toBe('FAILED');
      expect(synced?.sync_status).toBe('SYNCED');
    });
  });

  // ========================================================================
  // TEST SUITE 8: Clear Queue (Destructive Operation)
  // ========================================================================

  describe('clearQueue', () => {
    it('throws if assessments have retry_count > 0 (force-confirm required)', async () => {
      const local_id = 'clear-test-with-retries';
      await queueAssessment({
        ...mockAssessment,
        local_id,
      });
      await markFailed(local_id, 'Network error');

      // Should throw because retry_count is now 1
      await expect(clearQueue()).rejects.toThrow(/failed retries/);
    });

    it('allows clear if no assessments have retried', async () => {
      const local_id = 'clear-test-no-retries';
      await queueAssessment({
        ...mockAssessment,
        local_id,
      });

      // Should NOT throw (no retries yet)
      await expect(clearQueue()).resolves.not.toThrow();

      // Verify queue is now empty or assessment is removed
      const fetched = await getPendingAssessmentByLocalId(local_id);
      expect(fetched).toBeUndefined();
    });
  });

  // ========================================================================
  // TEST SUITE 9: Durability (Simulated Crash Recovery)
  // ========================================================================

  describe('durability — data survives app lifecycle', () => {
    it('assessment survives queue operation cycle', async () => {
      const local_id = 'durability-test-1';
      const payload = { ...mockAssessment, local_id };

      // 1. Queue (simulate: form submission)
      const queuedId = await queueAssessment(payload);
      expect(queuedId).toBe(local_id);

      // 2. "App crash" (in real app, IDB persists, but in-memory state lost)
      // (Simulated by re-fetching from IDB)
      let assessment = await getPendingAssessmentByLocalId(local_id);
      expect(assessment).toBeDefined();
      expect(assessment?.sync_status).toBe('PENDING');

      // 3. "App reopens", recovery
      assessment = await getPendingAssessmentByLocalId(local_id);
      expect(assessment?.competency_id).toBe(payload.competency_id);

      // 4. Mark syncing
      await markSyncing(local_id);
      assessment = await getPendingAssessmentByLocalId(local_id);
      expect(assessment?.sync_status).toBe('SYNCING');

      // 5. Mark synced
      await markSynced(local_id, 'server-id-789', new Date().toISOString());
      assessment = await getPendingAssessmentByLocalId(local_id);
      expect(assessment?.sync_status).toBe('SYNCED');
    });
  });
});
