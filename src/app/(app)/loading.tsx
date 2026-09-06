import { Skeleton } from '@/components/ui/Skeleton';

export default function AppLoading() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Skeleton */}
      <div className="rounded-2xl bg-white p-6 shadow-card space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-white p-5 shadow-card space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Content Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-2xl bg-white p-6 shadow-card space-y-4">
          <Skeleton className="h-5 w-40" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl bg-[#F2E6D8]/25 p-4 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 rounded-2xl bg-white p-6 shadow-card space-y-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
