export interface Campus {
  id: string;
  name: string;
  location?: string;
  created_at: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  published_at: string;
  source_url: string;
  campus_id: string;
  created_at: string;
  campus?: Campus;
}

export interface NewsResponse {
  data: NewsItem[];
  error: Error | null;
  count: number;
} 