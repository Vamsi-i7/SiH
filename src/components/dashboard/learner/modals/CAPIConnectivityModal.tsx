'use client';

import React, { useState } from 'react';
import { X, Wifi, WifiOff, RefreshCw, CheckCircle2, ShieldCheck, Database, HardDrive } from 'lucide-react';

interface CAPIConnectivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  isHindi?: boolean;
  isOfflineSimulated?: boolean;
  onToggleOfflineSimulated?: () => void;
}

export function CAPIConnectivityModal({
  isOpen,
  onClose,
  isHindi = false,
  isOfflineSimulated = false,
  onToggleOfflineSimulated,
}: CAPIConnectivityModalProps) {
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncDone, setSyncDone] = useState(false);

  if (!isOpen) return null;

  const handleStartSync = () => {
    if (isOfflineSimulated) {
      alert(
        isHindi
          ? 'ऑफ़लाइन सिम्युलेटर सक्रिय है! कृपया सर्वर से सिंक करने से पहले नेटवर्क पुनः कनेक्ट करें।'
          : 'Offline field simulation is currently active! Please reconnect signal to synchronize with MoSPI central server.'
      );
      return;
    }

    setSyncing(true);
    setSyncProgress(15);
    setSyncDone(false);

    setTimeout(() => {
      setSyncProgress(45);
    }, 400);

    setTimeout(() => {
      setSyncProgress(85);
    }, 900);

    setTimeout(() => {
      setSyncProgress(100);
      setSyncing(false);
      setSyncDone(true);
    }, 1400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="capi-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-[#FAF6F0] border-2 border-[#BF9B7A]/40 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#555934] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 p-1 border border-white/20">
              <Wifi className="h-5 w-5 text-[#F8C858]" />
            </div>
            <div>
              <h2 id="capi-modal-title" className="text-sm font-black tracking-wide uppercase text-[#F8C858]">
                {isHindi ? 'CAPI ऑफ़लाइन इंजन एवं फील्ड कैश' : 'CAPI Field Engine & Local Cache'}
              </h2>
              <p className="text-[11px] text-white/80">
                {isHindi
                  ? 'एनबीएफसी, पीएलएफएस एवं एएसएचई स्थानीय डेटा तुल्यकालन'
                  : 'Encrypted IndexedDB Cache & MoSPI Central Node Sync'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close CAPI modal"
            className="rounded-xl p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status Bento */}
          <div className="rounded-2xl bg-white border border-[#BF9B7A]/30 p-5 shadow-xs">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#705849]">
                  {isHindi ? 'स्थानीय कैश्ड अनुसूचियां' : 'Local Form Cache'}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black font-mono text-[#2d1f17]">38</span>
                  <span className="text-xs font-bold text-[#555934]">
                    {isHindi ? 'प्रपत्र सुरक्षित' : 'Forms Secured'}
                  </span>
                </div>
                <p className="text-[11px] text-[#705849] mt-1">
                  24 PLFS Schedules • 14 ASHE Enterprise returns
                </p>
              </div>

              <div
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-bold ${
                  isOfflineSimulated
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-800'
                    : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-800'
                }`}
              >
                {isOfflineSimulated ? (
                  <>
                    <WifiOff className="h-4 w-4 text-amber-600" />
                    <span>{isHindi ? 'ऑफ़लाइन मोड' : 'Offline Sim'}</span>
                  </>
                ) : (
                  <>
                    <Wifi className="h-4 w-4 text-emerald-600" />
                    <span>{isHindi ? 'क्लाउड कनेक्टेड' : 'Cloud Active'}</span>
                  </>
                )}
              </div>
            </div>

            {/* Sync progress bar */}
            {syncing && (
              <div className="mt-4 pt-3 border-t border-[#BF9B7A]/20 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#555934] font-bold">
                    {syncProgress < 50
                      ? isHindi
                        ? 'डेटा एन्क्रिप्ट किया जा रहा है...'
                        : 'Encrypting payload...'
                      : isHindi
                        ? 'MoSPI सर्वर पर 38 प्रपत्र अपलोड हो रहे हैं...'
                        : 'Transmitting 38 schedules to Central Server...'}
                  </span>
                  <span className="font-bold">{syncProgress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#BF9B7A]/20 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#555934] transition-all duration-300"
                    style={{ width: `${syncProgress}%` }}
                  />
                </div>
              </div>
            )}

            {syncDone && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  {isHindi
                    ? 'सफलतापूर्वक 38 प्रपत्र MoSPI केंद्रीय नोड में सिंक हो गए हैं!'
                    : 'Successfully synchronized 38 field schedules with MoSPI Central Node!'}
                </span>
              </div>
            )}
          </div>

          {/* Offline Simulator Switch */}
          <div className="p-4 rounded-2xl bg-white border border-[#BF9B7A]/30 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-[#2d1f17]">
                {isHindi ? 'ग्रामीण फील्ड डिस्कनेक्ट सिमुलेशन' : 'Simulate Rural Network Disconnect'}
              </p>
              <p className="text-[11px] text-[#705849] mt-0.5">
                {isHindi
                  ? 'परीक्षण करें कि शून्य 4G/5G सिग्नल में कैपी कैसे काम करता है'
                  : 'Test CAPI behavior when network signal drops to zero in remote survey villages'}
              </p>
            </div>
            <button
              type="button"
              onClick={onToggleOfflineSimulated}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isOfflineSimulated ? 'bg-[#8C5B3E]' : 'bg-[#BF9B7A]/40'
              }`}
              role="switch"
              aria-checked={isOfflineSimulated}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isOfflineSimulated ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Security & Cryptographic Details */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#705849]">
              <HardDrive className="h-3.5 w-3.5 text-[#8C5B3E]" />
              <span>
                <strong>Storage:</strong> W3C IndexedDB with SQLite Local Fallback
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#705849]">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>
                <strong>Encryption:</strong> AES-256 GCM Hardware Keystore Protected
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#705849]">
              <Database className="h-3.5 w-3.5 text-[#555934]" />
              <span>
                <strong>Last Cloud Handshake:</strong> 14m ago (Server Node FOD-Patna-02)
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F2E6D8]/50 border-t border-[#BF9B7A]/25 flex items-center justify-between">
          <button
            type="button"
            disabled={syncing}
            onClick={handleStartSync}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#555934] text-white text-xs font-bold hover:bg-[#434728] transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>
              {syncing
                ? isHindi
                  ? 'सिंक हो रहा है...'
                  : 'Syncing...'
                : isHindi
                  ? 'सर्वर से सिंक करें'
                  : 'Force Cloud Sync Now'}
            </span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-[#BF9B7A]/40 text-xs font-bold text-[#705849] hover:bg-[#FAF6F0] transition-colors cursor-pointer"
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
