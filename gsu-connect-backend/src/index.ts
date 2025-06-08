import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Get the absolute path to the .env file
const envPath = path.resolve(process.cwd(), '.env');
console.log('Looking for .env file at:', envPath);
console.log('File exists:', fs.existsSync(envPath));

// Load environment variables
const result = dotenv.config({ path: envPath });
console.log('Dotenv config result:', result);

// Log the actual environment variables (safely)
console.log('Environment variables loaded:', {
  SUPABASE_URL: process.env.SUPABASE_URL ? 'present' : 'missing',
  SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE ? 'present' : 'missing',
  NODE_ENV: process.env.NODE_ENV
});

import { scrapeGsuCstNews } from './scrapers/gsuCstScraper';
import { saveNews } from './services/supabaseService';

async function main() {
  console.log('Scraping GSU CST news...');
  const news = await scrapeGsuCstNews();
  console.log(`Found ${news.length} articles.`);
  if (news.length) {
    const { error, count } = await saveNews(news);
    if (error) {
      console.error('Error saving news to Supabase:', error.message);
    } else {
      console.log(`Saved ${count ?? news.length} articles to Supabase.`);
    }
  } else {
    console.log('No news articles found.');
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
}); 