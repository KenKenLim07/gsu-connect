import axios from 'axios';
import * as cheerio from 'cheerio';
import { saveNewsToSupabase } from '../services/newsService';
import { supabase } from '../services/supabase';

export interface NewsItem {
  title: string;
  content: string;
  url: string;
  source_url: string;
  image_url?: string;
  published_at: string;  // Make this required
  campus_id?: string;
}

export async function scrapeGsuMain(): Promise<{ data: NewsItem[]; error: Error | null }> {
  const homepage = 'https://www.gsu.edu.ph';
  const news: NewsItem[] = [];

  try {
    // First, get existing news from the database
    const { data: existingNews } = await supabase
      .from('news')
      .select('url, title, content, source_url')
      .eq('campus_id', 'Main Campus');

    const existingUrls = new Set(existingNews?.map((item: { url: string }) => item.url) || []);
    const existingTitles = new Set(existingNews?.map((item: { title: string }) => item.title.toLowerCase()) || []);
    const existingSourceUrls = new Set(existingNews?.map((item: { source_url: string }) => item.source_url) || []);
    console.log(`Found ${existingUrls.size} existing news items in database`);

    // Helper function to normalize text for comparison
    const normalizeText = (text: string): string => {
      return text.toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove special characters
        .replace(/\s+/g, ' ')    // Normalize whitespace
        .trim();
    };

    // Helper function to check content similarity
    const isSimilarContent = (content1: string, content2: string): boolean => {
      const normalized1 = normalizeText(content1);
      const normalized2 = normalizeText(content2);
      
      // Split into words and create sets
      const words1 = new Set(normalized1.split(/\s+/));
      const words2 = new Set(normalized2.split(/\s+/));
      
      // Calculate word overlap
      const intersection = new Set([...words1].filter(x => words2.has(x)));
      const similarity = intersection.size / Math.max(words1.size, words2.size);
      
      // Check for significant phrases (3+ words) that match
      const phrases1 = normalized1.split(/\s+/).reduce((acc: string[], word: string, i: number, arr: string[]) => {
        if (i < arr.length - 2) {
          acc.push(`${word} ${arr[i + 1]} ${arr[i + 2]}`);
        }
        return acc;
      }, []);
      
      const phrases2 = normalized2.split(/\s+/).reduce((acc: string[], word: string, i: number, arr: string[]) => {
        if (i < arr.length - 2) {
          acc.push(`${word} ${arr[i + 1]} ${arr[i + 2]}`);
        }
        return acc;
      }, []);
      
      const phraseOverlap = phrases1.filter(phrase => phrases2.includes(phrase)).length;
      const phraseSimilarity = phraseOverlap / Math.max(phrases1.length, phrases2.length);
      
      // Consider it similar if either word similarity or phrase similarity is high
      return similarity > 0.7 || phraseSimilarity > 0.5;
    };

    // Helper function to check URL similarity
    const isSimilarUrl = (url1: string, url2: string): boolean => {
      const normalizeUrl = (url: string): string => {
        return url.toLowerCase()
          .replace(/^https?:\/\//, '')  // Remove protocol
          .replace(/\/$/, '')           // Remove trailing slash
          .replace(/[^\w\s-]/g, '')     // Remove special characters
          .replace(/\s+/g, '-');        // Replace spaces with hyphens
      };
      
      const normalized1 = normalizeUrl(url1);
      const normalized2 = normalizeUrl(url2);
      
      // Check if one URL contains the other
      if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
        return true;
      }
      
      // Calculate similarity based on common path segments
      const segments1 = normalized1.split('-');
      const segments2 = normalized2.split('-');
      const commonSegments = segments1.filter(seg => segments2.includes(seg));
      
      return commonSegments.length / Math.max(segments1.length, segments2.length) > 0.7;
    };

    console.log('Fetching news from:', homepage);
    const { data } = await axios.get(homepage);
    const $ = cheerio.load(data);

    // Get all post links from different possible structures
    const postLinks: string[] = [];
    
    // Method 1: Find links in the news section with date-based URLs
    $('a[href*="/202"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && href.includes(homepage) && !postLinks.includes(href)) {
        postLinks.push(href);
      }
    });

    // Method 2: Find links in the news and updates section
    $('.news-updates a, .featured-news a').each((_, el) => {
      const href = $(el).attr('href');
      if (href && href.includes(homepage) && !postLinks.includes(href)) {
        postLinks.push(href);
      }
    });

    console.log(`Found ${postLinks.length} post links.`);

    for (const link of postLinks) {
      try {
        const postRes = await axios.get(link);
        const $$ = cheerio.load(postRes.data);

        // Get the title from the article header
        const title = $$('h1.entry-title, h1.h1').first().text().trim();
        
        // Skip if title already exists (case-insensitive)
        if (existingTitles.has(title.toLowerCase())) {
          console.log('Skipping duplicate title:', title);
          continue;
        }

        // Skip if URL already exists
        if (existingUrls.has(link)) {
          console.log('Skipping existing URL:', link);
          continue;
        }

        // Check for similar source URLs
        const hasSimilarSourceUrl = Array.from(existingSourceUrls).some(existingUrl => 
          isSimilarUrl(link, existingUrl)
        );
        
        if (hasSimilarSourceUrl) {
          console.log('Skipping similar source URL:', link);
          continue;
        }
        
        // Get the content from the article body - FIXED CONTENT EXTRACTION
        let content = '';
        
        // Try different content selectors
        const contentSelectors = [
          '.entry-content p',  // Main content paragraphs
          '.post-content p',   // Alternative content class
          'article p',         // Any paragraph in article
          '.content p'         // Generic content class
        ];

        for (const selector of contentSelectors) {
          const paragraphs = $$(selector);
          if (paragraphs.length > 0) {
            content = paragraphs.map((_, el) => $$(el).text().trim())
              .get()
              .filter(text => text.length > 0) // Remove empty paragraphs
              .join('\n\n');
            break;
          }
        }

        // If no content found with selectors, try getting all text from entry-content
        if (!content) {
          content = $$('.entry-content').text().trim();
        }

        // Clean up the content
        content = content
          .replace(/\s+/g, ' ')           // Replace multiple spaces with single space
          .replace(/\n\s*\n/g, '\n\n')    // Replace multiple newlines with double newline
          .trim();

        // Check for content similarity with existing articles
        const isDuplicate = existingNews?.some((item: { content: string }) => 
          isSimilarContent(content, item.content)
        );

        if (isDuplicate) {
          console.log('Skipping similar content:', title);
          continue;
        }
        
        // Extract image URL from the featured image
        let image_url = '';
        
        // Define image selectors in order of preference
        const imageSelectors = [
          '.wp-block-post-featured-image img',  // WordPress featured image
          '.entry-thumbnail img',               // Entry thumbnail
          '.post-thumbnail img',                // Post thumbnail
          '.featured-image img',                // Featured image
          '.entry-content img:first-child',     // First image in content
          'article img:first-child',            // First image in article
          'img[decoding="async"]',             // Images with async decoding
          'img[alt*="GSU"]',                   // Images with GSU in alt text
          'img[src*="uploads"]',               // Images from uploads directory
          'img[src*="wp-content"]'             // WordPress content images
        ];

        // Try each selector until we find an image
        for (const selector of imageSelectors) {
          const img = $$(selector).first();
          if (img.length) {
            const src = img.attr('src');
            const alt = img.attr('alt') || '';
            
            // Validate the image URL
            if (src && (src.startsWith('http') || src.startsWith('/'))) {
              // Make sure the URL is absolute
              image_url = src.startsWith('/') ? `https://www.gsu.edu.ph${src}` : src;
              
              // Log the found image details
              console.log('Found image:', {
                selector,
                src: image_url,
                alt
              });
              
              break;
            }
          }
        }

        // If still no image found, try to find any image in the article
        if (!image_url) {
          const anyImage = $$('article img, .entry-content img').first();
          if (anyImage.length) {
            const src = anyImage.attr('src');
            if (src) {
              image_url = src.startsWith('/') ? `https://www.gsu.edu.ph${src}` : src;
              console.log('Found fallback image:', image_url);
            }
          }
        }

        // Validate the final image URL
        if (image_url) {
          // Remove any query parameters
          image_url = image_url.split('?')[0];
          
          // Ensure it's a valid image URL
          if (!image_url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            console.warn('Invalid image URL format:', image_url);
            image_url = '';
          }
        }
        
        // Try multiple methods to extract the date
        let published_at = '';
        
        // Method 1: Try to get date from the "Posted on" text
        const postedOnText = $$('p:contains("Posted on")').first().text();
        const dateMatch = postedOnText.match(/Posted on\s+([A-Za-z]+\s+\d{1,2},\s+\d{4})/);
        if (dateMatch) {
          published_at = dateMatch[1];
        }
        
        // Method 2: Try to get date from meta tags
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

        // Method 3: Try to get date from URL (format: /YYYY/MM/DD/)
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

        // Debug extracted values
        console.log('Extracted values:', { 
          title, 
          content: content?.slice(0, 100), 
          published_at, 
          image_url 
        });

        if (!title || !content || !published_at) {
          console.warn('Missing field(s) in:', link);
          continue;
        }

        news.push({
          title,
          content,
          url: link,
          source_url: link,
          image_url,
          published_at,
          campus_id: "Main Campus"
        });
      } catch (err) {
        console.warn('Failed to fetch or parse article:', link);
      }
    }

    console.log(`Successfully scraped ${news.length} new news items`);
    
    // Only save if we have new items
    if (news.length > 0) {
      await saveNewsToSupabase(news, "Main Campus");
    } else {
      console.log('No new news items to save');
    }
    
    return { data: news, error: null };

  } catch (error) {
    console.error('Failed to scrape GSU main website:', error);
    return { 
      data: [], 
      error: error instanceof Error ? error : new Error('Unknown error occurred while scraping') 
    };
  }
} 