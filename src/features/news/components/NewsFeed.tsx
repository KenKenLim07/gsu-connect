import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import NewsCard from "./NewsCard";
import NewsCardSkeleton from "../../../components/news/NewsCardSkeleton";
import { getNews } from "../../../services/newsService";
import type { NewsItem } from "../../../types/news";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../components/ui/card";

interface NewsFeedProps {
  initialCampus?: string | null;
}

export default function NewsFeed({ initialCampus }: NewsFeedProps) {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string>(initialCampus || "All");

  useEffect(() => {
    if (initialCampus) {
      setSelectedSource(initialCampus);
    }
  }, [initialCampus]);

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

  const sourceNames = Array.from(new Set(news.map(item => item.campus?.name).filter((name): name is string => name !== undefined)));

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-14 z-40 bg-white w-full">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate(-1)}
              className="hover:opacity-80 transition-opacity w-fit"
              aria-label="Go back"
            >
              <Card className="border-gray-300">
                <CardContent className="p-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </div>
                </CardContent>
              </Card>
            </button>
          <div className="flex items-center justify-between">
              <h1 className="text-lg font-medium text-gray-900">GSU News</h1>
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

      <div className="flex-1 overflow-y-auto pt-2">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="space-y-3">
            {loading ? (
              // Show 3 skeleton cards while loading
              Array.from({ length: 3 }).map((_, index) => (
                <NewsCardSkeleton key={index} />
              ))
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              sortedNews.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
