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
  console.log(`\n🕒 Scraper started at: ${new Date().toLocaleString()}`);
  
  try {
    // Scrape CST news
    console.groupCollapsed('🌐 CST News Results');
    const cstNews = await scrapeGsuCstNews();
    console.log(`Found ${cstNews.length} CST articles.`);
    if (cstNews.length) {
      const { error: cstError, count: cstCount, updateCount: cstUpdateCount } = await saveNews(cstNews);
      if (cstError) {
        console.error('Error saving CST news to Supabase:', cstError.message);
      } else {
        console.log({ newArticles: cstCount, updated: cstUpdateCount });
      }
    }
    console.groupEnd();

    // Random delay between scraping targets
    const waitTime = Math.floor(Math.random() * 3000) + 2000;
    console.log(`Sleeping for ${waitTime}ms before scraping GSU Main...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));

    // Scrape Main Campus news
    console.groupCollapsed('🌐 Main Campus News Results');
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
          console.log({ newArticles: mainCount, updated: mainUpdateCount });
        }
      }
    }
    console.groupEnd();

    console.log('\n✅ Scraper completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Scraper failed:', err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌ Scraper failed:', err);
  process.exit(1);
}); 