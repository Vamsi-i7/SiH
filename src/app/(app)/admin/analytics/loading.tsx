import { Skeleton } from '@/components/ui/Skeleton';

export default function AdminAnalyticsLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto py-6 animate-fadeIn">
      {/* Header */}
      <div className="rounded-2xl bg-white p-6 shadow-card space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-white p-5 shadow-card space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-36" />
          </div>
        ))}
      </div>

      {/* Department Breakdown & Priority Flags */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-2xl bg-white p-6 shadow-card space-y-4">
          <Skeleton className="h-5 w-48" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl bg-[#F2E6D8]/20 p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 rounded-2xl bg-white p-6 shadow-card space-y-4">
          <Skeleton className="h-5 w-36" />
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="rounded-xl bg-[#8C5B3E]/10 p-4 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
