import { PageWrapper } from "@/components/PageWrapper";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getUserOrders } from "@/lib/queries/orders";
import { redirect } from "next/navigation";
import { Package, ArrowRight, ShoppingBag } from "lucide-react";
import { PrimaryButton } from "@/components/ui/Button";

function formatPrice(price: number) {
  return `GH₵${Number(price).toFixed(2)}`;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatStatus(status: string) {
  return status.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function getStatusBadge(status: string) {
  let bgColor = "bg-surface-container text-on-surface-variant";
  
  switch(status) {
    case "received": 
      bgColor = "bg-stone-200 text-stone-800"; break;
    case "preparing": 
    case "ready": 
    case "out_for_delivery": 
      bgColor = "bg-primary/10 text-primary border border-primary/20"; break;
    case "delivered": 
    case "picked_up": 
      bgColor = "bg-green-100 text-green-800"; break;
    case "cancelled": 
      bgColor = "bg-red-100 text-red-800"; break;
  }
  
  return (
    <span className={`px-3 py-1 font-dm-sans text-[10px] font-bold uppercase tracking-widest ${bgColor}`}>
      {formatStatus(status)}
    </span>
  );
}

export const metadata = {
  title: "Your Orders - Komi Heritage",
  description: "View your order history at Komi Heritage",
};

export default async function OrdersPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/orders");
  }

  const orders = await getUserOrders(user.id);

  return (
    <PageWrapper className="bg-background text-on-background font-body min-h-[100dvh] flex flex-col pb-24 md:pb-12 pt-24 md:pt-32">
      <main className="max-w-4xl mx-auto w-full px-6 flex-grow">
        
        <header className="mb-10 md:mb-12">
          <p className="font-dm-sans text-[10px] uppercase tracking-[0.2em] text-secondary mb-2 font-bold">Account</p>
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-on-surface">Order History</h1>
        </header>

        {orders.length === 0 ? (
          <div className="bg-surface border border-outline-variant/15 p-12 text-center shadow-sm flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-surface-container-highest rounded-full flex items-center justify-center mb-6">
              <Package size={32} className="text-on-surface-variant" />
            </div>
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">No Orders Yet</h2>
            <p className="font-dm-sans text-on-surface-variant mb-8 max-w-sm">
              You haven&apos;t placed any orders with us yet. Discover our heritage menu and place your first order.
            </p>
            <Link href="/menu">
              <PrimaryButton className="px-8 py-4 text-xs">
                Browse Menu <ArrowRight size={16} className="ml-2 inline" />
              </PrimaryButton>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <Link 
                href={`/orders/${order.id}`} 
                key={order.id}
                className="group bg-surface border border-outline-variant/15 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:border-primary/30 hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="space-y-4 flex-grow">
                  <div className="flex justify-between items-start md:items-center w-full">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-headline text-xl font-bold text-primary">#{order.order_number}</h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="font-dm-sans text-sm text-on-surface-variant">
                        Placed on {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="md:hidden">
                      <p className="font-dm-sans font-extrabold text-lg text-primary">{formatPrice(order.total)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 font-dm-sans text-xs font-bold uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">
                    <ShoppingBag size={14} />
                    <span>Track Order</span>
                    <ArrowRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                </div>
                
                <div className="hidden md:block text-right border-l border-outline-variant/15 pl-8 shrink-0">
                  <p className="font-dm-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">Total</p>
                  <p className="font-dm-sans font-extrabold text-2xl text-primary">{formatPrice(order.total)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </PageWrapper>
  );
}
