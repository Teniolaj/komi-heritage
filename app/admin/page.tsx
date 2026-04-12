"use client";

import { motion } from "framer-motion";
import { ShoppingCart, CircleDollarSign, Users, TrendingUp } from "lucide-react";

export default function AdminOverview() {
  return (
    <div className="p-6 md:p-8 space-y-8 md:space-y-12 max-w-[1600px] mx-auto">
      {/* Overview Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-outline-variant/15 md:border-l-0 md:bg-surface-container-lowest shadow-sm">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest p-6 md:p-8 border-b md:border-b-0 border-r-0 md:border-r md:border-l border-outline-variant/15 hover:bg-surface-container-low transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <span className="font-dm-sans text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Total Orders Today</span>
            <ShoppingCart className="text-primary group-hover:scale-110 transition-transform" size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-4xl lg:text-5xl font-black">142</span>
            <span className="text-emerald-700 text-xs font-bold mt-2 flex items-center gap-1 font-dm-sans">
              <TrendingUp size={14} /> +12% from yesterday
            </span>
          </div>
        </div>
        
        {/* Card 2 */}
        <div className="bg-surface-container-lowest p-6 md:p-8 border-b md:border-b-0 border-r-0 md:border-r border-outline-variant/15 hover:bg-surface-container-low transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <span className="font-dm-sans text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Revenue Today</span>
            <CircleDollarSign className="text-secondary group-hover:scale-110 transition-transform" size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-4xl lg:text-5xl font-black">₵ 12,450</span>
            <span className="text-on-surface-variant text-xs font-bold mt-2 font-dm-sans">Target: ₵ 15,000</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest p-6 md:p-8 border-b md:border-b-0 border-r-0 md:border-r border-outline-variant/15 hover:bg-surface-container-low transition-colors group relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="font-dm-sans text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Active Orders</span>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(157,5,24,0.6)]"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-4xl lg:text-5xl font-black">28</span>
            <span className="text-on-surface-variant text-[10px] md:text-xs font-bold mt-2 font-dm-sans uppercase tracking-widest">12 in kitchen • 16 out for delivery</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container-lowest p-6 md:p-8 hover:bg-surface-container-low transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <span className="font-dm-sans text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Total Customers</span>
            <Users className="text-on-surface-variant group-hover:scale-110 transition-transform" size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-4xl lg:text-5xl font-black">1,892</span>
            <span className="text-on-surface-variant text-xs font-bold mt-2 flex items-center gap-1 font-dm-sans">
              84 new today
            </span>
          </div>
        </div>
      </section>

      {/* Charts Row */}
      <section className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* Bar Chart: Orders by Hour (60%) */}
        <div className="lg:col-span-6 bg-surface-container-low p-6 md:p-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <p className="font-dm-sans text-[9px] text-secondary font-bold uppercase tracking-[0.2em] mb-1">Performance Analytics</p>
              <h3 className="font-headline text-2xl font-bold">Orders by Hour</h3>
            </div>
            <select className="bg-transparent border-0 border-b-[1.5px] border-outline-variant font-dm-sans text-[10px] md:text-xs uppercase font-bold focus:ring-0 outline-none pb-1 pb-1">
              <option>Today</option>
              <option>Yesterday</option>
            </select>
          </div>
          
          <div className="flex items-end justify-between h-48 md:h-64 gap-1 md:gap-2 mx-auto pt-8">
            {[30, 45, 85, 60, 40, 95, 75, 35].map((height, i) => (
              <div key={i} className={`w-full bg-primary/10 group relative transition-all duration-500 ease-out h-full`}>
                <div style={{ height: `${height}%` }} className="absolute bottom-0 w-full bg-primary transition-all duration-700 ease-out origin-bottom"></div>
                {i === 0 && <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-dm-sans text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">8am</span>}
                {i === 2 && <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-dm-sans text-[9px] font-bold text-on-surface">12pm</span>}
                {i === 5 && <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-dm-sans text-[9px] font-bold text-on-surface">6pm</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Donut Chart: Top Items (40%) */}
        <div className="lg:col-span-4 bg-surface-container-lowest p-6 md:p-8 border border-outline-variant/15">
          <div className="mb-8">
            <p className="font-dm-sans text-[9px] text-secondary font-bold uppercase tracking-[0.2em] mb-1">Menu Popularity</p>
            <h3 className="font-headline text-2xl font-bold">Top Items Today</h3>
          </div>
          
          <div className="flex flex-col items-center">
            {/* Custom Donut SVG */}
            <div className="relative w-40 h-40 md:w-48 md:h-48 mb-6 md:mb-8 hover:scale-105 transition-transform duration-500">
              <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 36 36">
                {/* Background */}
                <circle cx="18" cy="18" fill="transparent" r="16" stroke="#f0ede9" strokeWidth="4"></circle>
                {/* Primary (Heritage Jollof - 45%) */}
                <circle cx="18" cy="18" fill="transparent" r="16" stroke="#9d0518" strokeDasharray="45 100" strokeWidth="4" className="transition-all duration-1000 ease-out"></circle>
                {/* Secondary (Suya Platter - 25%) offset 45 */}
                <circle cx="18" cy="18" fill="transparent" r="16" stroke="#feca5a" strokeDasharray="25 100" strokeDashoffset="-45" strokeWidth="4" className="transition-all duration-1000 ease-out"></circle>
                {/* On-Surface (Kelewele Box - 30%) offset 70 */}
                <circle cx="18" cy="18" fill="transparent" r="16" stroke="#1c1c19" strokeDasharray="30 100" strokeDashoffset="-70" strokeWidth="4" className="transition-all duration-1000 ease-out"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline text-2xl font-bold">Total</span>
                <span className="font-dm-sans text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">Volume</span>
              </div>
            </div>

            <div className="w-full space-y-4">
              <div className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-primary group-hover:scale-125 transition-transform"></div>
                  <span className="font-dm-sans text-xs font-bold uppercase tracking-widest">Heritage Jollof</span>
                </div>
                <span className="font-dm-sans text-xs font-bold">45%</span>
              </div>
              <div className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-[#feca5a] group-hover:scale-125 transition-transform"></div>
                  <span className="font-dm-sans text-xs font-bold uppercase tracking-widest">Suya Platter</span>
                </div>
                <span className="font-dm-sans text-xs font-bold">25%</span>
              </div>
              <div className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-on-surface group-hover:scale-125 transition-transform"></div>
                  <span className="font-dm-sans text-xs font-bold uppercase tracking-widest">Kelewele Box</span>
                </div>
                <span className="font-dm-sans text-xs font-bold">30%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Orders Table */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 border-b border-outline-variant/20 pb-4">
          <div>
            <p className="font-dm-sans text-[9px] text-secondary font-bold uppercase tracking-[0.2em] mb-1">Live Transaction Log</p>
            <h3 className="font-headline text-2xl font-bold">Recent Orders</h3>
          </div>
          <button className="font-dm-sans text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors text-primary border-b border-primary pb-px self-start sm:self-auto uppercase">
            View All Orders
          </button>
        </div>
        
        <div className="overflow-x-auto hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-outline-variant/30">
                <th className="py-2 px-3 font-dm-sans text-[9px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Order #</th>
                <th className="py-2 px-3 font-dm-sans text-[9px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Customer</th>
                <th className="py-2 px-3 font-dm-sans text-[9px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Items</th>
                <th className="py-2 px-3 font-dm-sans text-[9px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Total</th>
                <th className="py-2 px-3 font-dm-sans text-[9px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Fulfillment</th>
                <th className="py-2 px-3 font-dm-sans text-[9px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Status</th>
                <th className="py-2 px-3 font-dm-sans text-[9px] font-bold uppercase tracking-[0.15em] text-on-surface-variant text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="py-4 px-3 font-dm-sans text-xs font-bold">#AR-9241</td>
                <td className="py-4 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-surface-container-high overflow-hidden shrink-0">
                      <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW_eNEZQjv0s5pEti9tN54rpG2rkIG2J3-zBPvmgpoFr9IlrOlNJk7lIogGXA3JPO92JNgCx9im6B96V3OegEmHsM1j4P3b1kmVmVD-G1pGEkQu_v-JjrVrxEC8uO8jM3-sifl7wIvCWdJm1wYRvBhCbLhzPHiak4NG-ZNzFOEwysy9AEnyTm0GypYxX5Z5QS7NltDgGgA8utgIKxvHbAPlXdhCcUXXHJefXKhkWvEGSCwopFoYPg55P2DNMb676IAIDjvmIoPyf4" alt="Ama Osei" />
                    </div>
                    <span className="font-dm-sans text-xs font-bold uppercase tracking-wider">Ama Osei</span>
                  </div>
                </td>
                <td className="py-4 px-3 font-dm-sans text-xs text-on-surface-variant">2x Jollof, 1x Sobolo</td>
                <td className="py-4 px-3 font-dm-sans text-xs font-bold">₵ 185.00</td>
                <td className="py-4 px-3 font-dm-sans text-[10px] uppercase tracking-widest font-bold">Delivery</td>
                <td className="py-4 px-3">
                  <span className="inline-block px-3 py-1 bg-green-50 text-green-700 border border-green-200 font-dm-sans text-[9px] font-bold uppercase tracking-widest">Active</span>
                </td>
                <td className="py-4 px-3 font-dm-sans text-[9px] font-bold text-on-surface-variant text-right uppercase tracking-[0.1em]">2 mins ago</td>
              </tr>

              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="py-4 px-3 font-dm-sans text-xs font-bold">#AR-9240</td>
                <td className="py-4 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-surface-container-high overflow-hidden shrink-0">
                      <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmB76r5Crd43GrQPpE2ifArwK8XQp2YFwkuouxQSiJJmnSVEBopk3G5-0UKyyRgEqtyA1z922zo3ZCzqf9gvCzS2ZZRGJRo1Y9rVxM5rJgQr4I9A2Dd1CaBfBIP5ULiETxPEDnhU82LukGQLu6pKy1S06ibkQLEoTnZY-MZKHjTrXndXqnOZ2ObxAJcVcNuogx0FMNa5UruwsHROA_TxGqk1LeakfIL1LZxTqMN9doH3cwtonjmD3TWBLzHnsK5qLUF7IV_FGVXBo" alt="Kofi Mensah" />
                    </div>
                    <span className="font-dm-sans text-xs font-bold uppercase tracking-wider">Kofi Mensah</span>
                  </div>
                </td>
                <td className="py-4 px-3 font-dm-sans text-xs text-on-surface-variant">1x Banku, 1x Tilapia</td>
                <td className="py-4 px-3 font-dm-sans text-xs font-bold">₵ 240.00</td>
                <td className="py-4 px-3 font-dm-sans text-[10px] uppercase tracking-widest font-bold">Pickup</td>
                <td className="py-4 px-3">
                  <span className="inline-block px-3 py-1 bg-primary text-white font-dm-sans text-[9px] font-bold uppercase tracking-widest shadow-sm">In Kitchen</span>
                </td>
                <td className="py-4 px-3 font-dm-sans text-[9px] font-bold text-on-surface-variant text-right uppercase tracking-[0.1em]">12 mins ago</td>
              </tr>

              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="py-4 px-3 font-dm-sans text-xs font-bold">#AR-9239</td>
                <td className="py-4 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-surface-container-high overflow-hidden shrink-0">
                      <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUGXNWSberju79Sid6OCgVhh5nbKo6OpkiaGac3opx-_P-Bll_WSOPVEm5ieQVvqWhZ_hg169ad8K4yNXNQ6L3mYnHsSSikY-9fDkSN0ovkElIdtsrYwr0M6p3r0SUA9IiN5-QynVtngQae9cc5NEEXnyiVF5OFCVJtKDmGmwSQ2aiWi8msiAr5uNtNt1Eo5Rfj4lnNKPwJ_ZIGNqiNB_dO_yXDz6rw2zP8n1cHC_nkvg-F-0DKM8KrOx1mMZJ6Hb6gs45MQTAsbA" alt="Esi Amankwah" />
                    </div>
                    <span className="font-dm-sans text-xs font-bold uppercase tracking-wider">Esi Amankwah</span>
                  </div>
                </td>
                <td className="py-4 px-3 font-dm-sans text-xs text-on-surface-variant">4x Suya Sticks, Kelewele</td>
                <td className="py-4 px-3 font-dm-sans text-xs font-bold">₵ 310.00</td>
                <td className="py-4 px-3 font-dm-sans text-[10px] uppercase tracking-widest font-bold">Delivery</td>
                <td className="py-4 px-3">
                  <span className="inline-block px-3 py-1 bg-stone-200 text-stone-700 font-dm-sans text-[9px] font-bold uppercase tracking-widest border border-stone-300">Completed</span>
                </td>
                <td className="py-4 px-3 font-dm-sans text-[9px] font-bold text-on-surface-variant text-right uppercase tracking-[0.1em]">25 mins ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
