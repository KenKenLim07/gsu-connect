import { Card, CardContent } from "../ui/card";
import { Sparkles } from "lucide-react";

export default function WelcomeBanner() {
  return (
    <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Welcome back, Admin 👋</h1>
            <p className="mt-1 text-blue-100">
              Here's what's happening with your courses today.
            </p>
          </div>
          <Sparkles className="h-8 w-8 text-yellow-300" />
        </div>
      </CardContent>
    </Card>
  );
} 