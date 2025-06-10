import { useEffect, useState, useCallback, useRef } from "react";
import { getNews } from "@/services/newsService";
import type { NewsItem } from "@/types/news";
import NewsPreviewCard from "@/components/news/NewsPreviewCard";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
    }, 3300);
  }, [news.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    resetTimer();
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    
    // Update direction during the swipe
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

    // Only trigger if it's a significant swipe
    if (Math.abs(distance) > minSwipeDistance) {
      if (isLeftSwipe) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
      }
      if (isRightSwipe) {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + news.length) % news.length);
      }
    }
    resetTimer();
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await getNews();
        if (error) throw error;
        setNews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Auto-advance the carousel
  useEffect(() => {
    if (news.length === 0) return;
    resetTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [news.length, resetTimer]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + news.length) % news.length);
    resetTimer();
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
    resetTimer();
  };

  return (
    <div className="h-full flex flex-col">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {getGreeting()}
        </h1>
        <p className="text-gray-600 text-lg">
          Here's what's happening at Guimaras State University
        </p>
      </motion.div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4">
            <Card className="border-0 shadow-none bg-transparent">
              <div className="grid gap-6">
                {loading ? (
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
                ) : error ? (
                  <div className="text-center py-6">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div 
                    className="relative min-h-[425px] group"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                  >
                    {/* Previous Button */}
                    <button
                      onClick={handlePrevious}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hidden md:block opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>

                    {/* Next Button */}
                    <button
                      onClick={handleNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hidden md:block opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-600" />
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
                        <NewsPreviewCard news={news[currentIndex]} />
                      </motion.div>
                    </AnimatePresence>

                    {/* Manual navigation with dots */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-2 md:static md:mt-4">
                      {news.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentIndex(index)}
                          className={`w-2.5 h-2.5 rounded-full transition-colors ${
                            index === currentIndex
                              ? "bg-blue-500"
                              : "bg-gray-300 hover:bg-gray-400"
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 