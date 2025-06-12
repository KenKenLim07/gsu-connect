import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import type { NewsItem } from "@/types/news";
import NewsPreviewCard from "./NewsPreviewCard";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MainCampusNewsProps {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
}

interface ImageDimensions {
  [key: string]: {
    width: number;
    height: number;
    isValid: boolean;
    isLoading: boolean;
  };
}

export default function MainCampusNews({ news, loading: parentLoading, error }: MainCampusNewsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions>({});
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const minSwipeDistance = 50;

  // Load and check image dimensions
  useEffect(() => {
    const loadImages = async () => {
      if (!news.length) return;

      // Initialize all images as loading
      const initialDimensions: ImageDimensions = {};
      news.forEach(item => {
        if (item.image_url) {
          initialDimensions[item.id] = {
            width: 0,
            height: 0,
            isValid: false,
            isLoading: true
          };
        }
      });
      setImageDimensions(initialDimensions);

      // Load each image independently
      for (const item of news) {
        if (!item.image_url) continue;
        
        try {
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = item.image_url!;
          });
          
          const aspectRatio = img.width / img.height;
          setImageDimensions(prev => ({
            ...prev,
            [item.id]: {
              width: img.width,
              height: img.height,
              isValid: aspectRatio >= 1 && aspectRatio <= 16/9,
              isLoading: false
            }
          }));
        } catch (error) {
          console.warn(`Failed to load image for news item ${item.id}:`, error);
          setImageDimensions(prev => ({
            ...prev,
            [item.id]: {
              width: 0,
              height: 0,
              isValid: false,
              isLoading: false
            }
          }));
        }
      }
    };

    loadImages();
  }, [news]);

  // Filter and sort news items
  const filteredNews = useMemo(() => {
    return news
      .filter(item => {
        const dimensions = imageDimensions[item.id];
        return item.image_url && dimensions?.isValid && !dimensions.isLoading;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10); // Limit to 10 latest items
  }, [news, imageDimensions]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredNews.length);
    }, 3300);
  }, [filteredNews.length]);

  useEffect(() => {
    if (filteredNews.length > 0) {
      resetTimer();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [filteredNews.length, resetTimer]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    resetTimer();
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    
    if (touchStart) {
      const distance = touchStart - currentTouch;
      if (Math.abs(distance) > minSwipeDistance) {
        setDirection(distance > 0 ? 1 : -1);
      }
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (Math.abs(distance) > minSwipeDistance) {
      if (isLeftSwipe) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredNews.length);
      }
      if (isRightSwipe) {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredNews.length) % filteredNews.length);
      }
    }
    resetTimer();
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredNews.length) % filteredNews.length);
    resetTimer();
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredNews.length);
    resetTimer();
  };

  // Show loading state while parent is loading
  if (parentLoading) {
    return (
      <div className="relative min-h-[425px]">
        <div className="w-full h-[330px] md:h-[500px] bg-gray-100 animate-pulse rounded-lg" />
        <div className="mt-2 space-y-2 p-1.5">
          <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4 mx-auto" />
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 bg-gray-100 animate-pulse rounded w-20" />
            <div className="h-4 bg-gray-100 animate-pulse rounded w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show loading state for the first item while its image is loading
  const firstItem = news[0];
  const firstItemDimensions = firstItem ? imageDimensions[firstItem.id] : null;
  if (!firstItemDimensions || firstItemDimensions.isLoading) {
    return (
      <div className="relative min-h-[425px]">
        <div className="w-full h-[330px] md:h-[500px] bg-gray-100 animate-pulse rounded-lg" />
        <div className="mt-2 space-y-2 p-1.5">
          <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4 mx-auto" />
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 bg-gray-100 animate-pulse rounded w-20" />
            <div className="h-4 bg-gray-100 animate-pulse rounded w-24" />
          </div>
        </div>
      </div>
    );
  }

  // Only show "No news available" if we've finished checking images and found none valid
  if (filteredNews.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No news available for Main Campus</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-0.5">
        <h2 className="text-sm font-semibold text-gray-900">Main Campus News</h2>
        <p className="text-xs text-gray-500">Latest updates from the Main Campus</p>
      </div>
      <div 
        className="relative group"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <button
          onClick={handlePrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hidden md:block opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hidden md:block opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: direction * 50, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                  mass: 0.5,
                  velocity: 2,
                  duration: 0.4
                }
              }}
              exit={{ 
                opacity: 0, 
                x: -direction * 50,
                scale: 0.95,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                  mass: 0.5,
                  velocity: 2,
                  duration: 0.4
                }
              }}
              className="w-full relative will-change-transform"
              style={{
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                perspective: '1000px'
              }}
            >
              <NewsPreviewCard 
                news={filteredNews[currentIndex]} 
              />
            </motion.div>
          </AnimatePresence>

          {/* Dot indicators */}
          {filteredNews.length > 0 && (
            <div className="mt-4 text-center">
              {filteredNews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                    resetTimer();
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 inline-block mx-1 ${
                    index === currentIndex 
                      ? "bg-blue-600 scale-125" 
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 