import { Skeleton } from '@/components/ui/Skeleton';

export default function ProfileLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Profile Header */}
      <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-center gap-6">
        <Skeleton className="h-24 w-24 rounded-full shrink-0" />
        <div className="space-y-3 text-center sm:text-left flex-1">
          <Skeleton className="h-7 w-48 mx-auto sm:mx-0" />
          <Skeleton className="h-4 w-64 mx-auto sm:mx-0" />
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-32 rounded-full" />
          </div>
        </div>
      </div>

      {/* Details Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white p-6 shadow-card space-y-4">
          <Skeleton className="h-5 w-36" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-card space-y-4">
          <Skeleton className="h-5 w-36" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
