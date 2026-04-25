import MenuManagerClient from "@/app/admin/menu/MenuManagerClient";
import { getAllMenuItemsForManager } from "@/lib/queries/menu";

export default async function MenuManagerPage() {
  const items = await getAllMenuItemsForManager();

  return <MenuManagerClient initialItems={items} />;
}
