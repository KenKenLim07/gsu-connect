import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import type { NewsItem } from "../../../types/news";

export default function NewsCard({ news }: { news: NewsItem }) {
  const campus = news.campus?.name ?? "Unknown";
  const published = formatDistanceToNow(new Date(news.published_at), {
    addSuffix: true,
  });

  return (
    <Card className="border border-neutral-400 rounded-xl p-3 bg-white text-neutral-900 shadow-sm">
      <CardContent className="p-0 space-y-1.5">
        <div className="flex items-center justify-between">
          <Badge className="px-2 py-1 rounded-md border border-neutral-400 text-xs">
            {campus}
          </Badge>
          <span className="text-sm text-neutral-600">{published}</span>
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 break-words">{news.title}</h3>
        <p className="text-sm leading-relaxed text-neutral-600 break-words">{news.content}</p>
        <div className="flex items-center justify-between pt-2">
          {news.source_url && (
            <a
              href={news.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-neutral-400 bg-neutral-100 text-neutral-700 hover:text-neutral-900 text-xs break-all max-w-full"
            >
              <span>View Source</span>
              <span className="ml-0.5">→</span>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 