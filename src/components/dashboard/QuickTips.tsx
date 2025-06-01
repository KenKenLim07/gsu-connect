import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Lightbulb, BookOpen } from "lucide-react";

type Tip = {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
};

const tips: Tip[] = [
  {
    id: 1,
    icon: <Lightbulb className="h-5 w-5 text-yellow-500" />,
    title: "Explore Features",
    description: "Discover how to use GSU Connect effectively",
  },
  {
    id: 2,
    icon: <BookOpen className="h-5 w-5 text-blue-500" />,
    title: "Study Tips",
    description: "Learn about effective study techniques and resources",
  },
];

export default function QuickTips() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {tip.icon}
              <div>
                <h3 className="font-medium">{tip.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {tip.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 