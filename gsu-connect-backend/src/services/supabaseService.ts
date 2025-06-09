import { createClient } from '@supabase/supabase-js';
import type { NewsItem } from '../scrapers/gsuCstScraper';

let supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

    console.log('Environment variables:', {
      hasUrl: !!supabaseUrl,
      hasServiceRole: !!supabaseServiceRole,
      urlLength: supabaseUrl?.length,
      roleLength: supabaseServiceRole?.length
    });

    if (!supabaseUrl || !supabaseServiceRole) {
      throw new Error('Missing Supabase credentials in .env file');
    }

    supabaseClient = createClient(supabaseUrl, supabaseServiceRole);
  }
  return supabaseClient;
}

async function getCampusId(supabase: ReturnType<typeof createClient>, campusName: string): Promise<string> {
  // First try to find the campus
  const { data: existingCampus, error: findError } = await supabase
    .from('campuses')
    .select('id')
    .eq('name', campusName)
    .maybeSingle();

  if (findError) {
    console.error('Error finding campus:', findError);
    throw findError;
  }

  if (existingCampus) {
    console.log(`Found existing campus: ${campusName}`);
    return existingCampus.id as string;
  }

  // If campus doesn't exist, create it
  console.log(`Creating new campus: ${campusName}`);
  const { data: newCampus, error: insertError } = await supabase
    .from('campuses')
    .insert({ name: campusName })
    .select('id')
    .single();

  if (insertError) {
    console.error('Error creating campus:', insertError);
    throw insertError;
  }

  return newCampus.id as string;
}

function parseDate(dateStr: string): string {
  // Convert "Month DD, YYYY" to ISO string
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }
  return date.toISOString();
}

export async function saveNews(news: NewsItem[]) {
  if (!news.length) return { error: null, count: 0 };
  
  try {
    const supabase = getSupabaseClient();
    
    // Process each news item
    const processedNews = await Promise.all(news.map(async (item) => {
      const campusId = await getCampusId(supabase, item.campus_id);
      return {
        title: item.title,
        content: item.content,
        published_at: parseDate(item.published_at),
        source_url: item.source_url,
        campus_id: campusId
      };
    }));

    // Check for existing news items
    const existingNews = await Promise.all(
      processedNews.map(async (item) => {
        const { data } = await supabase
          .from('news')
          .select('id')
          .eq('title', item.title)
          .eq('campus_id', item.campus_id)
          .maybeSingle();
        return { item, exists: !!data };
      })
    );

    // Filter out existing news items
    const newNews = existingNews
      .filter(({ exists }) => !exists)
      .map(({ item }) => item);

    if (newNews.length === 0) {
      console.log('No new news items to insert');
      return { error: null, count: 0 };
    }

    const { error, count } = await supabase
      .from('news')
      .insert(newNews, { count: 'exact' });
    
    if (error) {
      console.error('Supabase error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
    }
    
    return { error, count };
  } catch (err) {
    console.error('Unexpected error while saving news:', err);
    return { error: err, count: 0 };
  }
} 