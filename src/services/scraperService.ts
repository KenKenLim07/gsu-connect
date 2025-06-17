import axios from 'axios';
import type { NewsItem } from '../types/news';

export const scraperService = {
  async scrapeCSTNews(): Promise<NewsItem[]> {
    try {
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com/',
        'DNT': '1',
        'Connection': 'keep-alive'
      };

      const url = 'https://your-school-domain.edu/gsu-connect/api/news'; // ⬅️ update this with the real base URL

      const response = await axios.get<NewsItem[]>(url, { headers });

      // Delay a bit like a human browsing
      await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 2000) + 1500));

      return response.data;
    } catch (error: unknown) {
      console.error('Error scraping CST news:', error instanceof Error ? error.message : error);
      return [];
    }
  }
};
