import { getCustomersWithStats } from "@/lib/queries/admin";
import AdminCustomersClient from "./AdminCustomersClient";

export default async function AdminCustomersPage() {
  const customers = await getCustomersWithStats();
  return <AdminCustomersClient customers={customers} />;
}
