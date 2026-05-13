"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  const mapsUrl =
    "https://www.google.com/maps/search/?api=1&query=Komi%20Heritage%2C%20Accra%2C%20Ghana";
  const mapEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.5487529354864!2d-0.26106682525440167!3d5.633418294347712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf99cad4adf2d5%3A0xfa6ea470380b2b7c!2sKomi%20Heritage!5e0!3m2!1sen!2sgh!4v1778605086690!5m2!1sen!2sgh";
  
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/staff')) {
    return null;
  }

  const isMenuPage = pathname === '/menu';

  return (
    <footer className={`bg-zinc-950 text-white pt-16 ${isMenuPage ? 'pb-36' : 'pb-16'} md:py-24 px-6 md:px-12 mt-auto`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 md:gap-16">
        <div className="max-w-xs text-left mx-0">
          <div className="text-3xl font-black text-primary uppercase font-headline mb-4">Komi Heritage</div>
          <p className="text-zinc-500 font-medium leading-relaxed font-body">Accra&apos;s premier kenkey destination. Fusing timeless recipes with modern street culture.</p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:gap-12 w-full md:w-auto">
          <div className="flex flex-col gap-4">
            <h5 className="text-primary font-bold uppercase tracking-widest text-sm mb-2">Connect</h5>
            <Link href="tel:+233509432281" className="text-zinc-400 hover:text-white transition-colors text-sm">Call Us</Link>
            <Link href="https://wa.me/+233247274909" className="text-zinc-400 hover:text-white transition-colors text-sm">WhatsApp</Link>
            <Link href="https://www.instagram.com/komi_heritage/" className="text-zinc-400 hover:text-white transition-colors text-sm">Instagram</Link>
            <Link href="https://www.tiktok.com/@komi_heritage2" className="text-zinc-400 hover:text-white transition-colors text-sm">TikTok</Link>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 mx-0 text-left">
          <h5 className="text-primary font-bold uppercase tracking-widest text-sm mb-2">Find Us</h5>
          <div className="flex flex-col justify-start gap-6 md:gap-3 text-zinc-400 mb-6 md:mb-0">
            <div className="md:flex md:items-center md:gap-3">
               <span className="md:hidden text-[9px] font-black tracking-[0.2em] text-zinc-500 uppercase mb-2 block text-left">Location</span>
               <Link
                 href={mapsUrl}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-[14px] md:text-base hover:text-white transition-colors"
               >
                 Komi Heritage, Tantra Hills, <br className="md:hidden"/>Accra, Ghana
               </Link>
            </div>
            <div className="md:hidden">
               <span className="text-[9px] font-black tracking-[0.2em] text-zinc-500 uppercase mb-2 block">Contact</span>
               <span className="text-[14px]">+233 24 555 0123</span>
            </div>
          </div>
          <div className="hidden md:block mt-4 overflow-hidden border-2 border-primary/20 p-1">
            <iframe
              title="Komi Heritage location on Google Maps"
              src={mapEmbedUrl}
              width="600"
              height="450"
              className="h-32 w-48 border-0 grayscale opacity-70 transition-opacity hover:opacity-100"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
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
