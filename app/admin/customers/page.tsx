"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const mockCustomers = [
  { id: "AO", name: "Ama Owusu", tier: "Heritage Member", email: "ama.owusu@email.com", phone: "+233 24 555 0101", location: "East Legon", joined: "Oct 12, 2023", bgColor: "bg-primary" },
  { id: "KA", name: "Kwame Asante", tier: "New Contributor", email: "k.asante@domain.gh", phone: "+233 50 123 4567", location: "Osu", joined: "Jan 05, 2024", bgColor: "bg-stone-800" },
  { id: "AF", name: "Abena Frimpong", tier: "Street Legend", email: "abena.f@gmail.com", phone: "+233 27 888 2211", location: "Tantra Hills", joined: "Nov 22, 2023", bgColor: "bg-primary-container text-white" },
  { id: "YD", name: "Yaw Darko", tier: "Standard Account", email: "darko.yaw@outlook.com", phone: "+233 24 999 0000", location: "Cantonments", joined: "Feb 14, 2024", bgColor: "bg-stone-700" }
];

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<typeof mockCustomers[0] | null>(null);

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-surface space-y-8 md:space-y-12 relative">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-outline-variant/30">
        <div className="p-6 md:p-8 bg-surface-container-lowest border-b md:border-b-0 md:border-r border-outline-variant/30 hover:bg-surface-container-low transition-colors">
          <p className="text-[10px] md:text-xs font-dm-sans font-bold uppercase tracking-widest text-on-surface-variant mb-2">Total Customers</p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl md:text-4xl font-headline font-black">1,892</span>
            <span className="text-secondary font-dm-sans font-bold text-[10px] md:text-sm tracking-widest">↑ 84 NEW</span>
          </div>
        </div>
        <div className="p-6 md:p-8 bg-surface-container-lowest border-b md:border-b-0 md:border-r border-outline-variant/30 hover:bg-surface-container-low transition-colors">
          <p className="text-[10px] md:text-xs font-dm-sans font-bold uppercase tracking-widest text-on-surface-variant mb-2">Repeat Customers</p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl md:text-4xl font-headline font-black">63%</span>
            <span className="text-stone-400 font-dm-sans text-[10px] md:text-xs font-bold uppercase tracking-widest">+2.4% FROM LAST MO.</span>
          </div>
        </div>
        <div className="p-6 md:p-8 bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
          <p className="text-[10px] md:text-xs font-dm-sans font-bold uppercase tracking-widest text-on-surface-variant mb-2">Avg. Orders</p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl md:text-4xl font-headline font-black">4.2</span>
            <span className="text-stone-400 font-dm-sans text-[10px] md:text-xs font-bold uppercase tracking-widest">PER USER</span>
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-end border-b-2 border-on-surface pb-4 gap-2">
          <h3 className="text-2xl font-headline font-black tracking-tight">Registered Users</h3>
          <p className="text-[9px] md:text-[10px] font-dm-sans font-bold uppercase tracking-widest text-on-surface-variant">Showing 4 of 1,892 customers</p>
        </div>
        
        <div className="w-full overflow-x-auto hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-surface-container-lowest font-dm-sans text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/30">
                <th className="px-4 md:px-6 py-4">Customer</th>
                <th className="px-4 md:px-6 py-4">Contact Information</th>
                <th className="px-4 md:px-6 py-4">Location</th>
                <th className="px-4 md:px-6 py-4">Joined</th>
                <th className="px-4 md:px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {mockCustomers.map((customer) => (
                <tr key={customer.id} className="bg-surface-container-lowest hover:bg-surface-container-low transition-colors cursor-pointer group" onClick={() => setSelectedCustomer(customer)}>
                  <td className="px-4 md:px-6 py-5 md:py-6 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-left"></div>
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={`w-10 h-10 md:w-12 md:h-12 ${customer.bgColor} text-white flex items-center justify-center font-bold font-headline text-sm md:text-lg shrink-0 rounded-sm`}>
                        {customer.id}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface font-dm-sans text-sm">{customer.name}</p>
                        <p className="text-[10px] text-secondary font-dm-sans font-bold uppercase tracking-widest mt-0.5 whitespace-nowrap">{customer.tier}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-5 md:py-6">
                    <p className="text-xs md:text-sm font-dm-sans font-medium text-on-surface">{customer.email}</p>
                    <p className="text-[10px] md:text-xs text-on-surface-variant font-dm-sans font-medium mt-0.5">{customer.phone}</p>
                  </td>
                  <td className="px-4 md:px-6 py-5 md:py-6">
                    <p className="text-xs md:text-sm font-dm-sans font-bold">{customer.location}</p>
                  </td>
                  <td className="px-4 md:px-6 py-5 md:py-6 text-xs md:text-sm font-dm-sans text-on-surface-variant">
                    {customer.joined}
                  </td>
                  <td className="px-4 md:px-6 py-5 md:py-6 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedCustomer(customer); }}
                      className="bg-on-surface text-surface font-dm-sans text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-3 md:px-4 py-2 hover:bg-primary transition-colors shrink-0 whitespace-nowrap"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 md:pt-8 border-t border-outline-variant/20">
          <p className="text-[9px] md:text-[10px] font-dm-sans font-bold uppercase tracking-widest text-on-surface-variant">Page 1 of 24</p>
          <div className="flex gap-2">
            <button className="w-8 h-8 md:w-10 md:h-10 border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 md:w-10 md:h-10 bg-primary text-white flex items-center justify-center font-bold font-dm-sans text-xs md:text-sm">1</button>
            <button className="w-8 h-8 md:w-10 md:h-10 border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors font-bold font-dm-sans text-xs md:text-sm">2</button>
            <button className="w-8 h-8 md:w-10 md:h-10 border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors font-bold font-dm-sans text-xs md:text-sm">3</button>
            <button className="w-8 h-8 md:w-10 md:h-10 border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-over Panel (Active/Preview State) */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${selectedCustomer ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity duration-300" 
          onClick={() => setSelectedCustomer(null)}
          aria-hidden="true"
        ></div>

        {/* Panel */}
        <div className={`absolute right-0 top-0 h-full w-full md:w-[480px] bg-surface pointer-events-auto shadow-2xl flex flex-col border-l border-outline-variant/30 transform transition-transform duration-300 ease-in-out ${selectedCustomer ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Panel Header */}
          <div className="p-6 md:p-8 bg-stone-900 text-white flex justify-between items-start shrink-0">
            <div className="flex items-center gap-4 md:gap-6">
              <div className={`w-16 h-16 md:w-20 md:h-20 ${selectedCustomer?.bgColor || 'bg-primary'} text-white flex items-center justify-center font-bold font-headline text-2xl md:text-3xl shrink-0 rounded-sm`}>
                {selectedCustomer?.id}
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-headline font-black">{selectedCustomer?.name}</h3>
                <p className="text-[9px] md:text-[10px] font-dm-sans font-bold uppercase tracking-widest text-[#feca5a] mt-1">{selectedCustomer?.tier} since 2023</p>
              </div>
            </div>
            <button onClick={() => setSelectedCustomer(null)} className="text-white/60 hover:text-white transition-colors p-2 -mr-2 -mt-2">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 md:space-y-12">
            {/* Mini Stats Tiles */}
            <div className="grid grid-cols-3 gap-0 border border-outline-variant/30 bg-surface-container-lowest">
              <div className="p-3 md:p-4 border-r border-outline-variant/30 flex flex-col">
                <p className="text-[9px] md:text-[10px] font-dm-sans font-bold uppercase tracking-widest text-on-surface-variant mb-1">Total Orders</p>
                <p className="text-xl md:text-2xl font-headline font-black mt-auto">28</p>
              </div>
              <div className="p-3 md:p-4 border-r border-outline-variant/30 flex flex-col">
                <p className="text-[9px] md:text-[10px] font-dm-sans font-bold uppercase tracking-widest text-on-surface-variant mb-1">Lifetime Value</p>
                <p className="text-xl md:text-2xl font-headline font-black mt-auto">GH₵4.2k</p>
              </div>
              <div className="p-3 md:p-4 flex flex-col">
                <p className="text-[9px] md:text-[10px] font-dm-sans font-bold uppercase tracking-widest text-on-surface-variant mb-1">Last Activity</p>
                <p className="text-xs md:text-sm font-dm-sans font-bold mt-auto uppercase tracking-tighter">2 HOURS AGO</p>
              </div>
            </div>

            {/* Account Details */}
            <section className="space-y-6">
              <h4 className="text-[9px] md:text-[10px] font-dm-sans font-bold uppercase tracking-[0.3em] text-secondary border-b border-secondary/20 pb-2">Account Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <p className="text-[9px] md:text-[10px] font-dm-sans font-bold uppercase tracking-widest text-on-surface-variant mb-1">Email Address</p>
                  <p className="text-xs md:text-sm font-dm-sans font-bold break-words">{selectedCustomer?.email}</p>
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] font-dm-sans font-bold uppercase tracking-widest text-on-surface-variant mb-1">Phone Number</p>
                  <p className="text-xs md:text-sm font-dm-sans font-bold">{selectedCustomer?.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-[9px] md:text-[10px] font-dm-sans font-bold uppercase tracking-widest text-on-surface-variant mb-1">Primary Address</p>
                  <p className="text-xs md:text-sm font-dm-sans font-bold leading-relaxed">House 42, Liberation Rd,<br/>{selectedCustomer?.location}, Accra</p>
                </div>
              </div>
            </section>

            {/* Order History */}
            <section className="space-y-6">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                <h4 className="text-[9px] md:text-[10px] font-dm-sans font-bold uppercase tracking-[0.3em] text-on-surface">Recent Order History</h4>
                <button className="text-[9px] md:text-[10px] font-dm-sans font-bold uppercase tracking-widest text-primary hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                {/* Order Item 1 */}
                <div className="p-4 bg-surface-container-lowest border border-outline-variant/20 border-l-4 border-l-primary flex justify-between items-start gap-4">
                  <div>
                    <p className="text-[10px] md:text-xs font-dm-sans font-bold uppercase tracking-widest">Order #KH-8821</p>
                    <p className="text-xs md:text-sm font-headline italic font-bold mt-1">Jollof Festival Platter + Drinks</p>
                    <p className="text-[9px] md:text-[10px] font-dm-sans font-bold uppercase tracking-wider text-on-surface-variant mt-2 border-t border-outline-variant/10 pt-2">Mar 02, 2024 • GH₵185.00</p>
                  </div>
                  <span className="px-2 py-1 bg-[#feca5a]/20 text-[#7a5900] text-[8px] font-dm-sans font-bold uppercase tracking-widest shrink-0">Delivered</span>
                </div>
                {/* Order Item 2 */}
                <div className="p-4 bg-surface-container-lowest border border-outline-variant/20 border-l-4 border-l-primary flex justify-between items-start gap-4">
                  <div>
                    <p className="text-[10px] md:text-xs font-dm-sans font-bold uppercase tracking-widest">Order #KH-8794</p>
                    <p className="text-xs md:text-sm font-headline italic font-bold mt-1">Waakye Special (Archival Recipe)</p>
                    <p className="text-[9px] md:text-[10px] font-dm-sans font-bold uppercase tracking-wider text-on-surface-variant mt-2 border-t border-outline-variant/10 pt-2">Feb 24, 2024 • GH₵120.00</p>
                  </div>
                  <span className="px-2 py-1 bg-[#feca5a]/20 text-[#7a5900] text-[8px] font-dm-sans font-bold uppercase tracking-widest shrink-0">Delivered</span>
                </div>
              </div>
            </section>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-0 border-t border-outline-variant/30 mt-auto bg-surface-container-lowest shrink-0">
            <button className="bg-primary hover:bg-primary-container text-white py-4 md:py-5 font-dm-sans font-bold uppercase text-[9px] md:text-xs tracking-widest transition-colors flex items-center justify-center gap-2">
              Edit Profile
            </button>
            <button className="bg-surface-container hover:bg-surface-container-high text-on-surface-variant py-4 md:py-5 font-dm-sans font-bold uppercase text-[9px] md:text-xs tracking-widest transition-colors flex items-center justify-center gap-2">
              Manage Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
