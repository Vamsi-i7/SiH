import { Skeleton } from '@/components/ui/Skeleton';

export default function DocumentsLoading() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="rounded-2xl bg-white p-6 shadow-card space-y-3">
        <Skeleton className="h-6 w-52" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      <div className="rounded-2xl border-2 border-dashed border-[#BF9B7A]/40 bg-[#F2E6D8]/20 p-8 flex flex-col items-center justify-center space-y-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-3 w-64" />
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-card space-y-4">
        <Skeleton className="h-5 w-40" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-[#F2E6D8]/20">
              <div className="space-y-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
