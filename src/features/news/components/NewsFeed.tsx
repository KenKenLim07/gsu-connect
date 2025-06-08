import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import NewsCard from "./NewsCard";
import { getNews } from "../../../services/newsService";
import type { NewsItem } from "../../../types/news";

export default function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string>("All");

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data, error } = await getNews();
        if (error) {
          setError('Failed to load news. Please try again later.');
          return;
        }
        setNews(data);
      } catch (err) {
        setError('An unexpected error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  const filteredNews = selectedSource === "All"
    ? news
    : news.filter((item) => item.campus?.name === selectedSource);

  const sortedNews = [...filteredNews].sort((a, b) => 
    new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
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

  const sourceNames = Array.from(new Set(news.map(item => item.campus?.name).filter((name): name is string => name !== undefined)));

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-14 z-40 bg-white w-full">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">GSU News</h1>
            <div className="flex items-center gap-4">
              <Select
                value={selectedSource}
                onValueChange={(value: string) => setSelectedSource(value)}
              >
                <SelectTrigger className="w-[200px]">
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

      <div className="flex-1 overflow-y-auto pt-2">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="space-y-3">
            {sortedNews.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
