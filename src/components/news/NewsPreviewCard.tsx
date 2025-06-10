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
    <div className="flex flex-col">
      {news.image_url && !imageError && (
        <div className="relative w-full h-[330px] md:h-[500px]">
          {!imageError && (
            <img
              src={news.image_url}
              alt={news.title}
              className={`w-full h-full object-contain transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
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

      <div className="space-y-0.5 p-1.5">
        <div className="flex items-center justify-center gap-1">
          <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 break-words text-center">{news.title}</h3>
        </div>
        <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
          <Badge variant="outline" className="bg-gray-100 text-xs px-1.5 py-0.5 rounded-md whitespace-nowrap shrink-0">
            {news.campus?.name || "Unknown Campus"}
          </Badge>
          <span className="whitespace-nowrap">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
