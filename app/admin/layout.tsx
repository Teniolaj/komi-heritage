"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Receipt, Users, Menu as MenuIcon, Settings, LogOut, Bell, UserCircle, Search, Home, MoreHorizontal } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders", icon: Receipt },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/menu", label: "Menu Manager", icon: MenuIcon },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="bg-surface text-on-surface flex min-h-screen font-body">
      {/* SideNavBar (Desktop) */}
      <aside className="bg-stone-950 h-screen w-64 hidden md:flex flex-col fixed left-0 top-0 z-50 p-6 transition-all duration-200 ease-in-out">
        <div className="mb-12 mt-2">
          <h1 className="text-white font-headline italic text-xl tracking-tighter">The Living Archive</h1>
          <p className="text-stone-500 font-dm-sans uppercase tracking-[0.2em] text-[8px] mt-1 font-bold">Cultural Monolith Admin</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link 
                key={link.href}
                href={link.href} 
                className={`flex items-center gap-4 py-3 transition-all duration-200 ease-in-out group ${
                  isActive 
                    ? "text-white border-l-4 border-primary bg-stone-900/50 -ml-6 pl-10 px-4 w-[calc(100%+24px)]" 
                    : "text-stone-500 hover:text-stone-100 hover:bg-stone-900 px-4"
                }`}
              >
                <Icon size={18} className={isActive ? "text-primary bg-transparent" : ""} />
                <span className="font-dm-sans uppercase tracking-widest text-[11px] font-bold">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-stone-800/50">
          <button className="flex items-center gap-4 px-4 py-3 w-full text-stone-500 hover:text-primary transition-colors pr-0 pl-0">
            <LogOut size={18} />
            <span className="font-dm-sans uppercase tracking-widest text-[11px] font-bold">Logout</span>
          </button>
          
          <div className="mt-6 flex items-center gap-3 bg-stone-900/50 p-3 -mx-2">
            <div className="w-10 h-10 bg-stone-800 flex items-center justify-center overflow-hidden shrink-0">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTVVUUKFEXxHK4CqGXf8yo8CyynKH519XnUMvp1i4oXcRpA3tJI9V06_mSbL5yTFkjj0BbyIR9HLL5dDhmm-INzeyWyf-gh54M6CGhdstHcf8pzVCgHMRoylq6uVATjnuYML6oMXEl6aEO_lX0fHGZJgb2FBYOTXKfwR-kNeB5_r13DpSpygG3aXboBTqu5f_m0LzpMe8ka1wYk-Iz_siMcPmMhpxLrMag9cgUEzFkZwgPNgY6bIbQCQgsp8VGWfZ5WJ77ViOCjzg" alt="Admin" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold text-white uppercase tracking-tighter truncate leading-tight">Admin Profile</p>
              <p className="text-[9px] text-stone-500 uppercase tracking-widest mt-1">View Live Store</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 bg-surface min-h-screen flex flex-col overflow-hidden pb-16 md:pb-0">
        {/* TopNavBar (Desktop & Tablet) */}
        <header className="bg-[#fcf9f4]/90 sticky top-0 backdrop-blur-md border-b border-outline-variant/20 flex justify-between items-center w-full px-6 py-4 md:px-8 md:py-6 z-40">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">Good morning, Boss 👋</h2>
              <p className="text-on-surface-variant font-dm-sans text-[9px] md:text-[10px] uppercase tracking-widest mt-1 font-bold">October 24, 2023 | Tuesday</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden lg:flex items-center bg-surface-container px-4 py-2 hover:bg-surface-container-high transition-colors">
              <Search size={16} className="text-stone-400" />
              <input className="bg-transparent border-0 focus:ring-0 text-xs font-dm-sans w-48 outline-none ml-2" placeholder="Search archives..." type="text" />
            </div>
            
            <div className="flex items-center gap-1 md:gap-2">
              <button className="w-10 h-10 flex items-center justify-center hover:bg-stone-100 transition-colors text-stone-600">
                <Bell size={20} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center hover:bg-stone-100 transition-colors text-stone-600 md:hidden">
                <UserCircle size={24} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Nav Bar (Bottom) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center bg-[#fcf9f4] border-t border-stone-200 md:hidden h-[60px] shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-2">
        <Link href="/admin" className={`flex flex-col items-center justify-center p-2 h-full w-full duration-100 ${pathname === '/admin' ? 'bg-primary text-white' : 'text-stone-500 active:bg-stone-200'}`}>
          <Home size={20} />
          <span className="font-dm-sans uppercase text-[9px] font-bold mt-1 tracking-widest">Home</span>
        </Link>
        <Link href="/admin/orders" className={`flex flex-col items-center justify-center p-2 h-full w-full duration-100 ${pathname === '/admin/orders' ? 'bg-primary text-white' : 'text-stone-500 active:bg-stone-200'}`}>
          <Receipt size={20} />
          <span className="font-dm-sans uppercase text-[9px] font-bold mt-1 tracking-widest">Orders</span>
        </Link>
        <Link href="/admin/menu" className={`flex flex-col items-center justify-center p-2 h-full w-full duration-100 ${pathname === '/admin/menu' ? 'bg-primary text-white' : 'text-stone-500 active:bg-stone-200'}`}>
          <MenuIcon size={20} />
          <span className="font-dm-sans uppercase text-[9px] font-bold mt-1 tracking-widest">Menu</span>
        </Link>
        <Link href="/admin/more" className={`flex flex-col items-center justify-center p-2 h-full w-full duration-100 ${pathname === '/admin/more' ? 'bg-primary text-white' : 'text-stone-500 active:bg-stone-200'}`}>
          <MoreHorizontal size={20} />
          <span className="font-dm-sans uppercase text-[9px] font-bold mt-1 tracking-widest">More</span>
        </Link>
      </nav>
    </div>
  );
}
