export type Campus = "Salvador" | "Mosqueda" | "Baterna";

export type EventType = 
  | "Announcement"
  | "Reminder"
  | "Class Suspension"
  | "Event"
  | "Deadline"
  | "General";

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  campus: Campus;
  eventType: EventType;
  timestamp: string;
  author: string;
}

export const newsData: NewsItem[] = [
  {
    id: "1",
    title: "Midterm Examination Schedule",
    content: "Midterm examinations will be held from March 15-20. Please check your respective schedules.",
    campus: "Salvador",
    eventType: "Reminder",
    timestamp: "2024-03-01T09:00:00Z",
    author: "Academic Office"
  },
  {
    id: "2",
    title: "Campus Maintenance",
    content: "The library will be closed for maintenance on March 10-12.",
    campus: "Mosqueda",
    eventType: "Announcement",
    timestamp: "2024-03-02T10:30:00Z",
    author: "Facilities Management"
  },
  {
    id: "3",
    title: "Class Suspension",
    content: "Classes are suspended on March 8 due to inclement weather.",
    campus: "Baterna",
    eventType: "Class Suspension",
    timestamp: "2024-03-03T08:00:00Z",
    author: "Administration"
  },
  {
    id: "4",
    title: "Student Organization Fair",
    content: "Join us for the annual Student Organization Fair on March 15 at the main quad.",
    campus: "Salvador",
    eventType: "Event",
    timestamp: "2024-03-04T14:00:00Z",
    author: "Student Affairs"
  },
  {
    id: "5",
    title: "Scholarship Application Deadline",
    content: "Deadline for scholarship applications is extended until March 20.",
    campus: "Mosqueda",
    eventType: "Deadline",
    timestamp: "2024-03-05T11:00:00Z",
    author: "Financial Aid Office"
  }
]; 