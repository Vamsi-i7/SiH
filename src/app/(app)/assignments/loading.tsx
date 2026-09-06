import { Skeleton } from '@/components/ui/Skeleton';

export default function AssignmentsLoading() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="rounded-2xl bg-white p-6 shadow-card space-y-3">
        <Skeleton className="h-6 w-52" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-9 w-24 rounded-xl" />
        <Skeleton className="h-9 w-24 rounded-xl" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>

      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-white p-6 shadow-card space-y-3">
            <div className="flex justify-between items-start">
              <Skeleton className="h-5 w-64" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-4 w-3/4" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-28 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
