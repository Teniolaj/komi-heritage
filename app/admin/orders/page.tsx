import { getAllOrdersForAdmin } from "@/lib/queries/admin";
import AdminOrdersClient from "./AdminOrdersClient";

export default async function AdminOrdersPage() {
  const orders = await getAllOrdersForAdmin();
  return <AdminOrdersClient initialOrders={orders} />;
}
