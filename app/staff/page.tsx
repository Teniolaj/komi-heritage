import { getAllOrdersForAdmin } from "@/lib/queries/admin";
import StaffOrdersClient from "./StaffOrdersClient";

export default async function StaffPage() {
  const orders = await getAllOrdersForAdmin();
  return <StaffOrdersClient initialOrders={orders} />;
}
