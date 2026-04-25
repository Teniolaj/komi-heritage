"use client";

import { Clock, AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";

const mockOrders = [
  {
    id: "#KH-0045",
    customer: "Kwesi A.",
    items: "Party Pack x1, One Man Kenkey x2",
    type: "Delivery",
    time: "5 min ago",
    status: "new",
    timeStatus: "normal"
  },
  {
    id: "#KH-0042",
    customer: "Ama Serwaa",
    items: "Heritage Tilapia Platter x1, Yam Fries x2",
    type: "Pickup",
    time: "22 min ago",
    status: "new",
    timeStatus: "warning"
  },
  {
    id: "#KH-0044",
    customer: "Ekow Mensah",
    items: "Red Red (Special) x3",
    type: "Delivery",
    time: "12 min ago",
    status: "preparing",
    timeStatus: "normal"
  },
  {
    id: "#KH-0046",
    customer: "Yaa Boateng",
    items: "Kelewele Box x4",
    type: "Pickup",
    time: "1 min ago",
    status: "new",
    timeStatus: "normal"
  }
];

export default function OrdersPage() {
  const [filter, setFilter] = useState("new");

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest">
      {/* Page Header specifically for Orders */}
      <div className="px-6 md:px-8 py-6 flex items-center justify-between border-b border-outline-variant/20">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface uppercase">Live Orders</h2>
            <div className="flex items-center gap-2 px-2 py-1 bg-green-500/10 rounded-full border border-green-500/20">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="font-dm-sans text-[10px] font-bold uppercase tracking-tighter text-green-700">Live</span>
            </div>
          </div>
          <p className="font-dm-sans text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mt-2">Station 01</p>
        </div>
      </div>

      {/* Order Filter Navigation */}
      <div className="px-6 md:px-8 py-6 border-b border-outline-variant/20 bg-surface">
        <div className="flex gap-1 bg-surface-container-low md:p-1 w-full overflow-x-auto hide-scrollbar md:w-fit border border-outline-variant/10 rounded-sm">
          <button 
            onClick={() => setFilter("new")}
            className={`px-4 md:px-6 py-3 font-dm-sans font-bold text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${filter === 'new' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}
          >
            New (3)
          </button>
          <button 
            onClick={() => setFilter("preparing")}
            className={`px-4 md:px-6 py-3 font-dm-sans font-bold text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${filter === 'preparing' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}
          >
            Preparing
          </button>
          <button 
            onClick={() => setFilter("ready")}
            className={`px-4 md:px-6 py-3 font-dm-sans font-bold text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${filter === 'ready' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}
          >
            Ready
          </button>
          <button 
            onClick={() => setFilter("delivering")}
            className={`px-4 md:px-6 py-3 font-dm-sans font-bold text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${filter === 'delivering' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}
          >
            Out for Delivery
          </button>
          <button 
            onClick={() => setFilter("done")}
            className={`px-4 md:px-6 py-3 font-dm-sans font-bold text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${filter === 'done' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}
          >
            Done Today
          </button>
        </div>
      </div>

      {/* High-Density List View */}
      <section className="flex-1 overflow-x-auto px-6 md:px-8 py-2 min-h-[400px]">
        <table className="w-full text-left border-collapse min-w-[750px] mt-4">
          <thead className="sticky top-0 bg-surface-container-lowest z-20">
            <tr className="border-b border-outline-variant/30">
              <th className="py-4 font-dm-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/30">Order ID</th>
              <th className="py-4 font-dm-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/30">Customer & Items</th>
              <th className="py-4 font-dm-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/30">Type</th>
              <th className="py-4 font-dm-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/30">Time</th>
              <th className="py-4 font-dm-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right border-b border-outline-variant/30">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {mockOrders.map((order, i) => (
              <tr key={order.id} className={`group hover:bg-surface-container-low transition-colors ${order.status === 'preparing' ? 'opacity-80' : ''}`}>
                <td className="py-5">
                  <div className="flex items-center gap-3">
                    {order.status === 'new' ? (
                      <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-sm"></span>
                    ) : (
                      <Loader2 size={14} className="text-stone-400 animate-spin" />
                    )}
                    <span className="font-headline text-lg font-bold text-on-surface">{order.id}</span>
                  </div>
                </td>
                <td className="py-5 pr-4">
                  <div className="flex flex-col">
                    <span className="font-dm-sans font-bold text-sm text-on-surface">{order.customer}</span>
                    <span className="font-dm-sans text-[10px] text-on-surface-variant uppercase mt-1 tracking-wider">{order.items}</span>
                  </div>
                </td>
                <td className="py-5">
                  <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest ${order.type === 'Delivery' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-surface-container-high text-on-surface-variant border border-outline-variant/30'}`}>
                    {order.type}
                  </span>
                </td>
                <td className="py-5">
                  <div className={`flex items-center gap-1.5 ${order.timeStatus === 'warning' ? 'text-secondary' : order.status === 'preparing' ? 'text-stone-400' : 'text-primary'}`}>
                    {order.timeStatus === 'warning' ? <AlertTriangle size={14} /> : <Clock size={14} />}
                    <span className="font-dm-sans text-[10px] font-bold tracking-widest uppercase">{order.time}</span>
                  </div>
                </td>
                <td className="py-5">
                  <div className="flex justify-end gap-2 md:gap-3">
                    <button className="px-3 md:px-4 py-2 border border-outline-variant/30 text-on-surface-variant font-bold uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-surface-container font-dm-sans transition-colors">
                      Details
                    </button>
                    {order.status === 'new' ? (
                      <button className="px-4 md:px-6 py-2 bg-primary text-white font-bold uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-primary-container font-dm-sans transition-colors shrink-0 shadow-sm">
                        Mark Prep
                      </button>
                    ) : (
                      <button className="px-4 md:px-6 py-2 bg-surface-container-high text-on-surface-variant font-bold uppercase tracking-widest text-[9px] md:text-[10px] opacity-70 font-dm-sans cursor-not-allowed shrink-0">
                        Mark Ready
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Kitchen Status Bar */}
      <footer className="h-16 px-6 md:px-8 border-t border-outline-variant/20 flex flex-col md:flex-row items-center justify-between bg-surface-container mt-auto sm:flex shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="font-dm-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Avg Prep Time:</span>
            <span className="font-dm-sans text-xs font-bold text-on-surface">18m 45s</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-dm-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Kitchen Load:</span>
            <span className="font-dm-sans text-xs font-bold text-secondary">MODERATE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
