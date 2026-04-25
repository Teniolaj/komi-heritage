import MenuPageClient from "@/app/menu/MenuPageClient";
import { getAvailableMenuItems } from "@/lib/queries/menu";

export default async function MenuPage() {
  const menuItems = await getAvailableMenuItems();

  return <MenuPageClient menuItems={menuItems} />;
}
