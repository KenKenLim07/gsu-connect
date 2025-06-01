import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import RecentActivity from "../components/dashboard/RecentActivity";
import QuickTips from "../components/dashboard/QuickTips";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <WelcomeBanner />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentActivity />
        <QuickTips />
      </div>
    </div>
  );
} 