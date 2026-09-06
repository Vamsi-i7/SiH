import { Skeleton } from '@/components/ui/Skeleton';

export default function MCQGeneratorLoading() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6 animate-fadeIn">
      {/* Header */}
      <div className="rounded-2xl bg-white p-6 shadow-card space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-60" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* Selector and Generator Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white p-6 shadow-card space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-card space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>

      {/* Generation Panel */}
      <div className="rounded-2xl bg-white p-6 shadow-card space-y-4">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="flex justify-end pt-2">
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
