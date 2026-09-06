import { Skeleton } from '@/components/ui/Skeleton';

export default function SkillGapLoading() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="rounded-2xl bg-white p-6 shadow-card space-y-3">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-white p-5 shadow-card space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-40" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-card space-y-4">
        <Skeleton className="h-5 w-44" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl bg-[#F2E6D8]/25 p-4 space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-52" />
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
