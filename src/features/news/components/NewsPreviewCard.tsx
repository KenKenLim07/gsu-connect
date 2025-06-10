import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { NewsItem } from "@/types/news";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

interface NewsPreviewCardProps {
  news?: NewsItem;
  index?: number;
}

export default function NewsPreviewCard({ news, index = 0 }: NewsPreviewCardProps) {
  if (!news) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <Card className="border border-neutral-200 hover:border-neutral-300 transition-colors duration-200">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                Loading...
              </Badge>
              <span className="text-xs text-neutral-500">Loading...</span>
            </div>
            <div className="h-4 bg-neutral-200 rounded animate-pulse" />
            <div className="h-3 bg-neutral-200 rounded animate-pulse" />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const campus = news.campus?.name ?? "Unknown";
  const published = formatDistanceToNow(new Date(news.published_at), {
    addSuffix: true,
  });

  // Truncate content to 100 characters
  const truncatedContent = news.content.length > 100
    ? `${news.content.substring(0, 100)}...`
    : news.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="border border-neutral-200 hover:border-neutral-300 transition-colors duration-200">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {campus}
            </Badge>
            <span className="text-xs text-neutral-500">{published}</span>
          </div>
          <h3 className="font-semibold text-neutral-900 line-clamp-2">
            {news.title}
          </h3>
          <p className="text-sm text-neutral-600 line-clamp-2">
            {truncatedContent}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
} 