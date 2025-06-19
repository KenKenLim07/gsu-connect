import { useQuery } from "@tanstack/react-query";
import { getNews } from "@/services/newsService";
import type { NewsItem } from "@/types/news";
import MainCampusNews from "@/components/news/MainCampusNews";
import CstNews from "@/components/news/CstNews";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { ArrowUpIcon } from '@heroicons/react/24/outline';

function AnimatedSectionHeader({ children, revealOnScroll = false }: { children: string, revealOnScroll?: boolean }) {
  const textRef = useRef<HTMLHeadingElement>(null);
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.offsetWidth);
    }
  }, [children]);

  // For reveal on scroll
  const inViewRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(inViewRef, { once: true, margin: '0px 0px -20% 0px' });

  const fadeProps = revealOnScroll
    ? {
        initial: { opacity: 0 },
        animate: isInView ? { opacity: 1 } : { opacity: 0 },
        transition: { duration: 1 },
      }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 1, delay: 0.1 },
      };

  const lineProps = revealOnScroll
    ? {
        initial: { opacity: 0, width: 24 },
        animate: isInView ? { opacity: 1, width: textWidth || 64 } : { opacity: 0, width: 24 },
        transition: { duration: 1, delay: 0.15 },
      }
    : {
        initial: { opacity: 0, width: 24 },
        animate: { opacity: 1, width: textWidth || 64 },
        transition: { duration: 1, delay: 0.25 },
      };

  return (
    <div className="relative inline-block" ref={revealOnScroll ? inViewRef : undefined}>
      <motion.h2
        ref={textRef}
        className="text-lg font-bold text-gray-900 dark:text-gray-100 inline-block pb-1"
        {...fadeProps}
      >
        {children}
      </motion.h2>
      <motion.span
        className="block absolute left-0 -bottom-0.5 h-0.5 bg-black dark:bg-gray-200 rounded-full"
        {...lineProps}
        aria-hidden="true"
        style={{ maxWidth: '100%' }}
      />
    </div>
  );
}

export default function Home() {
  const { data: news = [], isLoading, error } = useQuery<NewsItem[]>({
    queryKey: ['news'],
    queryFn: async () => {
        const { data, error } = await getNews();
      if (error) throw new Error('Failed to load news');
      return data;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const mainCampusNews = news.filter(item => item.campus?.name === "Main Campus");
  const cstNews = news.filter(item => item.campus?.name === "CST");
  const errorMessage = error instanceof Error ? error.message : null;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <section className="relative pt-10 pb-3 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <motion.h1
              className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            >
              What's News
            </motion.h1>
            <motion.p
              className="text-xs text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-2"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
            >
              Stay connected. Stay informed
            </motion.p>
          </div>
        </div>
      </section>

      {/* View All News Card */}
      <div className="flex justify-center mb-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1, ease: 'easeOut' }}
        >
          <Link
            to="/news"
            className="group inline-flex items-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm hover:shadow transition-all duration-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="View all news"
            style={{ minWidth: 0 }}
          >
            <span className="text-xs font-normal text-gray-900 dark:text-gray-100 whitespace-nowrap">View all news</span>
            <motion.span
              className="inline-flex ml-1"
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            >
              <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform duration-200" />
            </motion.span>
          </Link>
        </motion.div>
      </div>

      {/* Content Section */}
      <section className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Main Campus Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <AnimatedSectionHeader>Salvador</AnimatedSectionHeader>
              <Link
                to="/news?campus=Main%20Campus"
                className="inline-flex items-center gap-1 text-xs text-primary underline underline-offset-4 decoration-1 hover:decoration-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Show all
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <MainCampusNews news={mainCampusNews} loading={isLoading} error={errorMessage} />
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

          {/* CST Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <AnimatedSectionHeader revealOnScroll>Mosqueda</AnimatedSectionHeader>
              <Link
                to="/news?campus=CST"
                className="inline-flex items-center gap-1 text-xs text-primary underline underline-offset-4 decoration-1 hover:decoration-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Show all
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <CstNews news={cstNews} loading={isLoading} error={errorMessage} />
          </div>
        </div>
      </section>

      {/* Floating Scroll to Top Button (fixed to viewport) */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 shadow-lg hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Scroll to top"
        >
          <ArrowUpIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
} 
