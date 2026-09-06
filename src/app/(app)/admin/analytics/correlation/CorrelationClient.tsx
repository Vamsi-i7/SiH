'use client';

import React, { useState } from 'react';
import { type OutcomeCorrelationSeries } from '@/lib/types';
import { ScatterChart } from '@/components/ScatterChart';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface CorrelationClientProps {
  seriesList: OutcomeCorrelationSeries[];
}

export function CorrelationClient({ seriesList }: CorrelationClientProps) {
  const [selectedId, setSelectedId] = useState<string>(seriesList[0]?.id || '');
  const activeSeries = seriesList.find((s) => s.id === selectedId) || seriesList[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6">
      {/* Navigation Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link href="/admin/analytics" className="hover:text-primary transition-colors">
              Admin Workforce Intelligence
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Outcome Correlation</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Training → Field Survey Outcome Correlation
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Demonstrating the direct statistical impact of FRAC competency enhancement on MoSPI field scrutiny error rates.
          </p>
        </div>
        <ProvenanceBadge provenance="SYNTHETIC_DEMO_DATA" />
      </div>

      {/* Series Metric Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {seriesList.map((series) => {
          const isActive = series.id === selectedId;
          return (
            <button
              key={series.id}
              onClick={() => setSelectedId(series.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {series.metricName}
            </button>
          );
        })}
      </div>

      {/* Main Chart Card */}
      {activeSeries && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <ScatterChart
              dataPoints={activeSeries.dataPoints}
              xAxisLabel={activeSeries.xAxisLabel}
              yAxisLabel={activeSeries.yAxisLabel}
            />

            {/* Regression Summary Banner */}
            <div className="p-4 bg-[--color-destructive]/10 border border-[--color-destructive]/20 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[--color-destructive]">
                  Statistical Regression (Ordinary Least Squares)
                </p>
                <p className="text-sm font-semibold text-foreground mt-0.5">
                  {activeSeries.narrativeInsight}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-muted-foreground">R² Correlation</span>
                <p className="text-lg font-black text-foreground">{activeSeries.rSquared}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Methodology & Context */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold text-foreground">
                  Institutional Methodology Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-muted-foreground">
                <p>{activeSeries.methodologyNote}</p>
                <div className="p-3 bg-muted rounded-lg border border-border space-y-1.5">
                  <p className="font-semibold text-foreground">Why this matters to MoSPI:</p>
                  <p>
                    Traditional training metrics only measure course completion. StatVidya closes the loop by correlating diagnosed competency with published Field Operations Division Schedule error frequencies.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold text-foreground">Audited Cadres</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {activeSeries.dataPoints.map((pt) => (
                    <div
                      key={pt.id}
                      className="flex items-center justify-between text-xs p-2 rounded-lg bg-background border border-border"
                    >
                      <span className="font-medium text-foreground">{pt.departmentName}</span>
                      <span className="font-bold text-rose-500">{pt.errorRatePercent}% error</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
