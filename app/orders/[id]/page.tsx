import Link from "next/link";
import { getOrderById } from "@/lib/queries/orders";
import OrderTracker from "./OrderTracker";
import type { OrderData } from "./OrderTracker";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let order;
  try {
    order = await getOrderById(id);
  } catch {
    // Auth failure or query error
    order = null;
  }

  if (!order) {
    return (
      <div className="bg-background text-on-background font-body min-h-[100dvh] flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <h1 className="font-headline text-3xl font-bold text-primary">
            Order Not Found
          </h1>
          <p className="font-dm-sans text-on-surface-variant">
            This order does not exist or you don&apos;t have permission to view
            it.
          </p>
          <Link
            href="/menu"
            className="inline-block mt-4 font-dm-sans text-sm text-primary underline underline-offset-4"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  // Map to the shape the client component expects
  const orderData: OrderData = {
    id: order.id,
    order_number: order.order_number,
    status: order.status,
    fulfillment_type: order.fulfillment_type,
    delivery_address: order.delivery_address,
    subtotal: order.subtotal,
    delivery_fee: order.delivery_fee,
    total: order.total,
    note: order.note,
    created_at: order.created_at,
    updated_at: order.updated_at,
    order_items: order.order_items.map((item) => ({
      id: item.id,
      snapshot_name: item.snapshot_name,
      unit_price: item.unit_price,
      quantity: item.quantity,
      line_total: item.line_total,
    })),
  };

  return <OrderTracker initialOrder={orderData} />;
}
