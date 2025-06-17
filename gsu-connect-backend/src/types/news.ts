export interface NewsItem {
  title: string;
  content: string;
  url: string;
  source_url: string;
  image_url?: string;
  published_at: string;  // Make this required
  campus_id?: string;
} 