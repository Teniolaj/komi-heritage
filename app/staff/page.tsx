"use client";

import { motion } from "framer-motion";
import { Clock, AlertTriangle, Loader2, MapPin, Store, Settings, HelpCircle } from "lucide-react";
import { useState } from "react";

export default function StaffOrders() {
  const [activeTab, setActiveTab] = useState("New");
  const tabs = ["New (3)", "Preparing", "Ready", "Out for Delivery", "Done Today"];

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] lg:h-[calc(100vh-96px)] overflow-hidden">
      {/* Order Tabs Navigation */}
      <div className="px-6 lg:px-10 py-6 border-b border-white/5 shrink-0 overflow-x-auto hide-scrollbar">
        <div className="flex gap-1 bg-stone-950 p-1 w-max border border-white/5">
          {tabs.map((tab, idx) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab.split(' ')[0])}
              className={`px-4 lg:px-6 py-3 font-dm-sans font-bold text-[10px] lg:text-xs uppercase tracking-widest transition-colors ${
                (activeTab === tab.split(' ')[0] || (idx === 0 && activeTab === "New"))
                  ? "bg-[#111111] text-primary border border-white/5 shadow-sm"
                  : "text-stone-500 hover:text-white border border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Order Grid */}
      <section className="flex-1 overflow-y-auto px-6 lg:px-10 py-6 lg:pb-12 custom-dark-scroll min-h-0 bg-[#0a0a0a]">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 auto-rows-max">
          
          {/* Order Card #1 (New Delivery) */}
          <article className="bg-stone-900 border border-white/5 flex flex-col group hover:border-[#9d0518]/50 transition-all duration-300">
            <div className="p-6 border-b border-white/5 flex justify-between items-start bg-stone-950/50">
              <div>
                <span className="text-[9px] font-dm-sans font-bold text-[#feca5a] uppercase tracking-[0.2em] mb-2 block">ASAP Order</span>
                <h3 className="font-headline text-3xl font-bold text-white">#KH-0045</h3>
                <p className="font-dm-sans text-stone-400 font-bold text-sm lg:text-base mt-2 uppercase tracking-widest">Kwesi A.</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className="bg-[#9d0518] px-3 py-1.5 text-[9px] font-bold uppercase text-white tracking-[0.15em] shadow-sm">Delivery</span>
                <span className="text-[#9d0518] text-[10px] font-bold flex items-center gap-1.5 font-dm-sans bg-[#9d0518]/10 px-2 py-1">
                  <Clock size={12} />
                  5 min ago
                </span>
              </div>
            </div>
            
            <div className="p-6 space-y-4 flex-1 bg-stone-900/40">
              <div className="space-y-3">
                <p className="text-[9px] font-dm-sans font-bold text-stone-500 uppercase tracking-[0.2em]">Order Details</p>
                <div className="flex justify-between items-center bg-[#111111] p-4 border border-white/5 border-l-2 border-l-[#9d0518]">
                  <span className="text-xs lg:text-sm font-bold text-stone-200 font-dm-sans tracking-wide">Party Pack <span className="text-stone-500">x1</span></span>
                  <span className="text-stone-500 text-[10px] font-bold uppercase tracking-widest bg-stone-800 px-2 py-1">Custom</span>
                </div>
                <div className="flex justify-between items-center bg-[#111111] p-4 border border-white/5 border-l-2 border-l-transparent">
                  <span className="text-xs lg:text-sm font-bold text-stone-200 font-dm-sans tracking-wide">One Man Kenkey <span className="text-stone-500">x2</span></span>
                  <span className="text-stone-500 text-[10px] font-bold uppercase tracking-widest">Standard</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-stone-400 mt-6 pt-4 border-t border-white/5">
                <MapPin size={14} className="text-stone-500" />
                <p className="text-xs font-dm-sans font-bold text-stone-300">Osu Oxford St, Accra</p>
              </div>
            </div>
            
            <div className="p-6 pt-0 mt-auto flex gap-3 bg-stone-900/40">
              <button className="flex-1 bg-[#9d0518] text-white font-dm-sans font-bold uppercase tracking-[0.2em] text-[10px] py-4 hover:bg-red-800 transition-colors shadow-sm focus:ring-2 focus:ring-red-500/50 outline-none">
                Mark Preparing
              </button>
              <button className="px-6 border border-white/10 text-stone-300 font-dm-sans font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-stone-800 hover:text-white transition-colors focus:ring-2 focus:ring-stone-500 outline-none">
                View
              </button>
            </div>
          </article>

          {/* Order Card #2 (Pickup Delayed) */}
          <article className="bg-[#1a1515] border border-orange-900/30 flex flex-col group hover:border-orange-500/50 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1.5 bg-orange-600/20 text-orange-500 w-full flex justify-center border-b border-orange-900/30">
               <span className="text-[9px] font-bold uppercase tracking-[0.2em] flex items-center gap-1.5"><AlertTriangle size={12}/> Delays Expected</span>
            </div>
            <div className="p-6 pt-10 border-b border-white/5 flex justify-between items-start bg-stone-950/30">
              <div>
                <span className="text-[9px] font-dm-sans font-bold text-stone-500 uppercase tracking-[0.2em] mb-2 block">Scheduled 13:00</span>
                <h3 className="font-headline text-3xl font-bold text-white">#KH-0042</h3>
                <p className="font-dm-sans text-stone-400 font-bold text-sm lg:text-base mt-2 uppercase tracking-widest">Ama Serwaa</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className="bg-stone-700 px-3 py-1.5 text-[9px] font-bold uppercase text-white tracking-[0.15em] shadow-sm">Pickup</span>
                <span className="text-orange-500 text-[10px] font-bold flex items-center gap-1.5 font-dm-sans bg-orange-500/10 px-2 py-1">
                  <AlertTriangle size={12} />
                  22 min ago
                </span>
              </div>
            </div>
            
            <div className="p-6 space-y-4 flex-1 bg-stone-900/20">
              <div className="space-y-3">
                <p className="text-[9px] font-dm-sans font-bold text-stone-500 uppercase tracking-[0.2em]">Order Details</p>
                <div className="flex justify-between items-center bg-[#111111] p-4 border border-white/5 border-l-2 border-l-transparent">
                  <span className="text-xs lg:text-sm font-bold text-stone-200 font-dm-sans tracking-wide">Heritage Tilapia Platter <span className="text-stone-500">x1</span></span>
                  <span className="text-stone-500 text-[10px] font-bold uppercase tracking-widest">Standard</span>
                </div>
                <div className="flex justify-between items-center bg-[#111111] p-4 border border-orange-900/30 border-l-2 border-l-orange-500">
                  <span className="text-xs lg:text-sm font-bold text-stone-200 font-dm-sans tracking-wide">Yam Fries (Large) <span className="text-stone-500">x2</span></span>
                  <span className="text-orange-400 text-[10px] font-bold uppercase tracking-widest bg-orange-900/30 px-2 py-1">Extra Sauce</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-stone-400 mt-6 pt-4 border-t border-white/5">
                <Store size={14} className="text-stone-500" />
                <p className="text-xs font-dm-sans font-bold text-stone-300">Pickup - Tantra Hills Station</p>
              </div>
            </div>
            
            <div className="p-6 pt-0 mt-auto flex gap-3 bg-stone-900/20">
              <button className="flex-1 bg-[#9d0518] text-white font-dm-sans font-bold uppercase tracking-[0.2em] text-[10px] py-4 hover:bg-red-800 transition-colors shadow-sm focus:ring-2 focus:ring-red-500/50 outline-none">
                Mark Preparing
              </button>
              <button className="px-6 border border-white/10 text-stone-300 font-dm-sans font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-stone-800 hover:text-white transition-colors focus:ring-2 focus:ring-stone-500 outline-none">
                View
              </button>
            </div>
          </article>

          {/* Order Card #3 (Preparing State Example) */}
          <article className="bg-[#111111] border border-[#9d0518]/30 flex flex-col group relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 right-0 p-1.5 bg-[#9d0518] text-white">
              <Loader2 size={12} className="animate-spin" />
            </div>
            <div className="p-6 border-b border-[#9d0518]/20 flex justify-between items-start bg-stone-950/80">
              <div>
                <span className="text-[9px] font-dm-sans font-bold text-stone-400 uppercase tracking-[0.2em] mb-2 block">In Progress</span>
                <h3 className="font-headline text-3xl font-bold text-white">#KH-0044</h3>
                <p className="font-dm-sans text-stone-400 font-bold text-sm lg:text-base mt-2 uppercase tracking-widest">Ekow Mensah</p>
              </div>
              <div className="flex flex-col items-end gap-3 mt-4">
                <span className="bg-[#9d0518] px-3 py-1.5 text-[9px] font-bold uppercase text-white tracking-[0.15em] shadow-sm">Delivery</span>
                <span className="text-stone-400 text-[10px] font-bold font-dm-sans">12 min ago</span>
              </div>
            </div>
            
            <div className="p-6 space-y-4 flex-1 bg-stone-950/30">
              <div className="space-y-3">
                <p className="text-[9px] font-dm-sans font-bold text-stone-500 uppercase tracking-[0.2em]">Order Details</p>
                <div className="flex justify-between items-center bg-[#111111] p-4 border border-white/5 border-l-2 border-l-stone-600">
                  <span className="text-xs lg:text-sm font-bold text-stone-200 font-dm-sans tracking-wide">Red Red (Special) <span className="text-stone-500">x3</span></span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-stone-400 mt-6 pt-4 border-t border-white/5">
                <MapPin size={14} className="text-stone-500" />
                <p className="text-xs font-dm-sans font-bold text-stone-300">East Legon, Block C</p>
              </div>
            </div>
            
            <div className="p-6 pt-0 mt-auto flex gap-3 bg-stone-950/30">
              <button className="flex-1 bg-[#241a1a] border border-[#9d0518]/30 text-[#9d0518] font-dm-sans font-bold uppercase tracking-[0.2em] text-[10px] py-4 hover:bg-[#9d0518] hover:text-white transition-colors outline-none focus:ring-2 focus:ring-[#9d0518]/50">
                Mark Ready
              </button>
              <button className="px-6 border border-white/10 text-stone-300 font-dm-sans font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-stone-800 hover:text-white transition-colors focus:ring-2 focus:ring-stone-500 outline-none">
                View
              </button>
            </div>
          </article>

        </div>
      </section>

      {/* Kitchen Status Bar */}
      <footer className="h-16 px-6 lg:px-10 border-t border-white/10 flex items-center justify-between bg-stone-950 shrink-0 select-none">
        <div className="flex items-center gap-4 lg:gap-8">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest font-dm-sans">Avg Prep Time:</span>
            <span className="text-[10px] lg:text-xs font-bold text-white font-dm-sans">18m 45s</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest font-dm-sans">Kitchen Load:</span>
            <span className="text-[10px] lg:text-xs font-bold text-[#feca5a] font-dm-sans">MODERATE</span>
          </div>
        </div>
        <div className="flex gap-6">
          <button className="flex items-center gap-2 text-[9px] font-bold text-stone-400 hover:text-white transition-colors font-dm-sans tracking-widest uppercase hidden sm:flex">
            <Settings size={14} />
            Station Settings
          </button>
          <button className="flex items-center gap-2 text-[9px] font-bold text-stone-400 hover:text-white transition-colors font-dm-sans tracking-widest uppercase">
            <HelpCircle size={14} />
            Support
          </button>
        </div>
      </footer>
    </div>
  );
}
