import { useEffect, useState, useCallback, useRef } from "react";
import { getNews } from "@/services/newsService";
import type { NewsItem } from "@/types/news";
import NewsPreviewCard from "@/components/news/NewsPreviewCard";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const [mainCampusNews, setMainCampusNews] = useState<NewsItem[]>([]);
  const [cstNews, setCstNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMainIndex, setCurrentMainIndex] = useState(0);
  const [currentCstIndex, setCurrentCstIndex] = useState(0);
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
      setCurrentMainIndex((prevIndex) => (prevIndex + 1) % mainCampusNews.length);
      setCurrentCstIndex((prevIndex) => (prevIndex + 1) % cstNews.length);
    }, 3300);
  }, [mainCampusNews.length, cstNews.length]);

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
        setCurrentMainIndex((prevIndex) => (prevIndex + 1) % mainCampusNews.length);
        setCurrentCstIndex((prevIndex) => (prevIndex + 1) % cstNews.length);
      }
      if (isRightSwipe) {
        setCurrentMainIndex((prevIndex) => (prevIndex - 1 + mainCampusNews.length) % mainCampusNews.length);
        setCurrentCstIndex((prevIndex) => (prevIndex - 1 + cstNews.length) % cstNews.length);
      }
    }
    resetTimer();
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        console.log('Starting to fetch news...');
        const { data, error } = await getNews();
        if (error) throw error;
        console.log('Received news data:', data);
        
        // Log unique campus_id values
        const uniqueCampusIds = [...new Set(data.map(item => item.campus_id))];
        console.log('Unique campus_ids:', uniqueCampusIds);
        
        // Get the first news item to check the campus structure
        const firstNews = data[0];
        console.log('First news item campus:', firstNews.campus);
        
        // Filter based on campus name instead of ID
        const mainCampus = data.filter(item => item.campus?.name === "Main Campus");
        const cst = data.filter(item => item.campus?.name === "CST");
        
        console.log('Filtered Main Campus news:', mainCampus);
        console.log('Filtered CST news:', cst);
        
        setMainCampusNews(mainCampus);
        setCstNews(cst);
      } catch (err) {
        console.error('Error in fetchNews:', err);
        setError(err instanceof Error ? err.message : "Failed to fetch news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Auto-advance the carousel
  useEffect(() => {
    if (mainCampusNews.length === 0 && cstNews.length === 0) return;
    resetTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [mainCampusNews.length, cstNews.length, resetTimer]);

  const handlePrevious = (type: 'main' | 'cst') => {
    setDirection(-1);
    if (type === 'main') {
      setCurrentMainIndex((prevIndex) => (prevIndex - 1 + mainCampusNews.length) % mainCampusNews.length);
    } else {
      setCurrentCstIndex((prevIndex) => (prevIndex - 1 + cstNews.length) % cstNews.length);
    }
    resetTimer();
  };

  const handleNext = (type: 'main' | 'cst') => {
    setDirection(1);
    if (type === 'main') {
      setCurrentMainIndex((prevIndex) => (prevIndex + 1) % mainCampusNews.length);
    } else {
      setCurrentCstIndex((prevIndex) => (prevIndex + 1) % cstNews.length);
    }
    resetTimer();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-2">
            <Card className="border-0 shadow-none bg-transparent">
              <div className="grid gap-2">
                <div className="text-left mb-2">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-1">Main Campus News</h2>
                  <p className="text-xs text-gray-500">Latest updates from the Main Campus</p>
                </div>
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
                      onClick={() => handlePrevious('main')}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hidden md:block opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>

                    {/* Next Button */}
                    <button
                      onClick={() => handleNext('main')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hidden md:block opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-600" />
                    </button>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentMainIndex}
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
                        {mainCampusNews.length > 0 ? (
                          <NewsPreviewCard news={mainCampusNews[currentMainIndex]} />
                        ) : (
                          <div className="text-center py-6">
                            <p className="text-gray-500">No news available for Main Campus</p>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </Card>

            <Card className="border-0 shadow-none bg-transparent">
              <div className="grid gap-2">
                <div className="text-left mb-2">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-1">CST News</h2>
                  <p className="text-xs text-gray-500">Latest updates from the College of Science and Technology</p>
            </div>
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
                      onClick={() => handlePrevious('cst')}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hidden md:block opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>

                    {/* Next Button */}
                    <button
                      onClick={() => handleNext('cst')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hidden md:block opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-600" />
                    </button>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentCstIndex}
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
                        {cstNews.length > 0 ? (
                          <NewsPreviewCard news={cstNews[currentCstIndex]} />
                        ) : (
                          <div className="text-center py-6">
                            <p className="text-gray-500">No news available for CST</p>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
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