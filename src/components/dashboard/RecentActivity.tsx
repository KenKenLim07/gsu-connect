import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { MessagesSquare, User, BookOpen, Calendar } from "lucide-react";

type Activity = {
  id: number;
  icon: React.ReactNode;
  title: string;
  timestamp: string;
};

const activities: Activity[] = [
  {
    id: 1,
    icon: <MessagesSquare className="h-5 w-5 text-blue-500" />,
    title: "Posted in Forum",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    icon: <User className="h-5 w-5 text-green-500" />,
    title: "Updated Profile",
    timestamp: "Yesterday",
  },
  {
    id: 3,
    icon: <BookOpen className="h-5 w-5 text-purple-500" />,
    title: "Completed Assignment",
    timestamp: "2 days ago",
  },
  {
    id: 4,
    icon: <Calendar className="h-5 w-5 text-orange-500" />,
    title: "Registered for Course",
    timestamp: "Last week",
  },
];

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {activity.icon}
              <div className="flex-1">
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 