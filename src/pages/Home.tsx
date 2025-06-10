import { useEffect, useState } from "react";
import { getNews } from "@/services/newsService";
import type { NewsItem } from "@/types/news";
import NewsPreviewCard from "@/components/news/NewsPreviewCard";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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
                  <div className="relative min-h-[425px] perspective-1000">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentIndex}
                        initial={{ rotateY: 90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: -90, opacity: 0 }}
                        transition={{ 
                          duration: 0.4,
                          ease: [0.4, 0, 0.2, 1],
                          opacity: { duration: 0.2 }
                        }}
                        className="w-full preserve-3d"
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