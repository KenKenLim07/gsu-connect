import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import type { NewsItem } from "../../types/news";

export default function NewsPreviewCard({ news }: { news: NewsItem }) {
  const formattedDate = new Date(news.published_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Truncate content to 100 characters for more compact preview
  const previewContent = news.content.length > 100
    ? news.content.slice(0, 100) + "..."
    : news.content;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-1 p-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold break-words line-clamp-1">{news.title}</h3>
          <Badge variant="outline" className="bg-gray-100 text-xs px-2 py-0.5 rounded-md whitespace-nowrap shrink-0">
            {news.campus?.name || 'Unknown Campus'}
          </Badge>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <span className="whitespace-nowrap">{formattedDate}</span>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-sm text-gray-700 break-words line-clamp-2">{previewContent}</p>
      </CardContent>
    </Card>
  );
} 