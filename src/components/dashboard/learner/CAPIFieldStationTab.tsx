'use client';

import React, { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';

export interface CachedScheduleItem {
  id: string;
  scheduleType: string;
  sampleUnit: string;
  villageBlock: string;
  investigator: string;
  status: 'ready' | 'validated' | 'query_pending';
  lastEdited: string;
  gpsLock: string;
}

const SAMPLE_SCHEDULES: CachedScheduleItem[] = [
  {
    id: 'SCH-PLFS-001',
    scheduleType: 'Schedule 0.0 (Listing)',
    sampleUnit: 'HH-01 to HH-18 (Demarcation)',
    villageBlock: 'CEB-042 (Patna Rural)',
    investigator: 'Sunita Devi / Amit Sharma',
    status: 'ready',
    lastEdited: '12 mins ago',
    gpsLock: '25.5941° N, 85.1376° E (±4m)',
  },
  {
    id: 'SCH-PLFS-002',
    scheduleType: 'Schedule 10.4 (Employment)',
    sampleUnit: 'Household 04 - Rajendra Prasad',
    villageBlock: 'CEB-042 (Patna Rural)',
    investigator: 'Sunita Devi / Amit Sharma',
    status: 'validated',
    lastEdited: '34 mins ago',
    gpsLock: '25.5943° N, 85.1379° E (±6m)',
  },
  {
    id: 'SCH-ASHE-014',
    scheduleType: 'Schedule 2.1 (ASHE Enterprise)',
    sampleUnit: 'M/s Gupta Agro Mill (Unorg)',
    villageBlock: 'FOD Ward 11',
    investigator: 'Amit Sharma',
    status: 'query_pending',
    lastEdited: '1 hour ago',
    gpsLock: '25.6012° N, 85.1420° E (±8m)',
  },
  {
    id: 'SCH-PLFS-003',
    scheduleType: 'Schedule 10.4 (Employment)',
    sampleUnit: 'Household 09 - Meena Devi',
    villageBlock: 'CEB-042 (Patna Rural)',
    investigator: 'Sunita Devi / Amit Sharma',
    status: 'ready',
    lastEdited: '2 hours ago',
    gpsLock: '25.5947° N, 85.1372° E (±5m)',
  },
];

interface CAPIFieldStationTabProps {
  isHindi?: boolean;
}

export function CAPIFieldStationTab({ isHindi = false }: CAPIFieldStationTabProps) {
  const [filter, setFilter] = useState<'all' | 'plfs' | 'ashe' | 'query'>('all');
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [synced, setSynced] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const filtered = SAMPLE_SCHEDULES.filter((s) => {
    if (filter === 'plfs') return s.scheduleType.includes('Schedule');
    if (filter === 'ashe') return s.scheduleType.includes('ASHE');
    if (filter === 'query') return s.status === 'query_pending';
    return true;
  });

  const handleTransmitAll = () => {
    if (isOfflineMode) {
      alert(
        isHindi
          ? 'ऑफ़लाइन सिम्युलेटर सक्रिय है! कृपया सर्वर से सिंक करने से पहले नेटवर्क पुनः कनेक्ट करें।'
          : 'Offline field simulation is active! Please reconnect signal to synchronize with MoSPI central server.'
      );
      return;
    }

    setSyncing(true);
    setSyncProgress(20);
    setSynced(false);

    setTimeout(() => setSyncProgress(60), 500);
    setTimeout(() => setSyncProgress(90), 900);
    setTimeout(() => {
      setSyncProgress(100);
      setSyncing(false);
      setSynced(true);
    }, 1300);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Offline Switch */}
      <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center shrink-0">
            <Wifi className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-[#2d1f17]">
                {isHindi ? 'CAPI फील्ड स्टेशन एवं डेटा कैश' : 'CAPI Field Station & Encrypted Form Ledger'}
              </h2>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isHindi
                ? 'स्थानीय एंड्रॉइड टैबलेट संग्रहण • 38 अनुसूचियां हार्डवेयर एन्क्रिप्टेड'
                : 'Local hardware-backed storage • 38 schedules secured with AES-256 GCM'}
            </p>
          </div>
        </div>

        {/* Offline Switch & Sync Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsOfflineMode(!isOfflineMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isOfflineMode
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-800'
                : 'bg-[#FAF6F0] border-[#BF9B7A]/30 text-muted-foreground hover:bg-[#F2E6D8]'
            }`}
          >
            {isOfflineMode ? <WifiOff className="h-3.5 w-3.5" /> : <Wifi className="h-3.5 w-3.5" />}
            <span>{isOfflineMode ? (isHindi ? 'ऑफ़लाइन सक्रिय' : 'Offline Sim: ON') : (isHindi ? 'ऑफ़लाइन टेस्ट करें' : 'Test Offline')}</span>
          </button>

          <button
            type="button"
            disabled={syncing}
            onClick={handleTransmitAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#555934] text-white text-xs font-bold hover:bg-[#434728] transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>
              {syncing
                ? isHindi
                  ? 'सिंक हो रहा है...'
                  : 'Syncing...'
                : isHindi
                  ? '38 प्रपत्र अपलोड करें'
                  : 'Transmit All 38 Forms'}
            </span>
          </button>
        </div>
      </div>

      {/* Sync Progress Bar */}
      {syncing && (
        <div className="p-4 rounded-2xl bg-white border border-[#BF9B7A]/30 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-[#555934]">
            <span>
              {syncProgress < 50
                ? isHindi
                  ? 'डेटा एन्क्रिप्ट किया जा रहा है...'
                  : 'Encrypting and packaging local schedules...'
                : isHindi
                  ? 'MoSPI केंद्रीय सर्वर पर अपलोड किया जा रहा है...'
                  : 'Uploading 38 returns to Central MoSPI Database...'}
            </span>
            <span>{syncProgress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-[#BF9B7A]/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#555934] transition-all duration-300"
              style={{ width: `${syncProgress}%` }}
            />
          </div>
        </div>
      )}

      {synced && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2 text-xs font-bold text-emerald-900">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>
            {isHindi
              ? 'सफलतापूर्वक सभी 38 अनुसूचियां केंद्रीय सांख्यिकी डेटाबेस में स्थानांतरित कर दी गई हैं!'
              : 'Successfully transmitted 38 schedules to National Survey Repository with cryptographic receipt!'}
          </span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-[#555934] text-white font-bold'
              : 'bg-white border border-[#BF9B7A]/30 hover:bg-[#FAF6F0]'
          }`}
        >
          {isHindi ? 'सभी प्रपत्र (38)' : 'All Forms (38)'}
        </button>
        <button
          type="button"
          onClick={() => setFilter('plfs')}
          className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
            filter === 'plfs'
              ? 'bg-[#555934] text-white font-bold'
              : 'bg-white border border-[#BF9B7A]/30 hover:bg-[#FAF6F0]'
          }`}
        >
          {isHindi ? 'पीएलएफएस परिवार (24)' : 'PLFS Household (24)'}
        </button>
        <button
          type="button"
          onClick={() => setFilter('ashe')}
          className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
            filter === 'ashe'
              ? 'bg-[#555934] text-white font-bold'
              : 'bg-white border border-[#BF9B7A]/30 hover:bg-[#FAF6F0]'
          }`}
        >
          {isHindi ? 'एएसएचई उद्यम (14)' : 'ASHE Enterprise (14)'}
        </button>
        <button
          type="button"
          onClick={() => setFilter('query')}
          className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
            filter === 'query'
              ? 'bg-amber-600 text-white font-bold'
              : 'bg-white border border-[#BF9B7A]/30 hover:bg-[#FAF6F0]'
          }`}
        >
          {isHindi ? 'विसंगति पर्चियां (1)' : 'Query Slips (1)'}
        </button>
      </div>

      {/* Schedule Table */}
      <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-5 shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#BF9B7A]/20 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              <th className="pb-3 pl-2">Schedule ID</th>
              <th className="pb-3">Type & Unit</th>
              <th className="pb-3 hidden md:table-cell">CEB / Location</th>
              <th className="pb-3 hidden sm:table-cell">GPS Accuracy</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 pr-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#BF9B7A]/15">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-[#FAF6F0]/50 transition-colors">
                <td className="py-3.5 pl-2 font-mono font-bold text-[#555934]">{item.id}</td>
                <td className="py-3.5 pr-3">
                  <p className="font-bold text-[#2d1f17]">{item.scheduleType}</p>
                  <p className="text-[11px] text-muted-foreground">{item.sampleUnit}</p>
                </td>
                <td className="py-3.5 pr-3 hidden md:table-cell text-muted-foreground">
                  {item.villageBlock}
                </td>
                <td className="py-3.5 pr-3 hidden sm:table-cell font-mono text-[11px] text-muted-foreground">
                  {item.gpsLock}
                </td>
                <td className="py-3.5 pr-3">
                  {item.status === 'ready' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-800 border border-emerald-500/30">
                      <CheckCircle2 className="h-3 w-3" />
                      Ready to Upload
                    </span>
                  )}
                  {item.status === 'validated' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-800 border border-blue-500/30">
                      <ShieldCheck className="h-3 w-3" />
                      Validated
                    </span>
                  )}
                  {item.status === 'query_pending' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-800 border border-amber-500/30">
                      <AlertTriangle className="h-3 w-3" />
                      Query Pending
                    </span>
                  )}
                </td>
                <td className="py-3.5 pr-2 text-right">
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        `Inspecting schedule return ${item.id} (${item.scheduleType}). All 14 data blocks encrypted.`
                      )
                    }
                    className="px-3 py-1 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/40 font-bold text-[#555934] hover:bg-[#F2E6D8] transition-colors cursor-pointer"
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
