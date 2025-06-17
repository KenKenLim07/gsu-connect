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
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleClick = () => {
    if (news.source_url) {
      window.open(news.source_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="block relative h-full cursor-pointer hover:opacity-90 transition-opacity"
      style={{ touchAction: 'pan-y pinch-zoom' }}
    >
      <div ref={containerRef} className="relative h-full overflow-hidden rounded-lg">
        {imageLoading && (
          <div className="h-full w-full bg-gray-100 animate-pulse" />
        )}
        {isVisible && (
          <img
            ref={imageRef}
            src={news.image_url}
            alt={news.title}
            className={`h-[239%] w-full object-cover object-top ${
              imageLoading ? 'hidden' : 'block'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading={isMobile ? "eager" : "lazy"}
            decoding={isMobile ? "async" : "auto"}
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm mt-1 space-y-1 p-1 text-center">
          <h3 className="text-xs font-medium text-gray-900 line-clamp-2">
            {news.title}
          </h3>
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500">
            <span>{news.source_url ? new URL(news.source_url).hostname.replace('www.', '') : 'GSU'}</span>
            <span>•</span>
            <span>{formatDate(news.published_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 