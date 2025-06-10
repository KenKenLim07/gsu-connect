import axios from 'axios';
import * as cheerio from 'cheerio';

export interface NewsItem {
  title: string;
  content: string;
  published_at: string;  // We'll convert this to a timestamp when saving
  source_url: string;
  campus_id: string;     // Changed from campus to campus_id
  image_url: string;     // Added image URL field
}

export async function scrapeGsuCstNews(): Promise<NewsItem[]> {
  const homepage = 'https://cst.gsu.edu.ph/';
  const news: NewsItem[] = [];
  
  // Define selectors array at the top
  const selectors = [
    '.wp-block-post-featured-image img',
    'figure.wp-block-post-featured-image img',
    '.wp-block-image img',
    '.entry-content img',
    'img.wp-post-image',
    'img[src*="uploads"]',
    'img[src*="wp-content"]',
    'img[src*="RANE"]',
    'img[src*="2025"]',
    'img[src*="LEA"]',
    'img[src*="admissions"]',
    'img'
  ];

  console.log('Fetching news from:', homepage);

  try {
    // Try multiple possible URLs for the admissions article
    const possibleAdmissionsUrls = [
      'https://cst.gsu.edu.ph/2025/05/05/admissions-now-open-for-bsemc-and-blis-programs-at-the-college-of-science-and-technology-starting-may-5-2025/',
      'https://cst.gsu.edu.ph/admissions-now-open/',
      'https://cst.gsu.edu.ph/2025/05/admissions-now-open/',
      'https://cst.gsu.edu.ph/2025/admissions-now-open/'
    ];

    for (const specificArticleUrl of possibleAdmissionsUrls) {
      try {
        console.log('Trying to fetch admissions article from:', specificArticleUrl);
        const specificArticleRes = await axios.get(specificArticleUrl);
        const $$ = cheerio.load(specificArticleRes.data);
        
        const title = $$('h1').first().text().trim();
        const content = $$('.entry-content').text().trim();
        
        // Only process if we found a title that mentions admissions
        if (title.toLowerCase().includes('admission')) {
          // Extract image URL
          let image_url = '';
          
          // Log all images found in the article
          console.log('All images in specific article:');
          $$('img').each((i, img) => {
            const src = $$(img).attr('src');
            const alt = $$(img).attr('alt');
            const classes = $$(img).attr('class');
            console.log(`Image ${i + 1}:`, { src, alt, classes });
          });

          // Try to find an image that matches the article title
          const titleWords = title.toLowerCase().split(' ');
          for (const img of $$('img').get()) {
            const src = $$(img).attr('src') || '';
            const alt = $$(img).attr('alt') || '';
            const classes = $$(img).attr('class') || '';
            
            // Check if any word from the title appears in the image attributes
            const matchesTitle = titleWords.some(word => 
              word.length > 3 && (
                src.toLowerCase().includes(word) ||
                alt.toLowerCase().includes(word) ||
                classes.toLowerCase().includes(word)
              )
            );
            
            if (matchesTitle) {
              image_url = src.startsWith('/') ? `https://cst.gsu.edu.ph${src}` : src;
              console.log('Found image matching article title:', image_url);
              break;
            }
          }

          // If no title-matching image found, try the selectors
          if (!image_url) {
            for (const selector of selectors) {
              const img = $$(selector).first();
              if (img.length) {
                const src = img.attr('src') || '';
                console.log(`Found image with selector ${selector}:`, src);
                
                // Validate the image URL
                if (src && (src.startsWith('http') || src.startsWith('/'))) {
                  image_url = src.startsWith('/') ? `https://cst.gsu.edu.ph${src}` : src;
                  console.log('Validated image URL:', image_url);
                  break;
                }
              }
            }
          }

          // If still no image, try to find any image in the article
          if (!image_url) {
            const anyImage = $$('img').first();
            if (anyImage.length) {
              const src = anyImage.attr('src') || '';
              if (src) {
                image_url = src.startsWith('/') ? `https://cst.gsu.edu.ph${src}` : src;
                console.log('Found fallback image:', image_url);
              }
            }
          }

          // Extract date from URL or content
          let published_at = '';
          const urlMatch = specificArticleUrl.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
          if (urlMatch) {
            const [_, year, month, day] = urlMatch;
            const date = new Date(`${year}-${month}-${day}`);
            published_at = date.toLocaleDateString('en-US', { 
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          } else {
            // Try to extract date from content
            const dateMatch = content.match(/(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/);
            if (dateMatch) {
              published_at = dateMatch[0];
            } else {
              // Default to current date if no date found
              published_at = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
            }
          }

          if (title && content) {
            news.push({
              title,
              content,
              published_at,
              source_url: specificArticleUrl,
              campus_id: 'CST',
              image_url,
            });
            console.log('Added admissions article:', title);
            break; // Stop trying other URLs once we find the article
          }
        }
      } catch (err) {
        console.warn(`Failed to fetch admissions article from ${specificArticleUrl}:`, err);
        continue; // Try the next URL
      }
    }

    // Then proceed with the regular scraping
    const { data } = await axios.get(homepage);
    const $ = cheerio.load(data);

    // Get all post links from different possible structures
    const postLinks: string[] = [];
    
    // Method 1: Featured image links
    $('figure.wp-block-post-featured-image a').each((_, el) => {
      const href = $(el).attr('href');
      if (href) postLinks.push(href);
    });

    // Method 2: Article links in the main content
    $('article a').each((_, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('/2025/') && !postLinks.includes(href)) {
        postLinks.push(href);
      }
    });

    // Method 3: Links in the main content area
    $('main a').each((_, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('/2025/') && !postLinks.includes(href)) {
        postLinks.push(href);
      }
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
        
        // Extract image URL
        let image_url = '';
        
        // Debug HTML structure
        console.log('Article HTML structure:', $$('main').html()?.slice(0, 1000));
        
        // Try multiple selectors for featured image
        const selectors = [
          '.wp-block-post-featured-image img',
          'figure.wp-block-post-featured-image img',
          '.wp-block-image img',
          '.entry-content img',
          'img.wp-post-image',
          'img[src*="uploads"]',
          'img[src*="wp-content"]',
          'img[src*="RANE"]',  // Added specific selector for RANE images
          'img[src*="2025"]',  // Added selector for 2025 images
          'img[src*="LEA"]',   // Added selector for LEA images
          'img[src*="admissions"]', // Added selector for admissions-related images
          'img'  // Added fallback to any image
        ];

        // Log all images found in the article
        console.log('All images in article:');
        $$('img').each((i, img) => {
          const src = $$(img).attr('src');
          const alt = $$(img).attr('alt');
          const classes = $$(img).attr('class');
          console.log(`Image ${i + 1}:`, { src, alt, classes });
        });

        // First try to find an image that matches the article title
        const titleWords = title.toLowerCase().split(' ');
        for (const img of $$('img').get()) {
          const src = $$(img).attr('src') || '';
          const alt = $$(img).attr('alt') || '';
          const classes = $$(img).attr('class') || '';
          
          // Check if any word from the title appears in the image attributes
          const matchesTitle = titleWords.some(word => 
            word.length > 3 && (
              src.toLowerCase().includes(word) ||
              alt.toLowerCase().includes(word) ||
              classes.toLowerCase().includes(word)
            )
          );
          
          if (matchesTitle) {
            image_url = src.startsWith('/') ? `https://cst.gsu.edu.ph${src}` : src;
            console.log('Found image matching article title:', image_url);
            break;
          }
        }

        // If no title-matching image found, try the selectors
        if (!image_url) {
          for (const selector of selectors) {
            const img = $$(selector).first();
            if (img.length) {
              const src = img.attr('src') || '';
              console.log(`Found image with selector ${selector}:`, src);
              
              // Validate the image URL
              if (src && (src.startsWith('http') || src.startsWith('/'))) {
                image_url = src.startsWith('/') ? `https://cst.gsu.edu.ph${src}` : src;
                console.log('Validated image URL:', image_url);
                break;
              }
            }
          }
        }

        // If still no image, try to find any image in the article
        if (!image_url) {
          const anyImage = $$('img').first();
          if (anyImage.length) {
            const src = anyImage.attr('src') || '';
            if (src) {
              image_url = src.startsWith('/') ? `https://cst.gsu.edu.ph${src}` : src;
              console.log('Found fallback image:', image_url);
            }
          }
        }
        
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
        console.log('Extracted values:', { title, content: content?.slice(0, 100), published_at, image_url });

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
          image_url,
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
 