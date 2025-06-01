import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Calendar, MessageSquare, HelpCircle, ChevronRight, Clock, BookOpen, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  // Mock data for news feed
  const [newsItems] = useState([
    {
      id: 1,
      title: "Class Suspension - Jordan Campus",
      summary: "Due to inclement weather, all classes at Jordan Campus are suspended until further notice. Please check your email for updates.",
      campus: "Jordan",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      title: "STEM Research Symposium",
      summary: "Join us for the annual STEM Research Symposium featuring student projects and guest speakers. Registration is now open for all students.",
      campus: "Main",
      timestamp: "5 hours ago",
    },
  ]);

  // Mock data for forum posts
  const [forumPosts] = useState([
    {
      id: 1,
      title: "Where to buy used books on campus?",
      excerpt: "Looking for recommendations on where to find affordable textbooks for Computer Science courses. Any suggestions would be greatly appreciated!",
      author: {
        name: "Maria L.",
        avatar: null,
        campus: "Jordan"
      },
      timestamp: "3 hours ago",
      replies: 5
    },
    {
      id: 2,
      title: "Study Group for Calculus II",
      excerpt: "Forming a study group for Calculus II. We meet every Tuesday and Thursday at the library. Looking for 2-3 more students to join our group.",
      author: {
        name: "John D.",
        avatar: null,
        campus: "Main"
      },
      timestamp: "5 hours ago",
      replies: 3
    },
  ]);

  // Mock data for tips
  const [tips] = useState([
    {
      id: 1,
      title: "Academic Support",
      content: "Visit the Writing Center for help with papers and assignments.",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      id: 2,
      title: "Health & Wellness",
      content: "Free counseling services available for all students.",
      icon: <Heart className="h-4 w-4" />,
    },
  ]);

  // Mock data for events
  const [events] = useState([
    {
      id: 1,
      title: "Career Fair 2024",
      date: "March 15, 2024",
      time: "10:00 AM - 3:00 PM",
      location: "Student Center",
    },
    {
      id: 2,
      title: "Spring Concert",
      date: "April 20, 2024",
      time: "7:00 PM",
      location: "University Amphitheater",
    },
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Welcome to GSU Connect</h1>
        <p className="text-muted-foreground">Your central hub for campus life and resources</p>
      </div>

      {/* Quick Access Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-1">
          <MessageSquare className="h-5 w-5" />
          <span className="text-sm">Post in Forum</span>
        </Button>
        <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-1">
          <Calendar className="h-5 w-5" />
          <span className="text-sm">View Events</span>
        </Button>
        <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-1">
          <HelpCircle className="h-5 w-5" />
          <span className="text-sm">Ask a Question</span>
        </Button>
      </div>

      <div className="border-t border-border/40" />

      {/* News and Forum Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* News Preview Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span role="img" aria-label="news">📢</span> Latest News
            </h2>
            <Button variant="link" className="gap-1 text-sm" asChild>
              <Link to="/news">
                View All News
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-2">
            {newsItems.map((item) => (
              <Card key={item.id} className="hover:shadow-sm transition-shadow">
                <CardHeader className="p-3 pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-sm font-semibold line-clamp-2">{item.title}</CardTitle>
                    <Badge variant="secondary" className="text-xs shrink-0">{item.campus}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.summary}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{item.timestamp}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Forum Preview Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span role="img" aria-label="forum">💬</span> Recent Forum Posts
            </h2>
            <Button variant="link" className="gap-1 text-sm" asChild>
              <Link to="/forum">
                View All Forums
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-2">
            {forumPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-sm transition-shadow">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm font-semibold line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={post.author.avatar || undefined} />
                        <AvatarFallback className="text-xs">{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium">{post.author.name}</span>
                        <Badge variant="outline" className="text-[10px] px-1">
                          {post.author.campus}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <div className="border-t border-border/40" />

      {/* Tips & Resources Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span role="img" aria-label="tips">💡</span> Tips & Resources
          </h2>
          <Button variant="link" className="gap-1 text-sm" asChild>
            <Link to="/resources">
              View All Resources
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {tips.map((tip) => (
            <Card key={tip.id} className="hover:shadow-sm transition-shadow">
              <CardHeader className="p-3 pb-2">
                <div className="flex items-center gap-2">
                  {tip.icon}
                  <CardTitle className="text-sm font-semibold">{tip.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <p className="text-xs text-muted-foreground">{tip.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="border-t border-border/40" />

      {/* Upcoming Events Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span role="img" aria-label="events">📅</span> Upcoming Events
          </h2>
          <Button variant="link" className="gap-1 text-sm" asChild>
            <Link to="/events">
              View All Events
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="space-y-2">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-sm transition-shadow">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm font-semibold">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{event.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{event.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
} 