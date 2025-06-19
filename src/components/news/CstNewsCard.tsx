import { useState, useEffect, useRef } from "react";
import type { NewsItem } from "../../types/news";

interface CstNewsCardProps {
  news: NewsItem;
  isImageLoaded?: boolean;
  index: number;
  onImageLoaded: (index: number) => void;
  canLoad: boolean;
}

export default function CstNewsCard({ news, isImageLoaded = false, index, onImageLoaded, canLoad }: CstNewsCardProps) {
  const [imageLoading, setImageLoading] = useState(!isImageLoaded);
  const [isVisible, setIsVisible] = useState(false);
  const [loadAttempted, setLoadAttempted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Start loading when canLoad becomes true
  useEffect(() => {
    if (canLoad && !isVisible) {
      setIsVisible(true);
      setLoadAttempted(true);
    }
  }, [canLoad, isVisible]);

  // Setup intersection observer with mobile-specific settings
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && canLoad) {
            setIsVisible(true);
            setLoadAttempted(true);
          }
        });
      },
      {
        root: null,
        rootMargin: isMobile ? '300px 0px' : '1500px 0px',
        threshold: isMobile ? 0.1 : 0
      }
    );

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [canLoad, isMobile]);

  // Force load after a delay if not loaded
  useEffect(() => {
    if (canLoad && !loadAttempted) {
      const timer = setTimeout(() => {
        if (!loadAttempted) {
          setIsVisible(true);
          setLoadAttempted(true);
        }
      }, isMobile ? 100 : 500);

      return () => clearTimeout(timer);
    }
  }, [canLoad, loadAttempted, isMobile]);

  // Cleanup retry timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  const handleImageError = () => {
    if (retryCount < 3) { // Reduced retry attempts
      setRetryCount(prev => prev + 1);
      setImageLoading(true);
      
      // Clear any existing retry timeout
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }

      // Force reload with exponential backoff
      retryTimeoutRef.current = setTimeout(() => {
        if (imageRef.current && news.image_url) {
          const timestamp = Date.now();
          const separator = news.image_url.includes('?') ? '&' : '?';
          imageRef.current.src = `${news.image_url}${separator}t=${timestamp}`;
        }
      }, Math.min(1000 * Math.pow(2, retryCount), 5000)); // Exponential backoff with max 5s
    } else {
      // After max retries, show a fallback or error state
      setImageLoading(false);
      onImageLoaded(index);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setLoadAttempted(true);
    onImageLoaded(index);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleViewSource = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (news.source_url) {
      window.open(news.source_url, '_blank', 'noopener,noreferrer');
    }
    setShowMenu(false);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: news.content.substring(0, 100),
          url: news.source_url || window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `${news.title}\n\n${news.content.substring(0, 100)}...\n\nRead more: ${news.source_url || window.location.href}`;
      try {
        await navigator.clipboard.writeText(shareText);
        // You could add a toast notification here
        console.log('Content copied to clipboard');
      } catch (error) {
        console.error('Failed to copy to clipboard');
      }
    }
    setShowMenu(false);
  };

  return (
    <div 
      className="block relative h-full"
    >
      <div ref={containerRef} className="relative h-full overflow-hidden rounded-lg bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex h-full">
          {/* Left side - Image (wider) */}
          <div className="w-[53%] h-full relative">
            {imageLoading && (
              <div className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
            )}
            {isVisible && (
              <img
                ref={imageRef}
                src={news.image_url}
                alt={news.title}
                className={`w-full h-full object-cover ${
                  imageLoading ? 'hidden' : 'block'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading={isMobile ? "eager" : "lazy"}
                decoding={isMobile ? "async" : "auto"}
              />
            )}
          </div>

          {/* Right side - Content */}
          <div className="w-[47%] h-full flex flex-col p-3">
            {/* CST Badge at top of title */}
            <div className="mb-1 flex justify-between items-center relative">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-300 underline underline-offset-2">
                CST
              </span>
              <div ref={menuRef} className="relative">
                <button 
                  onClick={handleMenuClick}
                  className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 transition-colors p-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute right-0 top-6 z-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg min-w-[140px]">
                    <button
                      onClick={handleViewSource}
                      className="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View Source
                    </button>
                    <button
                      onClick={handleShare}
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
            
            {/* Title and Content - Flexible area */}
            <div className="flex-1 min-h-0 space-y-3 overflow-hidden">
              <h3
                className="text-xs font-semibold text-gray-900 dark:text-gray-100 leading-tight line-clamp-4 underline decoration-gray-400 dark:decoration-gray-500 underline-offset-2 cursor-pointer hover:decoration-2 transition"
                onClick={() => {
                  if (news.source_url) {
                    window.open(news.source_url, '_blank', 'noopener,noreferrer');
                  }
                }}
                tabIndex={0}
                role="link"
                aria-label="Read full article"
              >
                {news.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-5">
                {news.content}
              </p>
            </div>

            {/* Date and source - Fixed at bottom */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
              <span className="truncate">
                {news.source_url ? new URL(news.source_url).hostname.replace('www.', '') : 'GSU'}
              </span>
              <span>•</span>
              <span className="whitespace-nowrap">{formatDate(news.published_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 