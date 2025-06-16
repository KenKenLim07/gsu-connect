import { useEffect, useState } from "react";
import { getNews } from "@/services/newsService";
import type { NewsItem } from "@/types/news";
import MainCampusNews from "@/components/news/MainCampusNews";
import CstNews from "@/components/news/CstNews";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const [mainCampusNews, setMainCampusNews] = useState<NewsItem[]>([]);
  const [cstNews, setCstNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await getNews();
        if (error) throw error;

        const mainCampus = data.filter(item => item.campus?.name === "Main Campus");
        const cst = data.filter(item => item.campus?.name === "CST");

        setMainCampusNews(mainCampus);
        setCstNews(cst);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-white py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            className="text-4xl font-extrabold tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            What's News
          </motion.h1>
          <motion.p
            className="text-gray-600 text-base mb-6 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Get the latest updates, events, and announcements from all campuses — curated just for you.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/news"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            >
              View All News
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="ml-2"
              >
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="flex-1 overflow-y-auto px-4 py-8 bg-white">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Main Campus Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-700">📍 Main Campus News</h2>
              <Link 
                to="/news?campus=main" 
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1"
              >
                Show all
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <MainCampusNews news={mainCampusNews} loading={loading} error={error} />
          </div>

          <div className="h-0.5 bg-gray-200 rounded-full" />

          {/* CST Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">🏛️ College of Science and Technology (CST)</h2>
            <CstNews news={cstNews} loading={loading} error={error} />
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="text-center py-8 bg-gray-50 mt-auto">
        <p className="text-sm text-gray-500">
          Want more updates? <Link to="/news" className="text-blue-600 hover:underline">Browse all news</Link>
        </p>
      </footer>
    </div>
  );
}
