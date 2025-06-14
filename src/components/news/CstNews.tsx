import { useState, useEffect } from "react";
import type { NewsItem } from "../../types/news";
import CstNewsCard from "./CstNewsCard";

interface CstNewsProps {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
}

export default function CstNews({ news, loading, error }: CstNewsProps) {
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(new Set());
  const [nextToLoad, setNextToLoad] = useState(0);
  const [forceLoadAll, setForceLoadAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Preload images with mobile-specific handling
  useEffect(() => {
    if (news) {
      const imageUrls = news
        .filter((item: NewsItem) => item.image_url)
        .map((item: NewsItem) => item.image_url as string);
      
      imageUrls.forEach((url: string) => {
        const img = new Image();
        // Add cache-busting for mobile
        img.src = isMobile ? `${url}?t=${Date.now()}` : url;
        img.onload = () => {
          setPreloadedImages(prev => new Set([...prev, url]));
        };
      });
    }
  }, [news, isMobile]);

  // Force load all images after a shorter delay on mobile
  useEffect(() => {
    const timer = setTimeout(() => {
      setForceLoadAll(true);
    }, isMobile ? 2000 : 5000);
    return () => clearTimeout(timer);
  }, [isMobile]);

  const handleImageLoaded = (index: number) => {
    setLoadedIndices(prev => new Set([...prev, index]));
    setNextToLoad(prev => prev + 1);
  };

  const checkImageLoaded = (news: NewsItem) => {
    return news.image_url ? preloadedImages.has(news.image_url) : false;
  };

  const canLoadImage = (index: number) => {
    if (forceLoadAll) return true;
    
    // More aggressive loading on mobile
    if (isMobile) {
      return (
        Math.abs(index - nextToLoad) <= 4 ||
        loadedIndices.has(index - 1) ||
        index < 6
      );
    }
    
    // Desktop loading strategy
    return (
      Math.abs(index - nextToLoad) <= 3 ||
      loadedIndices.has(index - 1) ||
      index < 4
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No news available for CST</p>
      </div>
    );
  }

  // Sort news by published_at date and take only the 10 most recent
  const recentNews = [...news]
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, 10);

  return (
    <div className="px-4 py-8">
      <div className="text-center mb-6">
        <h2 className="text-1xl font-semibold text-gray-900">CST News</h2>
        <p className="text-xs text-gray-500">Latest updates from the College of Science and Technology</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentNews.map((item: NewsItem, index: number) => (
          <div key={item.id} className="aspect-[4/3]">
            <CstNewsCard 
              news={item}
              isImageLoaded={checkImageLoaded(item)}
              index={index}
              onImageLoaded={handleImageLoaded}
              canLoad={canLoadImage(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 