import { useState } from "react";
import { Link } from "react-router-dom";
import type { NewsItem } from "@/types/news";

interface NewsPreviewCardProps {
  news: NewsItem;
  variant: "cst" | "main" | "other";
  isImageLoaded?: boolean;
  showTitle?: boolean;
}

export default function NewsPreviewCard({ news, variant, isImageLoaded = false, showTitle = true }: NewsPreviewCardProps) {
  const [imageLoading, setImageLoading] = useState(!isImageLoaded);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const getImageHeight = () => {
    switch (variant) {
      case "cst":
        return "h-[330px] md:h-[500px]";
      case "main":
        return "h-[200px] md:h-[300px]";
      case "other":
        return "h-[180px] md:h-[250px]";
      default:
        return "h-[200px]";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Link 
      to={`/news/${news.id}`}
      className="block"
    >
      <div className="relative">
        {imageLoading && (
          <div className={`${getImageHeight()} w-full bg-gray-100 animate-pulse`} />
        )}
        <img
          src={news.image_url}
          alt={news.title}
          className={`${getImageHeight()} w-full object-contain ${
            imageLoading ? 'hidden' : 'block'
          }`}
          onLoad={handleImageLoad}
        />
      </div>
      {showTitle ? (
        <div className="mt-1 space-y-1 p-1 text-center">
          <h3 className="text-xs font-medium text-gray-900 line-clamp-2">
            {news.title}
          </h3>
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500">
            <span>{news.source_url ? new URL(news.source_url).hostname.replace('www.', '') : 'GSU'}</span>
            <span>•</span>
            <span>{formatDate(news.published_at)}</span>
          </div>
        </div>
      ) : (
        <div className="h-[100px]" />
      )}
    </Link>
  );
} 
