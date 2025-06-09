import axios from 'axios';
import type { NewsItem } from '../types/news';

export const scraperService = {
  async scrapeCSTNews(): Promise<NewsItem[]> {
    try {
      const response = await axios.get('/gsu-connect/api/news');
      return response.data;
    } catch (error) {
      console.error('Error scraping CST news:', error);
      return [];
    }
  }
}; 