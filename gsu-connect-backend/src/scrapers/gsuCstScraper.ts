import axios from 'axios';
import * as cheerio from 'cheerio';

export interface NewsItem {
  title: string;
  content: string;
  published_at: string;  // We'll convert this to a timestamp when saving
  source_url: string;
  campus_id: string;     // Changed from campus to campus_id
}

export async function scrapeGsuCstNews(): Promise<NewsItem[]> {
  const homepage = 'https://cst.gsu.edu.ph/';
  const news: NewsItem[] = [];

  console.log('Fetching news from:', homepage);

  try {
    const { data } = await axios.get(homepage);
    const $ = cheerio.load(data);

    // Get all post links from <figure><a href="...">
    const postLinks: string[] = [];
    $('figure.wp-block-post-featured-image a').each((_, el) => {
      const href = $(el).attr('href');
      if (href) postLinks.push(href);
    });

    console.log(`Found ${postLinks.length} post links.`);

    for (const link of postLinks) {
      try {
        const postRes = await axios.get(link);
        const $$ = cheerio.load(postRes.data);

        // Debug the HTML structure
        console.log('Article HTML:', $$('main').html()?.slice(0, 500));

        const title = $$('h1').first().text().trim();
        const content = $$('.entry-content').text().trim();
        
        // Try multiple methods to extract the date
        let published_at = '';
        
        // Method 1: Try to get date from content (format: "Month DD, YYYY | Location")
        const dateMatch = content.match(/^([A-Za-z]+\s+\d{1,2},\s+\d{4})/);
        if (dateMatch) {
            published_at = dateMatch[1];
        }
        
        // Method 2: Try to get date from URL (format: /YYYY/MM/DD/)
        if (!published_at) {
            const urlMatch = link.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
            if (urlMatch) {
                const [_, year, month, day] = urlMatch;
                const date = new Date(`${year}-${month}-${day}`);
                published_at = date.toLocaleDateString('en-US', { 
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
        }

        // Method 3: Try to get date from meta tags
        if (!published_at) {
            published_at = $$('meta[property="article:published_time"]').attr('content') || '';
            if (published_at) {
                const date = new Date(published_at);
                published_at = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
        }

        // Debug extracted values
        console.log('Extracted values:', { title, content: content?.slice(0, 100), published_at });

        if (!title || !content || !published_at) {
          console.warn('Missing field(s) in:', link);
          continue;
        }

        news.push({
          title,
          content,
          published_at,
          source_url: link,
          campus_id: 'CST',  // We'll need to get the actual UUID from the campuses table
        });
      } catch (err) {
        console.warn('Failed to fetch or parse article:', link);
      }
    }

    console.log(`Extracted ${news.length} valid articles.`);
    return news;
  } catch (error) {
    console.error('Failed to fetch homepage:', error);
    return [];
  }
}
 