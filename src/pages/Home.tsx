import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNews } from "@/services/newsService";
import type { NewsItem } from "@/types/news";
import NewsPreviewCard from "@/components/news/NewsPreviewCard";
import NewsCardSkeleton from "@/components/news/NewsCardSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

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

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [news.length]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-14 z-40 bg-white w-full">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold text-gray-900"
              >
                {getGreeting()}, student!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-sm text-gray-600"
              >
                Here's what's happening at Guimaras State University.
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-2">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">News Preview</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/news">View All News</Link>
              </Button>
            </div>
            <Card className="border-0 shadow-none">
              <div className="grid gap-6">
                {loading ? (
                  // Show 3 skeleton cards while loading
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-48 bg-gray-200 animate-pulse rounded-lg"
                    />
                  ))
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
                  <div className="relative min-h-[425px] overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5 }}
                        className="absolute w-full"
                      >
                        <NewsPreviewCard news={news[currentIndex]} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </Card>
            {/* Manual navigation with dots */}
            <div className="flex justify-center gap-2 mt-4">
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
        </div>
      </div>
    </div>
  );
} 