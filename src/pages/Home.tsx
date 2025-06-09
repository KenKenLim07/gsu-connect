import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNews } from "@/services/newsService";
import type { NewsItem } from "@/types/news";
import NewsPreviewCard from "@/components/news/NewsPreviewCard";
import NewsCardSkeleton from "@/components/news/NewsCardSkeleton";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await getNews();
        if (error) throw error;
        // Get only the 3 most recent news items
        setNews(data.slice(0, 3));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

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
          <Card className="border border-neutral-400 rounded-xl p-2 bg-white text-neutral-900 shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-neutral-200">
                <span className="text-sm font-bold text-neutral-600">News Preview</span>
                <button
                  onClick={() => navigate("/news")}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-neutral-400 bg-neutral-100 text-neutral-700 hover:text-neutral-900 text-xs"
                >
                  <span>View All News</span>
                  <span className="ml-0.5">→</span>
                </button>
              </div>
              {loading ? (
                // Show 3 skeleton cards while loading
                Array.from({ length: 3 }).map((_, index) => (
                  <NewsCardSkeleton key={index} />
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
                <div className="space-y-1.5">
                  {news.map((item) => (
                    <NewsPreviewCard key={item.id} news={item} />
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 