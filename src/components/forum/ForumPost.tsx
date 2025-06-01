import { Card, CardContent, CardHeader } from "../ui/card";
import { MessageSquare, ThumbsUp, Share2 } from "lucide-react";
import { Button } from "../ui/button";

type ForumPostProps = {
  id: number;
  author: {
    name: string;
    avatar?: string;
  };
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
};

export default function ForumPost({
  author,
  title,
  content,
  timestamp,
  likes,
  comments,
}: ForumPostProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={author.name}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <span className="text-lg font-medium">
                {author.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-medium">{author.name}</h3>
            <p className="text-sm text-muted-foreground">{timestamp}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <h4 className="text-lg font-semibold mb-2">{title}</h4>
        <p className="text-sm mb-4">{content}</p>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="gap-2">
            <ThumbsUp className="h-4 w-4" />
            <span>{likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>{comments}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 