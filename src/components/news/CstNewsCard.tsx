import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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

  const handleImageError = () => {
    console.log(`Image load failed for index ${index}, retry count: ${retryCount}`);
    if (retryCount < 5) {
      setRetryCount(prev => prev + 1);
      setImageLoading(true);
      
      // Force reload after a short delay
      setTimeout(() => {
        if (imageRef.current && news.image_url) {
          // Add cache-busting parameter for mobile
          const cacheBuster = isMobile ? `?t=${Date.now()}` : '';
          imageRef.current.src = `${news.image_url}${cacheBuster}`;
        }
      }, isMobile ? 100 : 300);
    }
  };

  const handleImageLoad = () => {
    console.log(`Image loaded successfully for index ${index}`);
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

  return (
    <Link 
      to={`/news/${news.id}`}
      className="block relative h-full touch-pan-y"
      style={{ touchAction: 'pan-y' }}
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
    </Link>
  );
} 