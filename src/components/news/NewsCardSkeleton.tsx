import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function NewsCardSkeleton() {
  return (
    <Card className="overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]" />
      <CardHeader className="space-y-2 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <Skeleton className="h-6 w-3/4" />
          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-32" />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-4/6" />
      </CardContent>
    </Card>
  );
} 