import { useState } from "react";
import type { NewsItem } from "@/types/news";
import NewsPreviewCard from "./NewsPreviewCard";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CstNewsProps {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
}

export default function CstNews({ news, loading, error }: CstNewsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
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
        setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
      }
      if (isRightSwipe) {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + news.length) % news.length);
      }
    }
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + news.length) % news.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
  };

  if (loading) {
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

  return (
    <div className="w-full">
      <div className="text-left mb-0.5">
        <h2 className="text-sm font-semibold text-gray-900">CST News</h2>
        <p className="text-xs text-gray-500">Latest updates from the College of Science and Technology</p>
      </div>
      <div 
        className="relative min-h-[425px] group"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <button
          onClick={handlePrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm block hover:bg-white"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm block hover:bg-white"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>

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
            {news.length > 0 ? (
              <NewsPreviewCard news={news[currentIndex]} variant="cst" />
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No news available for CST</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 