import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      {/* Main skeleton with a vibrant and vigorous shimmer effect */}
      <div className="relative h-[100px] w-[560px] rounded-xl bg-gray-250 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white-500 via-white-100 to-purple-5000 animate-shimmer opacity-80 blur-2xl"></div>
        <Skeleton className="h-full w-full" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-2 w-[560px] bg-gradient-to-r from-white-400 to-white-800" />
        <Skeleton className="h-2 w-[420px] bg-gradient-to-r from-white-400 to-white-100" />
      </div>
    </div>
  );
}
