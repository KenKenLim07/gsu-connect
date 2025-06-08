const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/news', async (req, res) => {
  try {
    const response = await axios.get('https://cst.gsu.edu.ph/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    const $ = cheerio.load(response.data);
    const newsItems = [];

    // Look for news items in the main content area
    $('article, .post, .news, .announcement').each((_, element) => {
      const title = $(element).find('h1, h2, h3, .title, .heading').first().text().trim();
      const content = $(element).find('p, .content, .description').first().text().trim();
      const date = $(element).find('time, .date, .timestamp').first().text().trim() || new Date().toISOString();

      if (title && content) {
        newsItems.push({
          id: Math.random().toString(36).substr(2, 9),
          title,
          content,
          campus: "Salvador",
          eventType: "Announcement",
          timestamp: new Date(date).toISOString(),
          author: "GSU CST"
        });
      }
    });

    // If no news items found, try a more generic approach
    if (newsItems.length === 0) {
      $('div, section').each((_, element) => {
        const title = $(element).find('h1, h2, h3').first().text().trim();
        const content = $(element).find('p').first().text().trim();
        
        if (title && content && title.length > 5 && content.length > 20) {
          newsItems.push({
            id: Math.random().toString(36).substr(2, 9),
            title,
            content,
            campus: "Salvador",
            eventType: "Announcement",
            timestamp: new Date().toISOString(),
            author: "GSU CST"
          });
        }
      });
    }

    res.json(newsItems);
  } catch (error) {
    console.error('Error scraping news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
}); 