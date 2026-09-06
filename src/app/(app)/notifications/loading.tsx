import { Skeleton } from '@/components/ui/Skeleton';

export default function NotificationsLoading() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6 animate-fadeIn">
      {/* Header */}
      <div className="rounded-2xl bg-white p-6 shadow-card space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-8 w-28 rounded-xl" />
        </div>
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Skeleton className="h-9 w-20 rounded-xl" />
        <Skeleton className="h-9 w-20 rounded-xl" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>

      {/* Notification items */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-white p-4.5 shadow-card flex items-start gap-3">
            <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
