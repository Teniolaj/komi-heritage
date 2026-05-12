import { getAdminOverviewStats, getRecentOrders } from "@/lib/queries/admin";
import AdminOverviewClient from "./AdminOverviewClient";

export default async function AdminOverviewPage() {
  const [stats, recentOrders] = await Promise.all([
    getAdminOverviewStats(),
    getRecentOrders(5),
  ]);

  return <AdminOverviewClient stats={stats} recentOrders={recentOrders} />;
}
