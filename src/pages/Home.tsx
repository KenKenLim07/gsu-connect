import { useQuery } from "@tanstack/react-query";
import { getNews } from "@/services/newsService";
import MainCampusNews from "@/components/news/MainCampusNews";
import CstNews from "@/components/news/CstNews";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { data: news = [], isLoading, error } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await getNews();
      if (error) throw new Error('Failed to load news');
      return data;
    },
  });

  const mainCampusNews = news.filter(item => item.campus?.name === "Main Campus");
  const cstNews = news.filter(item => item.campus?.name === "CST");
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
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Main Campus Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-gray-700">Main Campus News</h2>
              <Link to="/news?campus=Main%20Campus">
                <Card className="hover:bg-gray-50 transition-colors border-gray-300">
                  <CardContent className="px-2 py-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900">
                      Show all
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
            <MainCampusNews news={mainCampusNews} loading={isLoading} error={errorMessage} />
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* CST Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-gray-700">College of Science and Technology</h2>
              <Link to="/news?campus=CST">
                <Card className="hover:bg-gray-50 transition-colors border-gray-300">
                  <CardContent className="px-2 py-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900">
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
    </div>
  );
} 
