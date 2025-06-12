import type { NewsItem } from "../../types/news";

interface NewsPreviewCardProps {
  news: NewsItem;
  variant?: 'main' | 'cst';
}

export default function NewsPreviewCard({ 
  news, 
  variant = 'main'
}: NewsPreviewCardProps) {
  const formattedDate = new Date(news.published_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const defaultImage = "https://placehold.co/800x500/9ca3af/ffffff?text=%F0%9F%94%B4%0ANo+image+from+the+source&textSize=small";

  const handleClick = () => {
    if (news.source_url) {
      window.open(news.source_url, '_blank');
    }
  };

  return (
    <div 
      className="cursor-pointer hover:opacity-90 transition-opacity"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <div className={`relative w-full ${variant === 'main' ? 'aspect-[16/9]' : 'h-[330px] md:h-[500px]'}`}>
        <img
          src={news.image_url || defaultImage}
          alt={news.title}
          className={`w-full h-full ${
            variant === 'main' 
              ? 'object-cover object-bottom' 
              : 'object-contain'
          }`}
        />
      </div>

      <div className="mt-1 h-[60px]">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 text-center">{news.title}</h3>
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-gray-500">
          <span className="px-1.5 py-0.5 bg-gray-100 rounded-md whitespace-nowrap">
            {news.source_url ? new URL(news.source_url).hostname.replace('www.', '') : 'GSU'}
          </span>
          <span className="whitespace-nowrap">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
} 
