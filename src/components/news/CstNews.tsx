import { useState } from "react";
import type { NewsItem } from "../../types/news";
import CstNewsCard from "./CstNewsCard";
import { useQuery } from "@tanstack/react-query";

interface CstNewsProps {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
}

// Function to preload images
const preloadImages = async (news: NewsItem[]): Promise<Set<string>> => {
  const preloadedUrls = new Set<string>();
  
  await Promise.all(
    news
      .filter((item: NewsItem) => item.image_url)
      .map(async (item: NewsItem) => {
        const url = item.image_url as string;
        try {
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = url;
          });
          preloadedUrls.add(url);
        } catch (error) {
          console.warn(`Failed to preload image: ${url}`, error);
        }
      })
  );
  
  return preloadedUrls;
};

export default function CstNews({ news, loading, error }: CstNewsProps) {
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(new Set());
  const [nextToLoad, setNextToLoad] = useState(0);

  // Use React Query to cache preloaded images
  const { data: preloadedImages = new Set<string>() } = useQuery<Set<string>>({
    queryKey: ['cstPreloadedImages', news.map(item => item.id).join(',')],
    queryFn: () => preloadImages(news),
    enabled: news.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  const handleImageLoaded = (index: number) => {
    setLoadedIndices(prev => new Set([...prev, index]));
    setNextToLoad(prev => prev + 1);
  };

  const checkImageLoaded = (news: NewsItem) => {
    return news.image_url ? preloadedImages.has(news.image_url) : false;
  };

  const canLoadImage = (index: number) => {
    return Math.abs(index - nextToLoad) <= 3 || loadedIndices.has(index - 1) || index < 4;
  };

  // Only show loading state on initial load
  if (loading && (!news || news.length === 0)) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="aspect-[4/3]">
            <div className="w-full h-full bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Image skeleton */}
              <div className="w-full h-[60%] bg-gray-100 animate-pulse" />
              
              {/* Content skeleton */}
              <div className="p-4 space-y-3">
                {/* Title skeleton */}
                <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4" />
                
                {/* Date skeleton */}
                <div className="flex items-center space-x-2">
                  <div className="h-3 bg-gray-100 animate-pulse rounded w-24" />
                  <div className="h-3 bg-gray-100 animate-pulse rounded w-16" />
                </div>
                
                {/* Description skeleton */}
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 animate-pulse rounded w-full" />
                  <div className="h-3 bg-gray-100 animate-pulse rounded w-5/6" />
                  <div className="h-3 bg-gray-100 animate-pulse rounded w-4/6" />
                </div>
              </div>
            </div>
          </div>
        ))}
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
  );
} 