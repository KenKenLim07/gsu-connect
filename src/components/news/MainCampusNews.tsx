import { useState, useCallback, useRef, useEffect } from "react";
import type { NewsItem } from "@/types/news";
import NewsPreviewCard from "./NewsPreviewCard";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MainCampusNewsProps {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
}

export default function MainCampusNews({ news, loading: parentLoading, error }: MainCampusNewsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Simple filtering - just get the first 5 news items with images
  const filteredNews = news
    .filter(item => item.image_url) // Only items with images
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredNews.length);
      } else {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredNews.length) % filteredNews.length);
      }
    }
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredNews.length) % filteredNews.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredNews.length);
  };

  // Show loading state only when parent is loading and no news available
  if (parentLoading && (!news || news.length === 0)) {
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

  // Show error state
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

  // Show empty state
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