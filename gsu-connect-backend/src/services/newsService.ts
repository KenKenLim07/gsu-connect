import { supabase } from '../config/supabase';
import { NewsItem } from '../scrapers/gsuMainScraper';

export async function saveNewsToSupabase(newsItems: NewsItem[], campusName: string) {
  try {
    // First, get or create the campus
    let { data: campus, error: campusError } = await supabase
      .from('campuses')
      .select('id')
      .eq('name', campusName)
      .single();

    if (campusError && campusError.code === 'PGRST116') {
      // Campus doesn't exist, create it
      console.log(`Creating new campus: ${campusName}`);
      const { data: newCampus, error: createError } = await supabase
        .from('campuses')
        .insert([{ name: campusName }])
        .select()
        .single();

      if (createError) {
        console.error('Error creating campus:', createError);
        throw createError;
      }
      campus = newCampus;
    } else if (campusError) {
      console.error('Error fetching campus:', campusError);
      throw campusError;
    }

    if (!campus) {
      throw new Error(`Could not find or create campus: ${campusName}`);
    }

    console.log(`Found existing campus: ${campusName}`);

    // Get existing news items for this campus
    const { data: existingNews, error: fetchError } = await supabase
      .from('news')
      .select('id, title, source_url, content')
      .eq('campus_id', campus.id);

    if (fetchError) {
      console.error('Error fetching existing news:', fetchError);
      throw fetchError;
    }

    console.log(`Processed news items: ${newsItems.length}`);
    console.log(`Found existing news items: ${existingNews?.length || 0}`);

    // Prepare news items for upsert
    const newsToUpsert = newsItems.map(item => ({
      title: item.title,
      content: item.content,
      source_url: item.source_url,
      image_url: item.image_url,
      published_at: item.published_at,
      campus_id: campus.id
    }));

    // Check for duplicates and prepare update/insert operations
    const itemsToUpdate: any[] = [];
    const itemsToInsert: any[] = [];

    for (const item of newsToUpsert) {
      const existingItem = existingNews?.find(
        existing => 
          existing.title.toLowerCase() === item.title.toLowerCase() ||
          existing.source_url === item.source_url ||
          (existing.content && item.content && 
           existing.content.length > 100 && item.content.length > 100 &&
           existing.content.slice(0, 100) === item.content.slice(0, 100))
      );

      if (existingItem) {
        // Update existing item
        itemsToUpdate.push({
          id: existingItem.id,
          ...item
        });
      } else {
        // Insert new item
        itemsToInsert.push(item);
      }
    }

    console.log(`Items to update: ${itemsToUpdate.length}`);
    console.log(`Items to insert: ${itemsToInsert.length}`);

    // Perform updates if any
    if (itemsToUpdate.length > 0) {
      for (const item of itemsToUpdate) {
        const { id, ...updateData } = item;
        console.log('Updating article:', {
          title: updateData.title,
          oldImage: existingNews?.find(n => n.id === id)?.image_url,
          newImage: updateData.image_url
        });
        
        const { error: updateError } = await supabase
          .from('news')
          .update(updateData)
          .eq('id', id);

        if (updateError) {
          console.error('Error updating news item:', updateError);
        }
      }
    }

    // Perform inserts if any
    if (itemsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('news')
        .insert(itemsToInsert);

      if (insertError) {
        console.error('Error inserting news items:', insertError);
        throw insertError;
      }
    }

    console.log('Save operation complete:', {
      updates: itemsToUpdate.length,
      inserts: itemsToInsert.length,
      errors: 0
    });

    console.log(`Saved ${itemsToInsert.length} new ${campusName} articles and updated ${itemsToUpdate.length} existing articles.`);
  } catch (error) {
    console.error(`Error saving ${campusName} news to Supabase:`, error);
    throw error;
  }
} 