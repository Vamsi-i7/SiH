import { Skeleton } from '@/components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* 1. Header Banner Skeleton */}
      <section className="rounded-2xl bg-white p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-6 w-56 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
        <Skeleton className="h-8 w-72 max-w-full" />
        <Skeleton className="h-4 w-3/4 max-w-xl" />
      </section>

      {/* 2. Metric Cards (4 cards) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-white p-5 shadow-card space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-20 rounded-full" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-36" />
          </div>
        ))}
      </section>

      {/* 3. Radar & Diagnostics Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Readiness Ring */}
        <div className="lg:col-span-4 rounded-2xl bg-white p-6 shadow-card flex flex-col items-center justify-center space-y-4 min-h-[350px]">
          <Skeleton className="h-5 w-44 self-start" />
          <Skeleton className="h-40 w-40 rounded-full my-auto" />
          <div className="w-full space-y-2 pt-4">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </div>

        {/* Right Col: Radar Chart */}
        <div className="lg:col-span-8 rounded-2xl bg-white p-6 shadow-card space-y-4 min-h-[350px]">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-4">
            <div className="md:col-span-7 flex justify-center">
              <Skeleton className="h-64 w-64 rounded-full" />
            </div>
            <div className="md:col-span-5 space-y-3">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Actionable Gaps Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-2xl bg-white p-6 shadow-card space-y-4">
          <Skeleton className="h-5 w-40" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl bg-[#F2E6D8]/25 p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-6 w-36 rounded-full" />
                </div>
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 rounded-2xl bg-white p-6 shadow-card space-y-4">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-44 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      </section>
    </div>
  );
}
