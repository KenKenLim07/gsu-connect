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

async function createNewsLikesTable() {
  const supabase = getSupabaseClient();
  
  // Create news_likes table if it doesn't exist
  const { error } = await supabase.rpc('create_news_likes_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS news_likes (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        news_id UUID REFERENCES news(id) ON DELETE CASCADE,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        UNIQUE(news_id, user_id)
      );
    `
  });

  if (error) {
    console.error('Error creating news_likes table:', error);
  }
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
        campus_id: campusId,
        image_url: item.image_url || null
      };
    }));

    // Check for existing news items and update them
    const results = await Promise.all(
      processedNews.map(async (item) => {
        const { data: existingNews } = await supabase
          .from('news')
          .select('id')
          .eq('title', item.title)
          .eq('campus_id', item.campus_id)
          .maybeSingle();

        if (existingNews) {
          // Update existing news item with new image URL
          const { error: updateError } = await supabase
            .from('news')
            .update({ image_url: item.image_url })
            .eq('id', existingNews.id as string);
          
          return { error: updateError, isUpdate: true };
        } else {
          // Insert new news item
          const { error: insertError } = await supabase
            .from('news')
            .insert(item);
          
          return { error: insertError, isUpdate: false };
        }
      })
    );

    const errors = results.filter(r => r.error);
    if (errors.length > 0) {
      console.error('Errors during save/update:', errors);
    }

    const updateCount = results.filter(r => r.isUpdate).length;
    const insertCount = results.filter(r => !r.isUpdate).length;

    return { 
      error: errors.length > 0 ? errors[0].error as Error : null, 
      count: insertCount,
      updateCount 
    };
  } catch (err) {
    console.error('Unexpected error while saving news:', err);
    return { error: err as Error, count: 0, updateCount: 0 };
  }
} 