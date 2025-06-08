import axios from 'axios';
import * as cheerio from 'cheerio';
import type { NewsItem } from '../mock/newsData';

export const scraperService = {
  async scrapeCSTNews(): Promise<NewsItem[]> {
    try {
      const response = await axios.get('http://localhost:3001/api/news');
      return response.data;
    } catch (error) {
      console.error('Error scraping CST news:', error);
      return [];
    }
  }
}; 