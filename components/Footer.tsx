"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const isMenuPage = pathname === '/menu';

  return (
    <footer className={`bg-zinc-950 text-white pt-16 ${isMenuPage ? 'pb-36' : 'pb-16'} md:py-24 px-6 md:px-12 mt-auto`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 md:gap-16">
        <div className="max-w-xs text-left mx-0">
          <div className="text-3xl font-black text-primary uppercase font-headline mb-4">Komi Heritage</div>
          <p className="text-zinc-500 font-medium leading-relaxed font-body">Accra's premier kenkey destination. Fusing timeless recipes with modern street culture.</p>
        </div>
        
        <div className="grid grid-cols-2 gap-8 md:gap-12 w-full md:w-auto">
          <div className="flex flex-col gap-4">
            <h5 className="text-primary font-bold uppercase tracking-widest text-sm mb-2">Connect</h5>
            <Link href="tel:+233509432281" className="text-zinc-400 hover:text-white transition-colors text-sm">Call Us</Link>
            <Link href="https://wa.me/+233247274909" className="text-zinc-400 hover:text-white transition-colors text-sm">WhatsApp</Link>
            <Link href="https://www.instagram.com/komi_heritage/" className="text-zinc-400 hover:text-white transition-colors text-sm">Instagram</Link>
            <Link href="https://www.tiktok.com/@komi_heritage2" className="text-zinc-400 hover:text-white transition-colors text-sm">TikTok</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h5 className="text-primary font-bold uppercase tracking-widest text-sm mb-2">Quick Links</h5>
            <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">Sustainability</Link>
            <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">Privacy Policy</Link>
            <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">Terms of Service</Link>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 mx-0 text-left">
          <h5 className="text-primary font-bold uppercase tracking-widest text-sm mb-2">Find Us</h5>
          <div className="flex flex-col justify-start gap-6 md:gap-3 text-zinc-400 mb-6 md:mb-0">
            <div className="md:flex md:items-center md:gap-3">
               <span className="md:hidden text-[9px] font-black tracking-[0.2em] text-zinc-500 uppercase mb-2 block text-left">Location</span>
               <span className="text-[14px] md:text-base">Osu Oxford St.<br className="md:hidden"/>Accra, Ghana</span>
            </div>
            <div className="md:hidden">
               <span className="text-[9px] font-black tracking-[0.2em] text-zinc-500 uppercase mb-2 block">Contact</span>
               <span className="text-[14px]">+233 24 555 0123</span>
            </div>
          </div>
          <div className="hidden md:block mt-4 border-2 border-primary/20 p-1">
            <img 
              className="w-48 h-32 object-cover grayscale opacity-50 hover:opacity-100 transition-opacity" 
              alt="Map"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSrTR8gLt6MZhLGV-0sLmcCMeBrIqxvM4Icd_1fHO6IEz-51hP3ClfTT3edQXOnn7E3UfsQEtkSZNBBUAYpanmEAVOI_sxjEg_ap-KkQ_PCSAYb14L6qd_9-Xd2tQMKpV5j_8bIhHNo7WWjn3q9QG92lME3jYUsQ_RZII273dlTkapF0c7r1Ht7EMTBitUp-KL98DKQZiQBjyZM4LSSS0EDFVremIHCkAvZ1eCr0yqPaU8nCUVkOryReI49dmQSAlD0kdxXeCz1Ig"
            />
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 md:mt-20 pt-10 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-zinc-600 text-[9px] md:text-xs font-bold tracking-[0.2em] uppercase font-body">© 2026 KOMI HERITAGE ACCRA. ALL RIGHTS RESERVED.</p>
        <div className="hidden md:flex gap-8">
           {/* Placeholder for icons if needed */}
        </div>
      </div>
    </footer>
  );
}
