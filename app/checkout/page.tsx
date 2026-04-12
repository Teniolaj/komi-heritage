"use client";

import { PageWrapper } from "@/components/PageWrapper";
import { PrimaryButton } from "@/components/ui/Button";
import Link from "next/link";
import { Lock, ArrowLeft, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function CheckoutPage() {
  const [fulfillment, setFulfillment] = useState<"Delivery" | "Pickup">("Delivery");

  return (
    <PageWrapper className="bg-surface font-body min-h-screen">
      {/* Mobile Top App Bar */}
      <header className="lg:hidden fixed top-0 w-full z-50 bg-[#fcf9f4]/80 backdrop-blur-md flex justify-between items-center px-6 py-4 shadow-sm">
        <Link href="/menu" className="p-2 transition-transform active:scale-95 duration-150 ease-in-out text-primary">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold tracking-tighter text-primary uppercase font-headline">Your Order</h1>
        <Link href="/menu" className="p-2 transition-transform active:scale-95 duration-150 ease-in-out text-primary">
          <X size={24} />
        </Link>
      </header>

      <div className="flex-grow max-w-7xl mx-auto w-full px-6 py-12 md:px-12 mt-16 md:mt-4 lg:mt-0 pb-48 lg:pb-12 border-t-0">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 md:gap-16 items-start">
          
          {/* Left Column: Checkout Details (60%) */}
          <div className="lg:col-span-6 space-y-12 md:space-y-16">
            <header className="hidden lg:block border-0 pt-0">
              <p className="text-secondary font-dm-sans font-bold uppercase tracking-widest text-xs mb-2 mt-0">Checkout</p>
              <h1 className="text-5xl md:text-6xl font-headline tracking-tighter font-bold text-primary">Komi Heritage</h1>
            </header>

            {/* Fulfillment Selection */}
            <section className="space-y-6">
              <h2 className="text-2xl font-headline border-b border-outline-variant pb-4 hidden lg:block font-bold">Order Method</h2>
              <div className="flex bg-surface-container p-1 w-full lg:w-fit rounded-none font-dm-sans font-bold">
                <button 
                  onClick={() => setFulfillment("Delivery")}
                  className={`flex-1 lg:px-12 py-3 font-bold uppercase tracking-wider text-xs lg:text-sm transition-colors border-0 ${fulfillment === "Delivery" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:bg-surface-container-high bg-transparent"}`}
                >
                  Delivery
                </button>
                <button 
                  onClick={() => setFulfillment("Pickup")}
                  className={`flex-1 lg:px-12 py-3 font-bold uppercase tracking-wider text-xs lg:text-sm transition-colors border-0 ${fulfillment === "Pickup" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:bg-surface-container-high bg-transparent"}`}
                >
                  Pickup
                </button>
              </div>
            </section>

            {/* Mobile Order Summary (Moved above form for logic flow on mobile) */}
            <section className="lg:hidden space-y-6 bg-surface-container-low p-6 -mx-6 md:mx-0">
              <h2 className="text-xl font-headline font-bold">Order Summary</h2>
              
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 bg-surface-container overflow-hidden shrink-0">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCho0uUOqP2Cs8wXowPOenXdv_TR8aq9nyFBT1S5aX3bzv23Smt9Sq4HYM8GKZNxVv9emuOYLmVaJG-KIM4sNzihQByjiSSo1uFJKgY-BiM5iJau5sGl1XQtTC_cO37Erj-wpc4pfev8gTshYR40x1f63hze_ZUlLD8cbzYfTNYFv4avFKIVSS-LOp-uRVHulEZBOEYizN4i50WiuDvvKbR4bbIq6OXQYAY7vsQS2LfeeDHvrpEXRoMhGwAtnwP5xIlnXV59FuBTDA" alt="Platter" />
                </div>
                <div className="flex-grow">
                  <span className="font-dm-sans text-[9px] uppercase font-bold text-secondary tracking-widest block mb-1">Heritage Recipe</span>
                  <h3 className="font-headline text-lg leading-tight mb-1 font-bold">Komi Traditional Platter</h3>
                  <div className="flex justify-between items-end">
                    <p className="text-sm font-medium text-on-surface-variant font-dm-sans">Qty: 01</p>
                    <p className="font-bold text-primary font-dm-sans">₵ 120.00</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 bg-surface-container overflow-hidden shrink-0">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUMgaS0DiTC-IOloOojlq4zYWJlZSnTeI0-I-kRCemmNqcDgbn_kk-BCRHsI-fddEvNXY006Gy0dY_vDGZpzXzKKE-UJzoxsR6E9GXsCjde0Xqb3_P85POgapwi_nq_Oq77FDTCA-PLbeEr6lcuVcXCbJm6bMIISsO2wvVjRtWdmqDmOTqTFXGU1NWVO-44_PFVx8F0ymL74uNVtoLWOYGbe_02xtOWOlakmnihFVibqE4U9QEwmu8N7yXUpo7_4X-wAC46RNxHLQ" alt="Shito" />
                </div>
                <div className="flex-grow">
                  <span className="font-dm-sans text-[9px] uppercase font-bold text-secondary tracking-widest block mb-1">Street-Side Classic</span>
                  <h3 className="font-headline text-lg leading-tight mb-1 font-bold">Signature Black Shito</h3>
                  <div className="flex justify-between items-end">
                    <p className="text-sm font-medium text-on-surface-variant font-dm-sans">Qty: 02</p>
                    <p className="font-bold text-primary font-dm-sans">₵ 45.00</p>
                  </div>
                </div>
              </div>
            </section>

            <motion.div
              key={fulfillment}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {fulfillment === "Delivery" && (
                <section className="space-y-6 md:space-y-8">
                  <h2 className="text-xl md:text-2xl font-headline border-b border-outline-variant pb-4 lg:hidden font-bold">Delivery Address</h2>
                  <h2 className="text-xl md:text-2xl font-headline border-b border-outline-variant pb-4 hidden lg:block font-bold">Fulfillment Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:p-0">
                    <div className="md:col-span-2 flex flex-col space-y-2 relative group mt-2 md:mt-0">
                      <label className="text-[10px] font-dm-sans font-bold uppercase tracking-widest text-secondary">Street Address</label>
                      <input className="minimalist-input bg-transparent font-dm-sans text-base md:text-lg w-full text-on-surface" placeholder="12 Osu Badu Street" type="text" defaultValue="Osu Oxford St, Accra" />
                    </div>
                    <div className="flex flex-col space-y-2 hidden md:flex mt-4">
                      <label className="text-[10px] font-dm-sans font-bold uppercase tracking-widest text-secondary">Area</label>
                      <input className="minimalist-input bg-transparent font-dm-sans text-base md:text-lg w-full text-on-surface" placeholder="Airport Residential Area" type="text" />
                    </div>
                    <div className="flex flex-col space-y-2 hidden md:flex mt-4">
                      <label className="text-[10px] font-dm-sans font-bold uppercase tracking-widest text-secondary">City</label>
                      <input className="minimalist-input bg-transparent font-dm-sans text-base md:text-lg w-full text-on-surface" type="text" defaultValue="Accra" />
                    </div>
                  </div>
                </section>
              )}

              {/* Contact Info */}
              <section className="space-y-6 md:space-y-8 mt-12 md:mt-16">
                <h2 className="text-xl md:text-2xl font-headline border-b border-outline-variant pb-4 font-bold">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-8 mt-4 md:mt-0">
                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] font-dm-sans font-bold uppercase tracking-widest text-secondary">Full Name</label>
                    <input className="minimalist-input bg-transparent font-dm-sans text-base md:text-lg w-full text-on-surface" placeholder="Kwame Mensah" type="text" />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] font-dm-sans font-bold uppercase tracking-widest text-secondary">Phone Number</label>
                    <div className="flex items-center border-b-2 border-outline-variant focus-within:border-primary transition-colors pb-[4px]">
                      <span className="text-base md:text-lg font-dm-sans text-on-surface-variant mr-2">+233</span>
                      <input className="w-full bg-transparent border-0 outline-none p-0 font-dm-sans text-base md:text-lg focus:ring-0 text-on-surface" placeholder="24 123 4567" type="tel" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Special Instructions */}
              <section className="space-y-6 mt-12 md:mt-16 pb-8 lg:pb-0 border-0">
                <h2 className="text-xl md:text-2xl font-headline border-b border-outline-variant pb-4 font-bold">Special Instructions</h2>
                <div className="flex flex-col space-y-2 mt-4 md:mt-0">
                  <label className="text-[10px] font-dm-sans font-bold uppercase tracking-widest text-secondary">Order Notes</label>
                  <textarea className="bg-transparent border-0 border-b-2 border-outline-variant py-2 font-dm-sans text-base md:text-lg focus:ring-0 focus:border-primary resize-none outline-none text-on-surface" placeholder="Any preferences? e.g. Extra spicy, no onions..." rows={3} defaultValue="Extra shito please"></textarea>
                </div>
              </section>
            </motion.div>
          </div>

          {/* Right Column: Order Summary (40%) Desktop */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-[100px]">
            <div className="bg-surface-container p-8 space-y-8">
              <h2 className="text-3xl font-headline tracking-tighter font-bold text-on-surface">Your Order</h2>
              
              {/* Items List */}
              <div className="space-y-6 border-0">
                {/* Item 1 */}
                <div className="flex gap-4">
                  <div className="w-20 h-20 flex-shrink-0 bg-surface-container-high border-0">
                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCho0uUOqP2Cs8wXowPOenXdv_TR8aq9nyFBT1S5aX3bzv23Smt9Sq4HYM8GKZNxVv9emuOYLmVaJG-KIM4sNzihQByjiSSo1uFJKgY-BiM5iJau5sGl1XQtTC_cO37Erj-wpc4pfev8gTshYR40x1f63hze_ZUlLD8cbzYfTNYFv4avFKIVSS-LOp-uRVHulEZBOEYizN4i50WiuDvvKbR4bbIq6OXQYAY7vsQS2LfeeDHvrpEXRoMhGwAtnwP5xIlnXV59FuBTDA" alt="Platter" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-headline font-bold text-base leading-tight uppercase text-on-surface">Komi Traditional Platter</h3>
                      <p className="text-xs font-dm-sans text-on-surface-variant mt-1">Qty: 01</p>
                    </div>
                    <p className="font-dm-sans font-bold text-sm text-primary">₵ 120.00</p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex gap-4">
                  <div className="w-20 h-20 flex-shrink-0 bg-surface-container-high border-0">
                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv4CPwwS6Cne7LMV5MmGcXNLWaGxq-AbpZzqhKtSmjHdONDRQvmmObcwn9Zi0OEnkTyckPSI8faNqyM_RtCZ5YL8nZjf3Wa2SBwpB69UoNCALnbjp0IqM-8VTtMS9ZikUaCnN0FXaaYTfz7LbRUJ8e0RP0Puw6Wklo63eSs-WBCZ2iidPrSXc8NAr9G5usiy_kzVjAaeP_wkyCY5NrPWbd9hkMw4TsvIuX-PUC0_j9VCljWSrPz1i4atBwm7Ua64QqBnBgtHh3YBc" alt="Shito" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-headline font-bold text-base leading-tight uppercase text-on-surface">Signature Black Shito</h3>
                      <p className="text-xs font-dm-sans text-on-surface-variant mt-1">Qty: 02</p>
                    </div>
                    <p className="font-dm-sans font-bold text-sm text-primary">₵ 45.00</p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-outline-variant pt-8 space-y-4">
                <div className="flex justify-between text-sm font-dm-sans font-bold text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>₵ 210.00</span>
                </div>
                <div className="flex justify-between text-sm font-dm-sans font-bold text-on-surface-variant">
                  <span>Delivery Fee</span>
                  <span>₵ 15.00</span>
                </div>
                <div className="flex justify-between items-baseline pt-4 border-t border-outline-variant/30 mt-4">
                  <span className="font-headline text-xl font-bold uppercase tracking-tighter text-on-surface">Total Payable</span>
                  <span className="font-dm-sans font-extrabold text-3xl text-primary">₵ 225.00</span>
                </div>
              </div>

              {/* CTA */}
              <PrimaryButton className="w-full py-5 text-sm" onClick={() => {}}>
                PLACE ORDER
              </PrimaryButton>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-2 text-on-surface-variant/60 font-dm-sans mt-0">
                <Lock size={14} className="text-secondary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#7a5900]">Secure Heritage Checkout</span>
              </div>
            </div>

            {/* Editorial */}
            <div className="mt-8 p-8 bg-[#feca5a]/10 border-l-4 border-secondary font-dm-sans">
              <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Our Promise</p>
              <p className="font-headline italic text-lg text-on-surface-variant leading-relaxed">"Authenticity in every grain, tradition in every flame."</p>
            </div>
          </aside>
        </div>
      </div>

      {/* Fixed Mobile Bottom Action */}
      <footer className="lg:hidden fixed bottom-0 w-full bg-surface p-6 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] z-[60] border-t border-surface-container">
        {/* Mobile Price Summary */}
        <div className="space-y-2 mb-4 font-dm-sans">
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>Subtotal</span>
            <span className="font-bold">₵ 210.00</span>
          </div>
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>Delivery Fee</span>
            <span className="font-bold">₵ 15.00</span>
          </div>
          <div className="flex justify-between items-end border-t border-outline-variant/20 pt-3 mt-3">
            <span className="font-headline font-bold text-base uppercase tracking-tight text-on-surface">Total Payable</span>
            <span className="font-dm-sans font-black text-xl text-primary">₵ 225.00</span>
          </div>
        </div>

        <PrimaryButton className="w-full py-4 text-xs font-bold uppercase tracking-[0.2em]" onClick={() => {}}>
          Place Order
        </PrimaryButton>
        <div className="mt-3 flex justify-center items-center gap-2 font-dm-sans">
          <Lock size={12} className="text-secondary" />
          <span className="text-[9px] uppercase font-bold text-on-surface-variant tracking-widest">Secure Heritage Checkout</span>
        </div>
      </footer>
    </PageWrapper>
  );
}
