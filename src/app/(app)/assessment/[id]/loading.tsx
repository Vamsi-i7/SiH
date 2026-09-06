import { Skeleton } from '@/components/ui/Skeleton';

export default function AssessmentLoading() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6 animate-fadeIn">
      {/* Assessment Header */}
      <div className="rounded-2xl bg-white p-6 shadow-card space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-80 max-w-full" />
        <div className="pt-2 flex gap-3">
          <Skeleton className="h-8 w-28 rounded-xl" />
          <Skeleton className="h-8 w-28 rounded-xl" />
        </div>
      </div>

      {/* Question Card Skeleton */}
      <div className="rounded-2xl bg-white p-6 shadow-card space-y-5">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-5 w-4/5" />

        <div className="space-y-3 pt-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-[#F2E6D8]">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
