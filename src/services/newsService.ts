import { supabase } from '@/lib/supabase';
import type { NewsItem, NewsResponse } from '@/types/news';
import type { PostgrestError } from '@supabase/supabase-js';

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

// Keep track of in-flight requests
let currentFetch: Promise<NewsResponse> | null = null;

export async function getNews(): Promise<NewsResponse> {
  try {
    // If there's already a request in flight, return its result
    if (currentFetch) {
      return currentFetch;
    }

    console.log('Fetching news from Supabase...');
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

    // Create new request
    currentFetch = (async () => {
      try {
        // Test connection first
        const { data: testData, error: testError } = await supabase
          .from('news')
          .select('id')
          .limit(1);

        if (testError) {
          console.error('Supabase connection test failed:', testError);
          return { data: [], error: testError, count: 0 };
        }

        console.log('Supabase connection successful, fetching full news data...');

        // Fetch full news data
        const { data, error, count } = await supabase
          .from('news')
          .select(`
            *,
            campus:campus_id (
              id,
              name
            )
          `, { count: 'exact' })
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching news:', error);
          return { data: [], error, count: 0 };
        }

        return { data: data as NewsItem[], error: null, count: count || 0 };
      } finally {
        // Clear the current fetch after completion
        currentFetch = null;
      }
    })();

    return currentFetch;
  } catch (error) {
    console.error('Unexpected error in getNews:', error);
    return { data: [], error: error as PostgrestError, count: 0 };
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
          name
        )
      `, { count: 'exact' })
      .eq('campus_id', campusId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching news by campus:', error);
      return { data: [], error, count: 0 };
    }

    return { data: data as NewsItem[], error: null, count: count || 0 };
  } catch (error) {
    console.error('Unexpected error in getNewsByCampus:', error);
    return { data: [], error: error as PostgrestError, count: 0 };
  }
} 