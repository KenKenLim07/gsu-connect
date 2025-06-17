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

  const filteredNews = useMemo(() => {
    return news
      .filter(item => {
        const dimensions = imageDimensions[item.id];
        return item.image_url && dimensions?.isValid && !dimensions.isLoading;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5); // Limit to 5 items
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
    const currentY = e.targetTouches[0].clientY;
    
    if (touchStart && Math.abs(currentTouch - touchStart) > Math.abs(currentY - (touchStart ? e.targetTouches[0].clientY : 0))) {
      e.preventDefault();
    }
    
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

  if (parentLoading) {
    return (
      <div className="relative min-h-[425px]">
        <div className="relative flex items-center justify-center gap-0 px-4 md:px-12 overflow-visible">
          {/* Previous Skeleton */}
          <div className="w-1/4 md:w-1/5 -mr-4 md:-mr-6">
            <div className="w-full h-[180px] sm:h-[220px] md:h-[280px] lg:h-[320px] bg-gray-100 animate-pulse rounded-lg" />
          </div>

          {/* Current Skeleton */}
          <div className="w-2/3 md:w-3/4">
            <div className="w-full h-[180px] sm:h-[220px] md:h-[280px] lg:h-[320px] bg-gray-100 animate-pulse rounded-lg" />
            <div className="mt-2 space-y-1.5 p-1.5">
              <div className="h-3 bg-gray-100 animate-pulse rounded w-3/4 mx-auto" />
              <div className="flex items-center justify-center gap-1.5">
                <div className="h-2.5 bg-gray-100 animate-pulse rounded w-16" />
                <div className="h-2.5 bg-gray-100 animate-pulse rounded w-2" />
                <div className="h-2.5 bg-gray-100 animate-pulse rounded w-20" />
              </div>
            </div>
          </div>

          {/* Next Skeleton */}
          <div className="w-1/4 md:w-1/5 -ml-4 md:-ml-6">
            <div className="w-full h-[180px] sm:h-[220px] md:h-[280px] lg:h-[320px] bg-gray-100 animate-pulse rounded-lg" />
          </div>
        </div>

        {/* Skeleton Dots */}
        <div className="mt-4 text-center">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div
              key={index}
              className="w-1.5 h-1.5 rounded-full bg-gray-200 inline-block mx-1"
            />
          ))}
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

  if (filteredNews.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No news available for Main Campus</p>
      </div>
    );
  }

  const getAdjacentIndex = (offset: number) => {
    return (currentIndex + offset + filteredNews.length) % filteredNews.length;
  };

  return (
    <div className="w-full">
      <div 
        className="relative group"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: 'pan-y pinch-zoom' }}
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

        <div className="relative flex items-center justify-center gap-0 px-4 md:px-12 overflow-visible">
          <AnimatePresence mode="popLayout" initial={false}>
            {/* Previous Image */}
            <motion.div
              key={`prev-${currentIndex}`}
              initial={{ 
                x: 100,
                opacity: 0,
                scale: 0.8,
                zIndex: 1
              }}
              animate={{ 
                x: 0,
                opacity: 0.7,
                scale: 1.5,
                zIndex: 1,
                y: 40,
                transition: {
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                  mass: 0.8,
                  velocity: 0.5
                }
              }}
              exit={{ 
                x: -100,
                opacity: 0,
                scale: 0.8,
                transition: {
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                  mass: 0.8,
                  velocity: 0.5
                }
              }}
              className="w-1/4 md:w-1/5 -mr-4 md:-mr-6"
            >
              <NewsPreviewCard 
                news={filteredNews[getAdjacentIndex(-1)]} 
                variant="main"
                showTitle={false}
              />
            </motion.div>

            {/* Current Image */}
            <motion.div
              key={`current-${currentIndex}`}
              initial={{ 
                x: direction * 100,
                opacity: 0,
                scale: 0.9,
                zIndex: 2
              }}
              animate={{ 
                x: 0,
                opacity: 1,
                scale: 1.4,
                zIndex: 2,
                transition: {
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                  mass: 0.8,
                  velocity: 0.5
                }
              }}
              exit={{ 
                x: -direction * 100,
                opacity: 0,
                scale: 0.9,
                transition: {
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                  mass: 0.8,
                  velocity: 0.5
                }
              }}
              className="w-2/3 md:w-3/4"
            >
              <NewsPreviewCard 
                news={filteredNews[currentIndex]} 
                variant="main"
                showTitle={true}
              />
            </motion.div>

            {/* Next Image */}
            <motion.div
              key={`next-${currentIndex}`}
              initial={{ 
                x: -100,
                opacity: 0,
                scale: 0.8,
                zIndex: 1
              }}
              animate={{ 
                x: 0,
                opacity: 0.7,
                scale: 1.5,
                zIndex: 1,
                y: 40,
                transition: {
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                  mass: 0.8,
                  velocity: 0.5
                }
              }}
              exit={{ 
                x: 100,
                opacity: 0,
                scale: 0.8,
                transition: {
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                  mass: 0.8,
                  velocity: 0.5
                }
              }}
              className="w-1/4 md:w-1/5 -ml-4 md:-ml-6"
            >
              <NewsPreviewCard 
                news={filteredNews[getAdjacentIndex(1)]} 
                variant="main"
                showTitle={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot indicators */}
        {filteredNews.length > 0 && (
          <div className="mt-4 text-center">
            {filteredNews.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => {
                  setDirection(i > currentIndex ? 1 : -1);
                  setCurrentIndex(i);
                  resetTimer();
                }}
                className="relative inline-block mx-1"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  className={`w-1.5 h-1.5 rounded-full ${
                    i === currentIndex ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  animate={{
                    scale: i === currentIndex ? [1, 1.8, 1.4] : 1,
                    opacity: i === currentIndex ? 1 : 0.5,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                    times: [0, 0.5, 1],
                  }}
                />
                {i === currentIndex && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-blue-600/20"
                    layoutId="activeDot"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 