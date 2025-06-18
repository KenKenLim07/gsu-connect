import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import NewsCard from "./NewsCard";
import NewsCardSkeleton from "../../../components/news/NewsCardSkeleton";
import { getNews } from "../../../services/newsService";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

interface NewsFeedProps {
  initialCampus?: string | null;
}

export default function NewsFeed({ initialCampus }: NewsFeedProps) {
  const [selectedSource, setSelectedSource] = useState<string>(initialCampus || "All");

  const { data: news = [], isLoading, error } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await getNews();
      if (error) throw new Error('Failed to load news');
      return data;
    },
  });

  useEffect(() => {
    if (initialCampus) {
      setSelectedSource(initialCampus);
    }
  }, [initialCampus]);

  const filteredNews = selectedSource === "All"
    ? news
    : news.filter((item) => item.campus?.name === selectedSource);

  const sortedNews = [...filteredNews].sort((a, b) => 
    new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  const sourceNames = Array.from(new Set(news.map(item => item.campus?.name).filter((name): name is string => name !== undefined)));

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-950">
      <div className="sticky top-14 z-40 bg-white dark:bg-gray-950 w-full">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">GSU News</h1>
              <div className="flex items-center gap-4">
                <Select
                  value={selectedSource}
                  onValueChange={(value: string) => setSelectedSource(value)}
                >
                  <SelectTrigger className="w-[180px] h-8 text-sm">
                    <SelectValue>
                      {selectedSource === "All" ? "All Sources" : selectedSource}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Sources</SelectItem>
                    {sourceNames.map((sourceName) => (
                      <SelectItem key={sourceName} value={sourceName}>
                        {sourceName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-14">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="space-y-3">
            {isLoading ? (
              // Show 3 skeleton cards while loading
              Array.from({ length: 3 }).map((_, index) => (
                <NewsCardSkeleton key={index} />
              ))
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">Failed to load news. Please try again later.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              sortedNews.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <NewsCard news={item} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
