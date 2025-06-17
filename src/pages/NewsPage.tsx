import { useSearchParams } from 'react-router-dom';
import NewsFeed from '../features/news/components/NewsFeed';

export default function NewsPage() {
  const [searchParams] = useSearchParams();
  const campus = searchParams.get('campus');

  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <NewsFeed initialCampus={campus} />
    </div>
  );
} 