import { ReactNode } from "react";
import Link from "next/link";
import { Receipt, UtensilsCrossed, LogOut, Bell, CircleCheck } from "lucide-react";

export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#111111] text-stone-100 flex min-h-screen font-body overflow-hidden">
      {/* SideNavBar (Desktop & Tablet) */}
      <aside className="bg-stone-950 h-screen w-64 hidden xl:flex flex-col fixed z-50 p-6 border-r border-white/5 transition-all duration-200 ease-in-out">
        {/* Logo Area */}
        <div className="mb-12 mt-2">
          <h1 className="text-red-500 font-headline italic text-2xl tracking-tighter leading-tight font-bold">
            KOMI<br/>HERITAGE
          </h1>
          <div className="mt-8">
            <p className="font-dm-sans font-bold uppercase tracking-widest text-[10px] text-stone-400">Kitchen Station 01</p>
            <p className="text-[10px] text-stone-500 mt-1 flex items-center gap-1 font-bold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Staff Active
            </p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link href="/staff" className="flex items-center gap-4 px-4 py-4 text-red-500 border-l-4 border-red-500 bg-stone-900 transition-all duration-200 ease-in-out group w-[calc(100%+24px)] -ml-6 pl-10">
            <Receipt size={18} />
            <span className="font-dm-sans uppercase tracking-widest text-xs font-bold">Orders</span>
          </Link>
          <Link href="/staff/menu" className="flex items-center gap-4 px-4 py-4 text-stone-500 hover:text-stone-300 hover:bg-stone-900/50 transition-all duration-200 ease-in-out group">
            <UtensilsCrossed size={18} />
            <span className="font-dm-sans uppercase tracking-widest text-xs font-bold">Menu Availability</span>
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <button className="flex items-center gap-4 px-4 py-3 w-full text-stone-500 hover:text-red-500 transition-colors pr-0 pl-0">
            <LogOut size={18} />
            <span className="font-dm-sans uppercase tracking-widest text-xs font-bold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 xl:ml-64 bg-[#111111] min-h-screen flex flex-col h-screen overflow-hidden">
        {/* Top Header Area */}
        <header className="h-20 lg:h-24 px-6 lg:px-10 flex py-4 lg:py-0 items-center justify-between border-b border-white/5 bg-[#111111]/80 backdrop-blur-md sticky top-0 z-30 shrink-0">
          <div className="flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-8">
            <div className="flex items-center gap-3">
              <h2 className="font-headline text-2xl lg:text-3xl font-bold tracking-tight text-white uppercase">Live Orders</h2>
              <div className="flex items-center gap-2 px-2 py-1 bg-green-500/10 rounded-sm border border-green-500/20">
                <span className="w-1.5 h-1.5 bg-green-500 animate-pulse rounded-full shadow-[0_0_8px_rgba(22,163,74,0.8)]"></span>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-green-500 font-dm-sans">Live</span>
              </div>
            </div>
            <p className="text-[9px] lg:text-[10px] font-dm-sans font-bold uppercase tracking-[0.2em] text-stone-500 mt-0 lg:mt-1 hidden sm:block">Oct 24, 2023 • 12:45 PM • STATION 01</p>
          </div>
          
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[9px] font-dm-sans font-bold uppercase tracking-widest text-stone-500">Service Status</p>
              <p className="text-xs font-bold text-green-500 uppercase font-dm-sans tracking-widest mt-0.5">Optimal Flow</p>
            </div>
            <button className="w-10 h-10 bg-stone-900 border border-white/5 flex items-center justify-center hover:bg-stone-800 transition-colors text-stone-400">
              <Bell size={18} />
            </button>
            <button className="w-10 h-10 bg-stone-900 border border-white/5 flex items-center justify-center hover:bg-stone-800 transition-colors text-stone-400 xl:hidden">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Page Content - Full Height Scrollable */}
        {children}
      </div>
    </div>
  );
}
