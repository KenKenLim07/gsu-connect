import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import ForumPost from "../components/forum/ForumPost";
import { Send } from "lucide-react";

type Post = {
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

const mockPosts: Post[] = [
  {
    id: 1,
    author: {
      name: "John Doe",
    },
    title: "React Course Discussion",
    content: "Just finished the React course! Anyone want to discuss the final project?",
    timestamp: "2 hours ago",
    likes: 5,
    comments: 2,
  },
  {
    id: 2,
    author: {
      name: "Jane Smith",
    },
    title: "Study Group Formation",
    content: "Looking for study partners for the upcoming exam. DM if interested!",
    timestamp: "5 hours ago",
    likes: 3,
    comments: 1,
  },
  {
    id: 3,
    author: {
      name: "Mike Johnson",
    },
    title: "TypeScript Learning Resources",
    content: "Great resources for learning TypeScript: [link]",
    timestamp: "1 day ago",
    likes: 8,
    comments: 4,
  },
];

export default function Forum() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    const post: Post = {
      id: posts.length + 1,
      author: {
        name: "Current User", // This would come from auth context
      },
      title: newPost.title,
      content: newPost.content,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
    };

    setPosts([post, ...posts]);
    setNewPost({ title: "", content: "" });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Post title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                required
              />
            </div>
            <Textarea
              placeholder="What's on your mind?"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="min-h-[100px]"
              required
            />
            <div className="flex justify-end">
              <Button type="submit" className="gap-2">
                <Send className="h-4 w-4" />
                Post
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {posts.map((post) => (
          <ForumPost key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
} 