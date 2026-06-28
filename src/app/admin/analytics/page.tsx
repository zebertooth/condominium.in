import { AdminAnalyticsDashboard } from "@/components/admin/AdminAnalyticsDashboard";
import { getAnalyticsSummary } from "@/lib/analytics";

interface AdminAnalyticsPageProps {
  searchParams: Promise<{ days?: string }>;
}

export default async function AdminAnalyticsPage({ searchParams }: AdminAnalyticsPageProps) {
  const { days: daysParam } = await searchParams;
  const days = daysParam === "7" ? 7 : daysParam === "90" ? 90 : 30;
  const summary = await getAnalyticsSummary(days);
  return <AdminAnalyticsDashboard summary={summary} days={days} />;
}
