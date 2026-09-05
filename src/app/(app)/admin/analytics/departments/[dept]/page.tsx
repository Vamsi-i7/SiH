import { getAuthenticatedUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ProgressRing } from '@/components/ProgressRing';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ dept: string }>;
}

export default async function DepartmentDrilldownPage({ params }: PageProps) {
  const user = await getAuthenticatedUser();
  if (!user || user.app_metadata?.role !== 'admin') {
    redirect('/dashboard');
  }

  const { dept } = await params;
  const decodedDept = decodeURIComponent(dept);

  // Mock department officials for demo
  const officials = [
    {
      id: 'usr-1',
      name: 'Sunita Devi',
      designation: 'Field Investigator (NSSO FOD)',
      cadre: 'NSSO Field Operations Division',
      readiness: 72,
      topGap: 'Census Boundary Demarcation',
      isVerified: true,
      lastActive: '2026-09-05',
    },
    {
      id: 'usr-2',
      name: 'Ramesh Patel',
      designation: 'Field Investigator',
      cadre: 'NSSO Field Operations Division',
      readiness: 48,
      topGap: 'CAPI Tablet Synchronization',
      isVerified: false,
      lastActive: '2026-09-04',
    },
    {
      id: 'usr-3',
      name: 'Pooja Verma',
      designation: 'Senior Field Investigator',
      cadre: 'NSSO Field Operations Division',
      readiness: 84,
      topGap: 'Schedule 0.0 Household Listing',
      isVerified: true,
      lastActive: '2026-09-06',
    },
  ];

  const avgReadiness = Math.round(
    officials.reduce((acc, o) => acc + o.readiness, 0) / officials.length
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link href="/admin/analytics" className="hover:text-primary transition-colors">
              Admin Workforce Intelligence
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{decodedDept}</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{decodedDept} — Department Roster</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Individual official capability profiles and verified competency verification badges.
          </p>
        </div>
        <ProvenanceBadge provenance="VERIFIED_OFFICIAL" />
      </div>

      {/* Aggregate KPI Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-semibold text-muted-foreground">Assigned Personnel</CardTitle>
            <div className="text-3xl font-black text-foreground mt-1">{officials.length}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-semibold text-muted-foreground">Department Average Readiness</CardTitle>
            <div className="text-3xl font-black text-foreground mt-1">{avgReadiness}%</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-semibold text-muted-foreground">Capability Action</CardTitle>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-2">
              Cohort Scheduled on iGOT
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Officials Roster Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold text-foreground">Personnel Competency Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold">
                  <th className="py-3 px-4">Official Name</th>
                  <th className="py-3 px-4">Cadre & Designation</th>
                  <th className="py-3 px-4">Readiness Index</th>
                  <th className="py-3 px-4">Primary Gap</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {officials.map((official) => (
                  <tr key={official.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-foreground">{official.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{official.designation}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <ProgressRing value={official.readiness} size={32} strokeWidth={3} />
                        <span className="font-bold text-foreground">{official.readiness}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-rose-500">{official.topGap}</td>
                    <td className="py-3 px-4">
                      {official.isVerified ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          🛡️ Assessment-Verified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                          ✍️ Self-Assessed
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href="/profile"
                        className="px-3 py-1.5 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground text-foreground font-semibold text-xs transition-colors inline-block"
                      >
                        View Profile →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
