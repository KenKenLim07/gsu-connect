import { useQuery } from "@tanstack/react-query";
import { fetchNews } from "@/services/supabaseService";
import MainCampusNews from "@/components/news/MainCampusNews";
import CstNews from "@/components/news/CstNews";
import { useMemo } from "react";

export default function Home() {
  const { data: news, isLoading, error } = useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  const { mainCampusNews, cstNews } = useMemo(() => {
    if (!news) return { mainCampusNews: [], cstNews: [] };
    
    return {
      mainCampusNews: news.filter(item => item.campus_id === "Main Campus"),
      cstNews: news.filter(item => item.campus_id === "CST")
    };
  }, [news]);

  // Only show loading state on initial load
  const showLoading = isLoading && !news;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Main Campus News Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Main Campus News
            </h2>
            <MainCampusNews
              news={mainCampusNews}
              loading={showLoading}
              error={error?.message || null}
            />
          </section>

          {/* CST News Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              CST News
            </h2>
            <CstNews
              news={cstNews}
              loading={showLoading}
              error={error?.message || null}
            />
          </section>
        </div>
      </div>
    </div>
  );
} 