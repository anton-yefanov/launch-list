import { Skeleton } from "@/components/ui/skeleton";
import { ScrollToTop } from "@/components/scroll-to-top";

export default function Loading() {
  return (
    <div>
      <ScrollToTop />
      <div>
        {/* Back button skeleton */}
        <Skeleton className="h-10 w-20 mb-4" />
      </div>
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          {/* Logo skeleton */}
          <Skeleton className="size-16 rounded-lg" />
          <div className="flex-1 text-center space-y-2">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
        </div>

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Skeleton className="size-5" />
              </div>
              <Skeleton className="h-6 w-12 mx-auto mb-1" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>

        {/* Features section skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-40" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-24" />
            ))}
          </div>
        </div>

        {/* About section skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-16" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Buttons skeleton */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    </div>
  );
}
