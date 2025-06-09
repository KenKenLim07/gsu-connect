import { Card, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import type { NewsItem } from "../../types/news";
import { useState } from "react";

export default function NewsPreviewCard({ news }: { news: NewsItem }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formattedDate = new Date(news.published_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="overflow-hidden">
      {news.image_url && !imageError && (
        <div className="relative w-full h-[330px] md:h-[900px] lg:h-[750px] overflow-hidden bg-gray-200">
          {!imageError && (
            <img
              src={news.image_url}
              alt={news.title}
              className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              style={{ objectPosition: 'center top' }}
              onError={() => {
                console.error("Image failed to load:", news.image_url);
                setImageError(true);
              }}
              onLoad={() => setImageLoaded(true)}
            />
          )}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      )}

      <CardHeader className="space-y-1 p-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 break-words">{news.title}</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Badge variant="outline" className="bg-gray-100 text-xs px-2 py-0.5 rounded-md whitespace-nowrap shrink-0">
            {news.campus?.name || "Unknown Campus"}
          </Badge>
          <span className="whitespace-nowrap">{formattedDate}</span>
        </div>
      </CardHeader>
    </Card>
  );
}
