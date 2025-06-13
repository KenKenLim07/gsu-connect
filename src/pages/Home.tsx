import { useEffect, useState } from "react";
import { getNews } from "@/services/newsService";
import type { NewsItem } from "@/types/news";
import MainCampusNews from "@/components/news/MainCampusNews";
import CstNews from "@/components/news/CstNews";

export default function Home() {
  const [mainCampusNews, setMainCampusNews] = useState<NewsItem[]>([]);
  const [cstNews, setCstNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">What's News</h1>
      </div>

          <div className="space-y-4">
            <MainCampusNews 
              news={mainCampusNews}
              loading={loading}
              error={error}
            />

            <div className="h-0.5 bg-gray-400" />

            <CstNews 
              news={cstNews}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 