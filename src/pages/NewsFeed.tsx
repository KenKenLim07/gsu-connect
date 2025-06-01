import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import NewsList from "../components/news/NewsList";
import { newsData } from "../mock/newsData";

export default function NewsFeed() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>School News Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <NewsList news={newsData} />
        </CardContent>
      </Card>
    </div>
  );
} 