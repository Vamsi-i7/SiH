import { Skeleton } from '@/components/ui/Skeleton';

export default function PathwaysLoading() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="rounded-2xl bg-white p-6 shadow-card space-y-3">
        <Skeleton className="h-6 w-52" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* Tabs / Filters */}
      <div className="flex gap-2">
        <Skeleton className="h-9 w-28 rounded-xl" />
        <Skeleton className="h-9 w-28 rounded-xl" />
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>

      {/* Pathways Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-white p-6 shadow-card space-y-4">
            <div className="flex justify-between items-start">
              <Skeleton className="h-4 w-20 rounded-full" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-12 w-full" />
            <div className="pt-2 flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
