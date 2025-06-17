import { useQuery } from "@tanstack/react-query";
import { getNews } from "@/services/newsService";
import type { NewsItem } from "@/types/news";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { data: news = [], isLoading, error } = useQuery<NewsItem[]>({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await getNews();
      if (error) throw new Error('Failed to load news');
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const errorMessage = error instanceof Error ? error.message : null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              What's News
            </h1>
            <motion.p
              className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Stay informed with the latest updates, events, and announcements from across our campuses
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-8">
            <p className="text-gray-500">Loading news content...</p>
          </div>
        </div>
      </section>
    </div>
  );
} 
