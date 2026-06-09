import { AdminAnalyticsDashboard } from "@/components/admin/AdminAnalyticsDashboard";
import { getAnalyticsSummary } from "@/lib/analytics";

export default async function AdminAnalyticsPage() {
  const summary = await getAnalyticsSummary(30);
  return <AdminAnalyticsDashboard summary={summary} />;
}
