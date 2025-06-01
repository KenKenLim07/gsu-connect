import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import NewsCard from "./NewsCard";
import type { NewsItem, Campus, EventType } from "../../mock/newsData";

interface NewsListProps {
  news: NewsItem[];
}

export default function NewsList({ news }: NewsListProps) {
  const [selectedCampus, setSelectedCampus] = useState<Campus | "All">("All");
  const [selectedEventType, setSelectedEventType] = useState<EventType | "All">("All");

  const filteredNews = news.filter((item) => {
    const campusMatch = selectedCampus === "All" || item.campus === selectedCampus;
    const eventTypeMatch = selectedEventType === "All" || item.eventType === selectedEventType;
    return campusMatch && eventTypeMatch;
  });

  const sortedNews = [...filteredNews].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Select
          value={selectedCampus}
          onValueChange={(value: string) => setSelectedCampus(value as Campus | "All")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select campus" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Campuses</SelectItem>
            <SelectItem value="Salvador">Salvador</SelectItem>
            <SelectItem value="Mosqueda">Mosqueda</SelectItem>
            <SelectItem value="Baterna">Baterna</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={selectedEventType}
          onValueChange={(value: string) => setSelectedEventType(value as EventType | "All")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="Announcement">Announcement</SelectItem>
            <SelectItem value="Reminder">Reminder</SelectItem>
            <SelectItem value="Class Suspension">Class Suspension</SelectItem>
            <SelectItem value="Event">Event</SelectItem>
            <SelectItem value="Deadline">Deadline</SelectItem>
            <SelectItem value="General">General</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="space-y-4 pr-4">
          {sortedNews.map((item) => (
            <NewsCard key={item.id} {...item} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
} 