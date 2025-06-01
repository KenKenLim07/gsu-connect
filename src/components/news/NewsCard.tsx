import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import type { NewsItem } from "../../mock/newsData";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const eventTypeColors: Record<NewsItem["eventType"], string> = {
  "Announcement": "bg-blue-100 text-blue-800",
  "Reminder": "bg-yellow-100 text-yellow-800",
  "Class Suspension": "bg-red-100 text-red-800",
  "Event": "bg-green-100 text-green-800",
  "Deadline": "bg-purple-100 text-purple-800",
  "General": "bg-gray-100 text-gray-800"
};

export default function NewsCard({ title, content, campus, eventType, timestamp, author }: NewsItem) {
  const formattedDate = new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex gap-1.5">
            <Badge variant="outline" className="bg-gray-100 text-xs px-2 py-0.5 rounded-md">
              {campus}
            </Badge>
            <Badge className={`${eventTypeColors[eventType]} text-xs px-2 py-0.5 rounded-md`}>
              {eventType}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{author}</span>
          <span>•</span>
          <span>{formattedDate}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{content}</p>
      </CardContent>
    </Card>
  );
} 