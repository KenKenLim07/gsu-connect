import { useState } from "react";
import { Link } from "react-router-dom";
import type { NewsItem } from "@/types/news";

interface NewsPreviewCardProps {
  news: NewsItem;
  variant: "main" | "other";
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
      case "main":
        return "h-[180px] sm:h-[220px] md:h-[280px] lg:h-[320px]";
      case "other":
        return "h-[160px] sm:h-[200px] md:h-[240px] lg:h-[280px]";
      default:
        return "h-[180px]";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  };

  const handleClick = (e: React.MouseEvent) => {
    if (news.source_url) {
      e.preventDefault();
      window.open(news.source_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Link 
      to={news.source_url ? '#' : `/news/${news.id}`}
      onClick={handleClick}
      className="block relative"
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
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm mt-1 space-y-0.5 p-1 md:p-[15px] text-center">
          <h3 className="text-[9px] sm:text-[10px] md:text-[10px] font-medium text-gray-900 line-clamp-2 px-1 w-full overflow-hidden">
            {news.title}
          </h3>
          <div className="flex items-center justify-center gap-1 text-[6px] sm:text-[7px] md:text-[8px] text-gray-500 px-1 w-full">
            <span className="truncate max-w-[60px] md:max-w-[70px]">{news.source_url ? new URL(news.source_url).hostname.replace('www.', '') : 'GSU'}</span>
            <span>•</span>
            <span>{formatDate(news.published_at)}</span>
        </div>
        </div>
      ) : (
        <div className="h-[70px] sm:h-[80px]" />
      )}
    </Link>
  );
} 
