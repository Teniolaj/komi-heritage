"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { CustomerWithStats } from "@/lib/queries/admin";
import { usePolling } from "@/lib/hooks/use-polling";

const AVATAR_COLORS = [
  "bg-primary",
  "bg-stone-800",
  "bg-primary-container",
  "bg-stone-700",
  "bg-[#3d405b]",
  "bg-[#e07a5f]",
  "bg-[#81b29a]",
  "bg-[#f2cc8f]",
];

function getInitials(name: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function avatarColor(index: number) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

function formatCurrency(amount: number) {
  return `GH₵${amount.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function timeAgo(dateStr: string | null) {
  if (!dateStr) return "Never";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} MIN AGO`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} HR AGO`;
  const days = Math.floor(hrs / 24);
  return `${days}D AGO`;
}

const PAGE_SIZE = 10;

export default function AdminCustomersClient({
  customers: initialCustomers,
}: {
  customers: CustomerWithStats[];
}) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithStats | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [page, setPage] = useState(1);

  usePolling<{ customers: CustomerWithStats[] }>(
    "/api/admin/customers",
    useCallback((data) => {
      setCustomers(data.customers);
    }, []),
    15_000,
  );

  const totalPages = Math.max(1, Math.ceil(customers.length / PAGE_SIZE));
  const paginatedCustomers = useMemo(
    () => customers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [customers, page],
  );

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const avgOrders =
    customers.length > 0
      ? (customers.reduce((sum, c) => sum + c.order_count, 0) / customers.length).toFixed(1)
      : "0";
  const repeatRate =
    customers.length > 0
      ? Math.round((customers.filter((c) => c.order_count > 1).length / customers.length) * 100)
      : 0;

  const selectCustomer = (c: CustomerWithStats, idx: number) => {
    setSelectedCustomer(c);
    setSelectedIndex(idx);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-surface space-y-8 md:space-y-12 relative">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 border-0">
        <div className="p-6 md:p-8 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-sm hover:shadow-md hover:bg-surface-container-low transition-all cursor-pointer">
          <p className="text-[10px] md:text-xs font-dm-sans font-bold uppercase tracking-widest text-on-surface-variant mb-2">Total Customers</p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl md:text-4xl font-headline font-black">{customers.length.toLocaleString()}</span>
            <span className="text-secondary font-dm-sans font-bold text-[10px] md:text-sm tracking-widest">registered</span>
          </div>
        </div>
        <div className="p-6 md:p-8 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-sm hover:shadow-md hover:bg-surface-container-low transition-all cursor-pointer">
          <p className="text-[10px] md:text-xs font-dm-sans font-bold uppercase tracking-widest text-on-surface-variant mb-2">Repeat Customers</p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl md:text-4xl font-headline font-black">{repeatRate}%</span>
            <span className="text-stone-400 font-dm-sans text-[10px] md:text-xs font-bold uppercase tracking-widest">ordered 2+ times</span>
          </div>
        </div>
        <div className="p-6 md:p-8 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-sm hover:shadow-md hover:bg-surface-container-low transition-all cursor-pointer">
          <p className="text-[10px] md:text-xs font-dm-sans font-bold uppercase tracking-widest text-on-surface-variant mb-2">Avg. Orders</p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl md:text-4xl font-headline font-black">{avgOrders}</span>
            <span className="text-stone-400 font-dm-sans text-[10px] md:text-xs font-bold uppercase tracking-widest">PER USER</span>
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-end border-b-2 border-on-surface pb-4 gap-2">
          <h3 className="text-2xl font-headline font-black tracking-tight">Registered Users</h3>
          <p className="text-[9px] md:text-[10px] font-dm-sans font-bold uppercase tracking-widest text-on-surface-variant">
            Showing {paginatedCustomers.length} of {customers.length} customers
          </p>
        </div>
        
        {customers.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-outline-variant/30 rounded-2xl">
            <p className="font-dm-sans text-sm text-on-surface-variant font-bold uppercase tracking-widest">No customers yet</p>
            <p className="font-dm-sans text-xs text-on-surface-variant/60 mt-2">Customers will appear here once they sign up.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-surface-container-lowest font-dm-sans text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/30">
                  <th className="px-4 md:px-6 py-4">Customer</th>
                  <th className="px-4 md:px-6 py-4">Contact</th>
                  <th className="px-4 md:px-6 py-4">Orders</th>
                  <th className="px-4 md:px-6 py-4">Total Spent</th>
                  <th className="px-4 md:px-6 py-4">Joined</th>
                  <th className="px-4 md:px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {paginatedCustomers.map((customer, i) => {
                  const globalIdx = (page - 1) * PAGE_SIZE + i;
                  return (
                    <tr
                      key={customer.id}
                      className="bg-surface-container-lowest hover:bg-surface-container-low transition-colors cursor-pointer group"
                      onClick={() => selectCustomer(customer, globalIdx)}
                    >
                      <td className="px-4 md:px-6 py-5 md:py-6 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-left"></div>
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className={`w-10 h-10 md:w-12 md:h-12 ${avatarColor(globalIdx)} text-white flex items-center justify-center font-bold font-headline text-sm md:text-lg shrink-0 rounded-full`}>
                            {getInitials(customer.full_name)}
                          </div>
                          <div>
                            <p className="font-bold text-on-surface font-dm-sans text-sm">{customer.full_name ?? "Unknown"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-5 md:py-6">
                        <p className="text-xs md:text-sm font-dm-sans font-medium text-on-surface">{customer.email}</p>
                        <p className="text-[10px] md:text-xs text-on-surface-variant font-dm-sans font-medium mt-0.5">{customer.phone ?? "—"}</p>
                      </td>
                      <td className="px-4 md:px-6 py-5 md:py-6">
                        <p className="text-sm font-dm-sans font-bold">{customer.order_count}</p>
                      </td>
                      <td className="px-4 md:px-6 py-5 md:py-6">
                        <p className="text-sm font-dm-sans font-bold">{formatCurrency(customer.total_spent)}</p>
                      </td>
                      <td className="px-4 md:px-6 py-5 md:py-6 text-xs md:text-sm font-dm-sans text-on-surface-variant">
                        {formatDate(customer.created_at)}
                      </td>
                      <td className="px-4 md:px-6 py-5 md:py-6 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); selectCustomer(customer, globalIdx); }}
                          className="bg-on-surface text-surface font-dm-sans text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-3 md:px-4 py-2 hover:bg-primary transition-colors shrink-0 whitespace-nowrap rounded-xl cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 md:pt-8 border-t border-outline-variant/20">
            <p className="text-[9px] md:text-[10px] font-dm-sans font-bold uppercase tracking-widest text-on-surface-variant">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 md:w-10 md:h-10 border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface rounded-lg cursor-pointer disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const start = Math.min(Math.max(1, page - 2), Math.max(1, totalPages - 4));
                return start + i;
              }).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-bold font-dm-sans text-xs md:text-sm rounded-lg cursor-pointer ${
                    p === page ? "bg-primary text-white" : "border border-outline-variant hover:bg-surface-container-high transition-colors"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 md:w-10 md:h-10 border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface rounded-lg cursor-pointer disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Slide-over Panel */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${selectedCustomer ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div
          className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSelectedCustomer(null)}
          aria-hidden="true"
        ></div>

        <div className={`absolute right-0 top-0 h-full w-full md:w-[480px] bg-surface pointer-events-auto shadow-2xl flex flex-col border-l border-outline-variant/30 transform transition-transform duration-300 ease-in-out ${selectedCustomer ? "translate-x-0" : "translate-x-full"}`}>
          {/* Panel Header */}
          <div className="p-6 md:p-8 bg-stone-900 text-white flex justify-between items-start shrink-0">
            <div className="flex items-center gap-4 md:gap-6">
              <div className={`w-16 h-16 md:w-20 md:h-20 ${selectedIndex >= 0 ? avatarColor(selectedIndex) : "bg-primary"} text-white flex items-center justify-center font-bold font-headline text-2xl md:text-3xl shrink-0 rounded-full`}>
                {getInitials(selectedCustomer?.full_name ?? null)}
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-headline font-black">{selectedCustomer?.full_name ?? "Unknown"}</h3>
                <p className="text-[9px] md:text-[10px] font-dm-sans font-bold uppercase tracking-widest text-[#feca5a] mt-1">
                  {selectedCustomer && selectedCustomer.order_count > 5 ? "Heritage Member" : "Customer"} since {selectedCustomer ? new Date(selectedCustomer.created_at).getFullYear() : ""}
                </p>
              </div>
            </div>
            <button onClick={() => setSelectedCustomer(null)} className="text-white/60 hover:text-white transition-colors p-2 -mr-2 -mt-2 cursor-pointer">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 md:space-y-12">
            {/* Mini Stats Tiles */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 border-0 bg-transparent">
              <div className="p-4 border border-outline-variant/30 flex flex-col rounded-2xl bg-surface-container-lowest shadow-sm">
                <p className="text-[9px] md:text-[10px] font-dm-sans font-bold uppercase tracking-widest text-on-surface-variant mb-2">Total Orders</p>
                <p className="text-2xl font-headline font-black mt-auto">{selectedCustomer?.order_count ?? 0}</p>
              </div>
              <div className="p-4 border border-outline-variant/30 flex flex-col rounded-2xl bg-surface-container-lowest shadow-sm">
                <p className="text-[9px] md:text-[10px] font-dm-sans font-bold uppercase tracking-widest text-on-surface-variant mb-2">Last Activity</p>
                <p className="text-xs md:text-sm font-dm-sans font-bold mt-auto uppercase tracking-tighter text-secondary">
                  {timeAgo(selectedCustomer?.last_order_at ?? null)}
                </p>
              </div>
              <div className="p-5 border-2 border-primary/10 flex flex-col rounded-2xl bg-primary/[0.02] shadow-sm col-span-2">
                <p className="text-[9px] md:text-[10px] font-dm-sans font-bold uppercase tracking-widest text-primary mb-2">Lifetime Value</p>
                <p className="text-3xl md:text-4xl font-headline font-black text-on-surface">
                  {selectedCustomer ? formatCurrency(selectedCustomer.total_spent) : "—"}
                </p>
              </div>
            </div>

            {/* Account Details */}
            <section className="space-y-6">
              <h4 className="text-[9px] md:text-[10px] font-dm-sans font-bold uppercase tracking-[0.3em] text-secondary border-b border-secondary/20 pb-2">Account Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <p className="text-[9px] md:text-[10px] font-dm-sans font-bold uppercase tracking-widest text-on-surface-variant mb-1">Email Address</p>
                  <p className="text-xs md:text-sm font-dm-sans font-bold break-words">{selectedCustomer?.email ?? "—"}</p>
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] font-dm-sans font-bold uppercase tracking-widest text-on-surface-variant mb-1">Phone Number</p>
                  <p className="text-xs md:text-sm font-dm-sans font-bold">{selectedCustomer?.phone ?? "—"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-[9px] md:text-[10px] font-dm-sans font-bold uppercase tracking-widest text-on-surface-variant mb-1">Saved Address</p>
                  <p className="text-xs md:text-sm font-dm-sans font-bold leading-relaxed">{selectedCustomer?.saved_address ?? "No address saved"}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
