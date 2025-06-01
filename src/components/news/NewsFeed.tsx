import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import NewsCard from "./NewsCard";
import { newsData, type Campus } from "../../mock/newsData";

export default function NewsFeed() {
  const [selectedCampus, setSelectedCampus] = useState<Campus | "All">("All");

  const filteredNews = selectedCampus === "All"
    ? newsData
    : newsData.filter((item) => item.campus === selectedCampus);

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