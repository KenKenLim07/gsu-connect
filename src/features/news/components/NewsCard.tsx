import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import { HandThumbUpIcon as HandThumbUpSolidIcon } from "@heroicons/react/24/solid";
import type { NewsItem } from "../../../types/news";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export default function NewsCard({ news }: { news: NewsItem }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch initial like count
    fetchLikeCount();
    // Check if current user has liked
    checkUserLike();
  }, [news.id]);

  const fetchLikeCount = async () => {
    const { count } = await supabase
      .from('news_likes')
      .select('*', { count: 'exact' })
      .eq('news_id', news.id);
    setLikeCount(count || 0);
  };

  const checkUserLike = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('news_likes')
      .select('*')
      .eq('news_id', news.id)
      .eq('user_id', user.id)
      .single();
    
    setIsLiked(!!data);
  };

  const handleLike = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to like news items",
        action: (
          <button
            onClick={() => navigate('/login')}
            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        ),
      });
      return;
    }

    if (isLiked) {
      // Unlike
      await supabase
        .from('news_likes')
        .delete()
        .eq('news_id', news.id)
        .eq('user_id', user.id);
      setLikeCount(prev => prev - 1);
    } else {
      // Like
      await supabase
        .from('news_likes')
        .insert([
          { news_id: news.id, user_id: user.id }
        ]);
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const campus = news.campus?.name ?? "Unknown";
  const published = formatDistanceToNow(new Date(news.published_at), {
    addSuffix: true,
  });

  return (
    <Card className="border border-neutral-400 rounded-xl p-3 bg-white text-neutral-900 shadow-sm">
      <CardContent className="p-0 space-y-1.5">
        <div className="flex items-center justify-between">
          <Badge className="px-2 py-1 rounded-md border border-neutral-400 text-xs">
            {campus}
          </Badge>
          <span className="text-sm text-neutral-600">{published}</span>
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 break-words">{news.title}</h3>
        <p className="text-sm leading-relaxed text-neutral-600 break-words">{news.content}</p>
        <div className="flex items-center justify-between pt-2">
          {news.source_url && (
            <a
              href={news.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-neutral-400 bg-neutral-100 text-neutral-700 hover:text-neutral-900 text-xs break-all max-w-full"
            >
              <span>View Source</span>
              <span className="ml-0.5">→</span>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 