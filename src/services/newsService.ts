import { supabase } from '../lib/supabase';
import type { NewsItem, NewsResponse } from '../types/news';

interface SupabaseNewsItem {
  id: string;
  title: string;
  content: string;
  published_at: string;
  source_url: string;
  campus_id: string;
  created_at: string;
  image_url: string | null;
  campus: {
    id: string;
    name: string;
    location?: string;
    created_at: string;
  } | null;
}

function mapSupabaseToNewsItem(item: unknown): NewsItem {
  const newsItem = item as SupabaseNewsItem;
  return {
    id: newsItem.id,
    title: newsItem.title,
    content: newsItem.content,
    published_at: newsItem.published_at,
    source_url: newsItem.source_url,
    campus_id: newsItem.campus_id,
    created_at: newsItem.created_at,
    image_url: newsItem.image_url || undefined,
    campus: newsItem.campus ? {
      id: newsItem.campus.id,
      name: newsItem.campus.name,
      location: newsItem.campus.location,
      created_at: newsItem.campus.created_at
    } : undefined
  };
}

export async function getNews(): Promise<NewsResponse> {
  try {
    console.log('Fetching news from Supabase...');
    const { data, error, count } = await supabase
      .from('news')
      .select(`
        *,
        campus:campus_id (
          id,
          name,
          location,
          created_at
        )
      `)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching news:', error);
      return { data: [], error, count: 0 };
    }

    console.log('Raw news data:', data);
    const newsItems: NewsItem[] = (data as unknown[]).map(mapSupabaseToNewsItem);
    console.log('Mapped news items:', newsItems);

    return { data: newsItems, error: null, count: count || 0 };
  } catch (error) {
    console.error('Unexpected error fetching news:', error);
    return { data: [], error: error as Error, count: 0 };
  }
}

export async function getNewsByCampus(campusId: string): Promise<NewsResponse> {
  try {
    const { data, error, count } = await supabase
      .from('news')
      .select(`
        *,
        campus:campus_id (
          id,
          name,
          location,
          created_at
        )
      `)
      .eq('campus_id', campusId)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching news by campus:', error);
      return { data: [], error, count: 0 };
    }

    const newsItems: NewsItem[] = (data as unknown[]).map(mapSupabaseToNewsItem);

    return { data: newsItems, error: null, count: count || 0 };
  } catch (error) {
    console.error('Unexpected error fetching news by campus:', error);
    return { data: [], error: error as Error, count: 0 };
  }
} 