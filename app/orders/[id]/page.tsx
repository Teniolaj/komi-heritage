"use client";

import { PageWrapper } from "@/components/PageWrapper";
import Link from "next/link";
import { ShoppingBag, Clock, Check, UtensilsCrossed, PackageOpen, Bike, CheckCheck, MessageCircle } from "lucide-react";

export default function OrderTrackerPage() {
  return (
    <PageWrapper className="bg-background text-on-background font-body min-h-[100dvh] flex flex-col pb-24 md:pb-12">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full flex justify-between items-center px-6 py-4 mx-auto bg-[#fcf9f4] dark:bg-stone-950/80 backdrop-blur-md z-50 border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-headline italic text-2xl font-bold text-primary tracking-tighter">
            The Living Archive
          </Link>
          <div className="h-6 w-px bg-outline-variant/30 hidden md:block"></div>
          <span className="font-headline text-xl text-on-surface hidden md:block tracking-tight font-bold">Komi Heritage</span>
        </div>
        <div className="flex items-center gap-6">
          <h1 className="font-headline text-lg tracking-tight text-primary hidden md:block font-bold">Track Your Order</h1>
          <button className="text-on-surface-variant hover:bg-stone-100 transition-colors p-2 rounded-none">
            <ShoppingBag size={24} />
          </button>
        </div>
      </nav>

      <main className="pt-24 lg:pt-32 pb-12 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 w-full flex-grow">
        
        {/* Mobile Header (hidden on Desktop) */}
        <div className="mb-2 md:hidden mt-4">
          <p className="font-dm-sans text-[10px] uppercase tracking-[0.2em] text-secondary mb-1 font-bold">Status Update</p>
          <h1 className="font-headline text-4xl font-bold text-on-surface tracking-tight">Track Your Order</h1>
        </div>

        {/* Left Column: Order Summary & Info */}
        <div className="w-full md:w-5/12 space-y-8">
          
          <section className="bg-white p-6 md:p-8 border-l-4 border-l-primary relative overflow-hidden shadow-sm border border-outline-variant/15">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#feca5a]/10 -mr-16 -mt-16 rotate-45 hidden md:block"></div>
            
            <div className="flex justify-between items-start mb-4 md:mb-1">
              <div>
                <span className="font-dm-sans text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-2 block font-bold">Order Reference</span>
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-1">#KH-0042</h2>
              </div>
              <div className="text-right md:hidden">
                <p className="font-dm-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">Total</p>
                <p className="font-dm-sans font-extrabold text-xl">₵ 145.00</p>
              </div>
            </div>

            <p className="font-dm-sans text-xs md:text-sm text-on-surface-variant mb-6 md:mb-8 font-medium">Placed on Oct 24, 2023 • 2:15 PM</p>
            
            <div className="space-y-6 hidden md:block">
              <div className="flex items-start gap-4">
                <Bike size={20} className="text-primary mt-1" />
                <div>
                  <p className="font-dm-sans text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface">Fulfillment</p>
                  <p className="font-dm-sans text-sm text-on-surface-variant mt-1">Standard Delivery</p>
                </div>
              </div>

              <div className="pt-6 border-t border-outline-variant/20">
                <div className="flex justify-between items-end mb-4">
                  <div className="w-full">
                    <p className="font-dm-sans text-[10px] font-bold uppercase tracking-[0.15em] mb-3 text-on-surface">Items</p>
                    <ul className="font-dm-sans text-sm text-on-surface space-y-2 font-medium">
                      <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary"></span> Heritage Tilapia Platter x1</li>
                      <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary"></span> Yam Fries (Large) x2</li>
                    </ul>
                  </div>
                </div>
                <button className="text-primary font-dm-sans text-[10px] underline underline-offset-4 font-bold decoration-2 hover:text-primary-container transition-colors mt-2 uppercase tracking-[0.15em]">See full order</button>
              </div>
              
              <div className="pt-6 border-t border-outline-variant/20 flex justify-between items-center">
                <span className="font-headline text-xl font-bold">Total Amount</span>
                <span className="font-dm-sans text-2xl font-black text-primary">₵ 145.00</span>
              </div>
            </div>

             {/* Mobile Items simple text summary */}
            <div className="md:hidden space-y-1 mt-4 border-t border-outline-variant/20 pt-4 font-medium">
              <p className="font-dm-sans text-sm text-on-surface-variant leading-relaxed">Heritage Tilapia Platter x1, Yam Fries (Large) x2, Extra Sauce.</p>
            </div>
          </section>

          {/* Estimated Time Banner */}
          <div className="bg-primary text-white p-5 md:p-6 flex items-center justify-between md:justify-start md:gap-6 shadow-md border-b-[5px] border-[#6b0310]">
            <div className="md:bg-white/10 md:p-3 hidden md:block">
              <Clock size={28} className="text-white" />
            </div>
            <div className="flex md:hidden items-center gap-3">
              <Clock size={20} className="text-white" />
              <span className="font-dm-sans font-bold uppercase tracking-[0.15em] text-[10px]">Estimated Delivery</span>
            </div>
            
            <div className="text-right md:text-left">
              <p className="font-dm-sans text-[10px] uppercase tracking-[0.2em] text-white/80 mb-1 hidden md:block font-bold">Status: On Track</p>
              <div className="font-headline text-xl md:text-2xl italic font-bold">25–35 min</div>
            </div>
          </div>

          {/* Desktop WhatsApp CTA */}
          <button className="hidden md:flex w-full bg-[#25D366] text-white py-5 items-center justify-center gap-3 font-dm-sans font-extrabold uppercase tracking-[0.2em] hover:brightness-95 transition-all group text-[10px] shadow-lg shadow-[#25D366]/20">
            <MessageCircle size={18} />
            Need help? WhatsApp us
          </button>
        </div>

        {/* Right Column: Status Timeline (Bento Style) */}
        <div className="w-full md:w-7/12">
          <div className="bg-white border border-outline-variant/15 md:p-12 p-6 h-full shadow-sm">
            <div className="flex justify-between items-center mb-10 md:mb-12">
              <h3 className="font-headline text-2xl md:text-3xl font-bold">Live Status</h3>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary font-dm-sans text-[9px] font-bold uppercase tracking-widest border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-[pulse_1.5s_infinite] shadow-[0_0_8px_rgba(157,5,24,0.6)]"></span>
                Live Update
              </div>
            </div>

            <div className="relative space-y-0 pl-10 md:pl-12 pt-2 pb-4">
              {/* Vertical Line Connectors */}
              <div className="absolute left-[20px] md:left-[24px] top-4 bottom-8 w-[2px] bg-surface-container-highest"></div>
              <div className="absolute left-[20px] md:left-[24px] top-4 h-[35%] w-[2px] bg-primary"></div>

              {/* Step 1: Received */}
              <div className="relative flex gap-6 md:gap-8 pb-10 md:pb-12 items-start">
                <div className="absolute -left-[40px] md:-left-[44px] z-10 w-10 md:w-11 h-10 md:h-11 flex items-center justify-center bg-primary text-white border-[3px] border-white shadow-sm outline outline-1 outline-outline-variant/20">
                  <Check size={18} strokeWidth={3} />
                </div>
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-center w-full mb-1">
                    <h4 className="font-dm-sans font-bold text-xs uppercase tracking-widest text-on-surface opacity-60">Received</h4>
                    <span className="font-dm-sans text-[10px] text-on-surface-variant font-bold tracking-widest">2:15 PM</span>
                  </div>
                  <p className="font-dm-sans text-xs text-on-surface-variant md:hidden">We've locked in your heritage selection.</p>
                </div>
              </div>

              {/* Step 2: Preparing */}
              <div className="relative flex gap-6 md:gap-8 pb-10 md:pb-12 items-start">
                <div className="absolute -left-[40px] md:-left-[44px] z-10 w-10 md:w-11 h-10 md:h-11 flex items-center justify-center bg-primary text-white border-[3px] border-white shadow-[0_0_0_2px_rgba(157,5,24,0.3)] animate-[pulse_2s_infinite]">
                  <UtensilsCrossed size={18} strokeWidth={2} />
                </div>
                <div className="flex flex-col w-full">
                  <div className="flex justify-between lg:justify-start items-center gap-4 mb-2 md:mb-1">
                    <h4 className="font-dm-sans font-bold text-xs uppercase tracking-widest text-primary hover:text-primary-container">Preparing</h4>
                    <span className="font-dm-sans text-[10px] font-bold text-primary tracking-widest pt-0.5">2:34 PM</span>
                  </div>
                  <p className="font-headline italic text-lg md:text-xl text-on-surface">Your order is being prepared fresh — sit tight!</p>
                  
                  <div className="mt-4 md:mt-6 overflow-hidden h-40 md:h-56 w-full relative">
                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDH-c-M-Tq3ojOPDk5q99S7EHlcsebcN1Zm3iLTPMXRm86SBOc1x-tPSJcNFSnNfuzU19-7fObil3x58r2yjAuRf1Vvfq3ZKlnlWJB30o0Op-6O7hb_HTgE3iw37LwNCjO3PEPodvyzA-iV-8qd9HMaBVKYIlJfslssFH7NPM8UBIfltjzfiXEdX1RIt2IMDLgiXwOQZNubgP5WTVGRLEqv7VlOHdLMhklXoQtM3jfJHnXEOgDMU-6SP3VV6t0fEiIzbfkniX4LErI" alt="Artisan food preparation" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  </div>
                </div>
              </div>

              {/* Step 3: Ready */}
              <div className="relative flex gap-6 md:gap-8 pb-10 md:pb-12 items-start opacity-40">
                <div className="absolute -left-[40px] md:-left-[44px] z-10 w-10 md:w-11 h-10 md:h-11 flex items-center justify-center bg-surface-container border-[3px] border-white text-on-surface-variant outline outline-1 outline-outline-variant/30">
                  <PackageOpen size={18} strokeWidth={2} />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-4 mb-1">
                    <h4 className="font-dm-sans font-bold text-xs uppercase tracking-widest text-on-surface-variant">Ready</h4>
                    <span className="font-dm-sans text-[10px] text-on-surface-variant tracking-widest">--:--</span>
                  </div>
                  <p className="font-dm-sans text-[11px] text-on-surface-variant md:hidden font-medium">Hand-packed and quality checked.</p>
                </div>
              </div>

              {/* Step 4: Out for Delivery */}
              <div className="relative flex gap-6 md:gap-8 pb-10 md:pb-12 items-start opacity-40">
                <div className="absolute -left-[40px] md:-left-[44px] z-10 w-10 md:w-11 h-10 md:h-11 flex items-center justify-center bg-surface-container border-[3px] border-white text-on-surface-variant outline outline-1 outline-outline-variant/30">
                  <Bike size={18} strokeWidth={2} />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-4 mb-1">
                    <h4 className="font-dm-sans font-bold text-xs uppercase tracking-widest text-on-surface-variant">Out for Delivery</h4>
                    <span className="font-dm-sans text-[10px] text-on-surface-variant tracking-widest">--:--</span>
                  </div>
                  <p className="font-dm-sans text-[11px] text-on-surface-variant md:hidden font-medium">The Collector is en route to your location.</p>
                </div>
              </div>

              {/* Step 5: Delivered */}
              <div className="relative flex gap-6 md:gap-8 items-start opacity-40">
                <div className="absolute -left-[40px] md:-left-[44px] z-10 w-10 md:w-11 h-10 md:h-11 flex items-center justify-center bg-surface-container border-[3px] border-white text-on-surface-variant outline outline-1 outline-outline-variant/30">
                  <CheckCheck size={18} strokeWidth={2} />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-4 mb-1">
                    <h4 className="font-dm-sans font-bold text-xs uppercase tracking-widest text-on-surface-variant">Delivered</h4>
                    <span className="font-dm-sans text-[10px] text-on-surface-variant tracking-widest">--:--</span>
                  </div>
                  <p className="font-dm-sans text-[11px] text-on-surface-variant md:hidden font-medium">Enjoy your piece of the archive.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Map/Location Teaser Section (Desktop only to match design) */}
      <section className="max-w-7xl mx-auto px-6 pb-24 w-full hidden md:block">
        <div className="h-[350px] w-full bg-surface-container-highest relative overflow-hidden border border-outline-variant/15 shadow-sm">
          <div className="absolute inset-0 grayscale contrast-125 brightness-75 opacity-50">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7dmRXrGX3abJO7SnEh3eRS490qf6Xy0OtqyLJF8TMzE0_mmh--gTOFC6pmia1EQaxluJduekh5W5_M8kt6hS58RKfTyn1GMSnqu09nLxm_SQplgLOAc9GH5IDJX_dzq2ktAe1QquN4tqnOpSZCN5-UFoiYGUwFCTf3215QShCRhLyjynoYgQJGqaQKPLP7NRNxGYcmZJh_VCIWsb3ZLJDhbHdYWhVb7P8P464r9vmvOa22rSHU-K6JsSELhhlf8LDwL5eMJhSdW4" alt="Map background" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent w-2/3"></div>
          
          <div className="relative h-full flex flex-col justify-center px-12 z-10 w-2/3">
            <span className="font-dm-sans text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4 block">Delivery Destination</span>
            <h3 className="font-headline text-4xl font-bold text-on-surface max-w-sm leading-tight mb-8">Oxford St, Osu,<br/>Accra, Ghana</h3>
            <div className="flex gap-4">
              <button className="bg-primary text-white px-8 py-3.5 font-dm-sans font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-primary-container transition-all shadow-md">Change Address</button>
              <button className="bg-white text-on-surface border border-outline-variant/30 px-8 py-3.5 font-dm-sans font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-surface-container transition-all shadow-sm">View on Map</button>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile CTA: Sticky WhatsApp */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-background/90 backdrop-blur-md md:hidden z-50 border-t border-outline-variant/10 shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
        <button className="w-full bg-[#25D366] text-white py-4 flex items-center justify-center gap-3 font-dm-sans font-extrabold uppercase tracking-[0.15em] transition-transform active:scale-95 text-xs shadow-lg shadow-[#25D366]/20">
          <MessageCircle size={18} />
          WhatsApp Support
        </button>
      </div>
    </PageWrapper>
  );
}
