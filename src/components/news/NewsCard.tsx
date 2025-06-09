import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import type { NewsItem } from "../../types/news";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function NewsCard({ title, content, campus, published_at }: NewsItem) {
  const formattedDate = new Date(published_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-2 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3 className="text-lg font-semibold break-words">{title}</h3>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className="bg-gray-100 text-xs px-2 py-0.5 rounded-md whitespace-nowrap">
              {campus?.name || 'Unknown Campus'}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="whitespace-nowrap">{formattedDate}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-gray-700 break-words">{content}</p>
      </CardContent>
    </Card>
  );
} 