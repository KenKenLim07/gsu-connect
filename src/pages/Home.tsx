import { useQuery } from "@tanstack/react-query";
import { getNews } from "@/services/newsService";
import type { NewsItem } from "@/types/news";
import MainCampusNews from "@/components/news/MainCampusNews";
import CstNews from "@/components/news/CstNews";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { ArrowUpIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const { data: news = [], isLoading, error } = useQuery<NewsItem[]>({
    queryKey: ['news'],
    queryFn: async () => {
        const { data, error } = await getNews();
      if (error) throw new Error('Failed to load news');
      return data;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const mainCampusNews = news.filter(item => item.campus?.name === "Main Campus");
  const cstNews = news.filter(item => item.campus?.name === "CST");
  const errorMessage = error instanceof Error ? error.message : null;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <section className="relative py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
              >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
              What's News
            </h1>
              <motion.p
              className="text-xs text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Stay connected. Stay informed
              </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Main Campus Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b-2 border-black dark:border-gray-200 inline-block pb-1">
                Salvador
              </h2>
              <Link to="/news?campus=Main%20Campus">
                <Card className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border-gray-300 dark:border-gray-700">
                  <CardContent className="px-2 py-1">
                    <div className="flex items-center gap-1 text-xs text-black dark:text-gray-100 hover:text-gray-900 dark:hover:text-white">
                      Show all
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
            <MainCampusNews news={mainCampusNews} loading={isLoading} error={errorMessage} />
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

          {/* CST Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b-2 border-black dark:border-gray-200 inline-block pb-1">
                Mosqueda
              </h2>
              <Link to="/news?campus=CST">
                <Card className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border-gray-300 dark:border-gray-700">
                  <CardContent className="px-2 py-1">
                    <div className="flex items-center gap-1 text-xs text-black dark:text-gray-100 hover:text-gray-900 dark:hover:text-white">
                      Show all
                      <ArrowRight className="w-3 h-3" />
        </div>
                  </CardContent>
                </Card>
              </Link>
      </div>
            <CstNews news={cstNews} loading={isLoading} error={errorMessage} />
          </div>
        </div>
      </section>

      {/* Floating Scroll to Top Button (fixed to viewport) */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 shadow-lg hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Scroll to top"
        >
          <ArrowUpIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
} 
