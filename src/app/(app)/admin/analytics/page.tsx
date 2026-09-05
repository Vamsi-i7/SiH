import { getAuthenticatedUser } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  await getAuthenticatedUser();

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Workforce Intelligence & Analytics</h1>
          <p className="text-sm text-slate-500">
            Cadre-wide readiness indices, competency heatmaps, and simulated outcome correlations.
          </p>
        </div>
        <ProvenanceBadge provenance="SYNTHETIC_DEMO_DATA" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Total Survey Workforce</CardTitle>
            <div className="text-3xl font-bold text-slate-900 mt-2">1,420</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Average Readiness Index</CardTitle>
            <div className="text-3xl font-bold text-slate-900 mt-2">68.4%</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Critical Gaps Identified</CardTitle>
            <div className="text-3xl font-bold text-rose-600 mt-2">312</div>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Phase 6 Pipeline: MoSPI Executive Dashboard</CardTitle>
          <CardDescription>
            High-level workforce readiness and training outcome correlation analytics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-200 text-slate-500 text-sm">
            📊 Interactive Workforce Heatmaps & Training Impact Analytics (Phase 6)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
