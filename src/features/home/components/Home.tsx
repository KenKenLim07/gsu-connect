import { useQuery } from "@tanstack/react-query";
import { getNews } from "@/services/newsService";
import type { NewsItem } from "@/types/news";
import MainCampusNews from "@/components/news/MainCampusNews";

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

  const mainCampusNews = news.filter((item: NewsItem) => item.campus?.name === "Main Campus");
  const errorMessage = error instanceof Error ? error.message : null;

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)] bg-white">
      {/* Hero Section */}
      <section className="relative py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-2">
            What's News
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl leading-relaxed">
            Stay informed with the latest updates, events, and announcements from across our campuses
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="flex-1 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          {/* Main Campus Section */}
          <div className="space-y-4">
            <h2 className="text-base font-medium text-gray-700">Main Campus News</h2>
            <MainCampusNews news={mainCampusNews} loading={isLoading} error={errorMessage} />
          </div>
        </div>
      </section>
    </div>
  );
} 