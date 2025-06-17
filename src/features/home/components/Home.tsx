import { useQuery } from "@tanstack/react-query";
import { getNews } from "@/services/newsService";
import type { NewsItem } from "@/types/news";
import MainCampusNews from "@/components/news/MainCampusNews";
import CstNews from "@/components/news/CstNews";

export default function Home() {
  const { data: news = [], isLoading, error } = useQuery<NewsItem[]>({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await getNews();
      if (error) throw new Error('Failed to load news');
      return data;
    },
  });

  const mainCampusNews = news.filter((item: NewsItem) => item.campus?.name === "Main Campus");
  const cstNews = news.filter((item: NewsItem) => item.campus?.name === "CST");
  const errorMessage = error instanceof Error ? error.message : null;

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
              error={errorMessage}
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
              error={errorMessage}
            />
          </section>
        </div>
      </div>
    </div>
  );
} 