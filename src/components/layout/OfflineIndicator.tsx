/**
 * src/components/layout/OfflineIndicator.tsx
 *
 * Real-time connectivity + sync status banner.
 *
 * States:
 *  1. ONLINE, queue empty, not syncing → hidden (null)
 *  2. OFFLINE, queue has items → amber bar: "Offline · N pending"
 *  3. OFFLINE, queue empty → amber bar: "Offline"
 *  4. ONLINE, syncing → blue bar: "Syncing N assessments…"
 *  5. ONLINE, just synced, queue empty → green bar (auto-hides after 4s)
 *  6. ONLINE, some failed → red bar: "N failed to sync – tap to retry"
 *
 * Uses useQueueSync for real flush + backoff logic.
 * Fully accessible: aria-live="assertive", role="status".
 */

'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { WifiOff, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useQueueSync } from '@/hooks/useQueueSync';

// ─── Online store (no hydration mismatch) ────────────────────────────────────

function subscribeOnline(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
const getOnlineSnapshot = () => (typeof navigator !== 'undefined' ? navigator.onLine : true);
const getOnlineServerSnapshot = () => true;
const emptySubscribe = () => () => {};

// ─── Component ───────────────────────────────────────────────────────────────

export function OfflineIndicator() {
  // Hydration guard — never render on server
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const isOnline = useSyncExternalStore(subscribeOnline, getOnlineSnapshot, getOnlineServerSnapshot);

  const { isSyncing, pendingCount, failedCount, lastSyncAt, lastError, flush } = useQueueSync();

  // Auto-hide the "Synced ✓" confirmation after 4 seconds
  const [showSyncedConfirm, setShowSyncedConfirm] = useState(false);

  useEffect(() => {
    if (lastSyncAt && !isSyncing && pendingCount === 0 && isOnline) {
      const showTimer = setTimeout(() => setShowSyncedConfirm(true), 0);
      const hideTimer = setTimeout(() => setShowSyncedConfirm(false), 4_000);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [lastSyncAt, isSyncing, pendingCount, isOnline]);

  const handleRetry = useCallback(() => {
    flush();
  }, [flush]);

  // ── Derive display state ──────────────────────────────────────────────────

  if (!mounted) return null;

  // Completely hidden: online, nothing pending, not syncing, no confirmation
  const fullyIdle = isOnline && pendingCount === 0 && !isSyncing && !showSyncedConfirm && failedCount === 0;
  if (fullyIdle) return null;

  // ── Determine bar variant ─────────────────────────────────────────────────

  type Variant = 'offline' | 'syncing' | 'synced' | 'failed';
  let variant: Variant = 'offline';

  if (!isOnline) {
    variant = 'offline';
  } else if (isSyncing) {
    variant = 'syncing';
  } else if (failedCount > 0 && pendingCount > 0) {
    variant = 'failed';
  } else if (showSyncedConfirm) {
    variant = 'synced';
  } else {
    variant = 'offline';
  }

  // ── Styling map ───────────────────────────────────────────────────────────

  const styles: Record<Variant, { bar: string; icon: string; text: string }> = {
    offline: {
      bar: 'bg-[--color-severity-moderate]/10 border-[--color-severity-moderate]/20',
      icon: 'text-[--color-severity-moderate]',
      text: 'text-[--color-severity-moderate]',
    },
    syncing: {
      bar: 'bg-[--color-primary]/10 border-[--color-primary]/20',
      icon: 'text-[--color-primary]',
      text: 'text-[--color-primary]',
    },
    synced: {
      bar: 'bg-[--color-primary]/10 border-[--color-primary]/20',
      icon: 'text-[--color-primary]',
      text: 'text-[--color-primary]',
    },
    failed: {
      bar: 'bg-[--color-destructive]/10 border-[--color-destructive]/20',
      icon: 'text-[--color-destructive]',
      text: 'text-[--color-destructive]',
    },
  };

  const s = styles[variant];

  return (
    <div
      role="status"
      aria-live="assertive"
      aria-atomic="true"
      className={`
        flex items-center justify-between gap-3 px-4 py-2 text-sm
        border-t transition-colors
        ${s.bar}
      `}
    >
      {/* Left: icon + message */}
      <div className="flex items-center gap-2">
        {variant === 'offline' && (
          <>
            <WifiOff className={`h-4 w-4 shrink-0 ${s.icon}`} aria-hidden="true" />
            <span className={`font-medium ${s.text}`}>Offline</span>
            {pendingCount > 0 && (
              <span className="text-[--color-severity-moderate]">
                · {pendingCount} assessment{pendingCount !== 1 ? 's' : ''} pending
              </span>
            )}
          </>
        )}

        {variant === 'syncing' && (
          <>
            <RefreshCw className={`h-4 w-4 shrink-0 animate-spin ${s.icon}`} aria-hidden="true" />
            <span className={`font-medium ${s.text}`}>
              Syncing {pendingCount} assessment{pendingCount !== 1 ? 's' : ''}…
            </span>
          </>
        )}

        {variant === 'synced' && (
          <>
            <CheckCircle2 className={`h-4 w-4 shrink-0 ${s.icon}`} aria-hidden="true" />
            <span className={`font-medium ${s.text}`}>All assessments synced</span>
          </>
        )}

        {variant === 'failed' && (
          <>
            <AlertTriangle className={`h-4 w-4 shrink-0 ${s.icon}`} aria-hidden="true" />
            <span className={`font-medium ${s.text}`}>
              {failedCount} failed to sync
            </span>
            {lastError && (
              <span className="text-[--color-destructive] truncate max-w-xs hidden sm:inline" title={lastError}>
                · {lastError}
              </span>
            )}
          </>
        )}
      </div>

      {/* Right: retry button (only on failed) */}
      {variant === 'failed' && isOnline && (
        <button
          onClick={handleRetry}
          className="
            flex items-center gap-1.5 px-3 py-1 text-xs font-semibold
            bg-[--color-destructive]/10 text-[--color-destructive] rounded-full border border-[--color-destructive]/20
            hover:bg-[--color-destructive]/20 transition-colors focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-[--color-destructive] focus-visible:ring-offset-1
          "
          aria-label="Retry syncing failed assessments"
        >
          <RefreshCw className="h-3 w-3" aria-hidden="true" />
          Retry
        </button>
      )}

      {/* Pending count chip when offline */}
      {variant === 'offline' && pendingCount > 0 && (
        <span
          className="flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-[--color-severity-moderate]/20 text-[--color-severity-moderate] rounded-full min-w-6"
          aria-label={`${pendingCount} assessments will sync when online`}
        >
          {pendingCount}
        </span>
      )}
    </div>
  );
}
