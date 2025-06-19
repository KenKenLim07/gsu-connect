import { useState } from "react";
import type { NewsItem } from "@/types/news";
import { motion } from "framer-motion";

interface MainCampusNewsProps {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
}

export default function MainCampusNews({ news, loading, error }: MainCampusNewsProps) {
  const [showMenu, setShowMenu] = useState<number | null>(null);

  // Get only the 3 most recent news items with images for better visibility
  const filteredNews = news
    .filter(item => item.image_url)
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleMenuClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setShowMenu(showMenu === index ? null : index);
  };

  const handleViewSource = (e: React.MouseEvent, item: NewsItem) => {
    e.stopPropagation();
    if (item.source_url) {
      window.open(item.source_url, '_blank', 'noopener,noreferrer');
    }
    setShowMenu(null);
  };

  const handleShare = async (e: React.MouseEvent, item: NewsItem) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.content.substring(0, 100),
          url: item.source_url || window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `${item.title}\n\n${item.content.substring(0, 100)}...\n\nRead more: ${item.source_url || window.location.href}`;
      try {
        await navigator.clipboard.writeText(shareText);
        console.log('Content copied to clipboard');
      } catch (error) {
        console.error('Failed to copy to clipboard');
      }
    }
    setShowMenu(null);
  };

  // Close menu when clicking outside
  const handleClickOutside = () => {
    setShowMenu(null);
  };

  // Show loading state
  if (loading && (!news || news.length === 0)) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            <div className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 dark:bg-gray-800 animate-pulse rounded w-3/4" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800 animate-pulse rounded w-1/2" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 dark:bg-gray-800 animate-pulse rounded w-full" />
                <div className="h-3 bg-gray-100 dark:bg-gray-800 animate-pulse rounded w-5/6" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 bg-gray-100 dark:bg-gray-800 animate-pulse rounded w-20" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-red-600 dark:text-red-200 font-medium mb-2">Failed to load news</p>
          <p className="text-red-500 dark:text-red-300 text-sm mb-3">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 bg-red-600 dark:bg-red-700 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-800 transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show empty state
  if (filteredNews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-gray-500 dark:text-gray-300 font-medium">No news available</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Check back later for updates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" onClick={handleClickOutside}>
      {filteredNews.map((item, index) => (
        <article
          key={item.id}
          className="group bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300"
        >
          {/* Image */}
          <div className="relative h-40 overflow-hidden">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="p-2 space-y-1.5">
            {/* Title with Menu */}
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2 text-sm flex-1">
                {item.title}
              </h3>
              <div className="relative">
                <button 
                  onClick={(e) => handleMenuClick(e, index)}
                  className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 transition-colors p-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {showMenu === index && (
                  <div className="absolute right-0 top-6 z-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg min-w-[140px]">
                    <button
                      onClick={(e) => handleViewSource(e, item)}
                      className="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View Source
                    </button>
                    <button
                      onClick={(e) => handleShare(e, item)}
                      className="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-t border-gray-100 dark:border-gray-800 flex items-center gap-2"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      Share
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Meta + Read full article */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
              <div className="flex items-center gap-1.5">
                <span>gsu.edu.ph</span>
                <span>•</span>
                <span>{formatDate(item.published_at)}</span>
              </div>
              {item.source_url && (
                <a
                  href={item.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-transparent text-xs font-medium text-gray-600 dark:text-gray-300 underline decoration-black/70 dark:decoration-white/70 underline-offset-2 hover:decoration-2 transition-colors"
                >
                  Read full article
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
} 