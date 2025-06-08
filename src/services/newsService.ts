import { supabase } from '../lib/supabase';
import type { NewsItem, NewsResponse } from '../types/news';

export async function getNews(): Promise<NewsResponse> {
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
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching news:', error);
      return { data: [], error, count: 0 };
    }

    return { data: data as NewsItem[], error: null, count: count || 0 };
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

    return { data: data as NewsItem[], error: null, count: count || 0 };
  } catch (error) {
    console.error('Unexpected error fetching news by campus:', error);
    return { data: [], error: error as Error, count: 0 };
  }
} 