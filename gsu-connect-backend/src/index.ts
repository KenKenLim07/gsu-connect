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
import { scrapeGsuMain } from './scrapers/gsuMainScraper';
import { saveNews } from './services/supabaseService';

async function main() {
  try {
    // Scrape CST news
    console.log('\n=== Scraping GSU CST news ===');
    const cstNews = await scrapeGsuCstNews();
    console.log(`Found ${cstNews.length} CST articles.`);
    if (cstNews.length) {
      const { error: cstError, count: cstCount, updateCount: cstUpdateCount } = await saveNews(cstNews);
      if (cstError) {
        console.error('Error saving CST news to Supabase:', cstError.message);
      } else {
        console.log(`Saved ${cstCount} new CST articles and updated ${cstUpdateCount} existing articles.`);
      }
    }

    // Scrape Main Campus news
    console.log('\n=== Scraping GSU Main news ===');
    const { data: mainNews, error: mainError } = await scrapeGsuMain();
    if (mainError) {
      console.error('Error scraping Main Campus news:', mainError.message);
    } else {
      console.log(`Found ${mainNews.length} Main Campus articles.`);
      if (mainNews.length) {
        const { error: saveError, count: mainCount, updateCount: mainUpdateCount } = await saveNews(mainNews);
        if (saveError) {
          console.error('Error saving Main Campus news to Supabase:', saveError.message);
  } else {
          console.log(`Saved ${mainCount} new Main Campus articles and updated ${mainUpdateCount} existing articles.`);
        }
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
}); 