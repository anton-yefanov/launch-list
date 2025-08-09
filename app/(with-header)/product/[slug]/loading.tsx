import { Skeleton } from "@/components/ui/skeleton";
import { ScrollToTop } from "@/components/scroll-to-top";
import BackButton from "@/app/(with-header)/product/[slug]/_components/back-button";

export default function Loading() {
  return (
    <div>
      <ScrollToTop />
      <div className="mb-4">
        <BackButton />
      </div>

      <div className="bg-white rounded-lg pb-4">
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          <div className="shrink-0">
            <Skeleton className="w-20 h-20 rounded-lg" />
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="mb-2">
                  <Skeleton className="h-8 w-[110px] mb-2" />
                </div>

                <div className="mb-3">
                  <Skeleton className="h-6 w-[210px] mb-2" />
                </div>

                <div className="flex flex-wrap gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Skeleton className="h-10 w-full sm:w-32" />
                <Skeleton className="h-10 w-full sm:w-32" />
              </div>
            </div>
          </div>
        </div>

        {/* Screenshot skeleton */}
        <Skeleton className="h-80 mb-8 w-full rounded-lg" />

        {/* Description skeleton */}
        <div className="mb-8">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="bg-gray-50 rounded-lg p-4">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
