"use client";

import { PageWrapper } from "@/components/PageWrapper";
import { PrimaryButton, GhostButton } from "@/components/ui/Button";
import { useInView, motion } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Homepage() {
  const scrollRef = useRef(null);
  const isInView = useInView(scrollRef, { once: true, margin: "-80px" });

  const processRef = useRef(null);
  const isProcessInView = useInView(processRef, { once: true, margin: "-80px" });

  const aboutRef = useRef(null);
  const isAboutInView = useInView(aboutRef, { once: true, margin: "-80px" });

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative h-[90vh] md:h-[calc(100vh-80px)] w-full flex flex-col justify-end md:justify-center overflow-hidden bg-black">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 hero-slide">
          <img 
            className="w-full h-full object-cover md:object-center object-[65%_center] md:grayscale-0 grayscale-[20%] brightness-75 md:brightness-100" 
            alt="Traditional Ghanaian Kenkey" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTz44NE7IdTxG5QCoMyKQ2MnZxdsMsh-F1_RU9_fiqAMCSQ8pExSvPT_mUG-Vcz9EdX06KI4ibo0BxX8Lv4sYdhb80TqJyNYBaJZtTv3gf0kq1Sgu-_wyfFdMNLvalrVICY_meJ5yYidv6hnODAoIckwCZs89X_gMUgKXmBjbEmLalQUuMQMJo7QOszIbXAzKQT2o_Jni4xWuojdoFhsct6j527FCYw12HZwXV_qHSlpDtVtZ5YyS3sbctKOz6RI6B_4ySOwxKy1c"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent md:bg-gradient-to-b md:from-black/60 md:via-transparent md:to-black/80"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-20 text-center text-white px-6 md:px-4 pb-16 md:pb-0 font-body">
          <h1 className="font-headline text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.85] md:leading-none mb-3 md:mb-2 text-shadow-xl text-white">KOMI HERITAGE</h1>
          <p className="hidden md:block text-xl md:text-3xl font-light italic mb-2 tracking-wide opacity-90 font-newsreader">Rooted in Flavor. Wrapped in Heritage.</p>
          <p className="font-body text-white/90 md:text-white text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase mb-10 md:opacity-75">The Soul of Accra Street Food</p>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-6 justify-center max-w-sm sm:max-w-none mx-auto">
            <PrimaryButton className="w-full sm:w-auto md:px-10 md:py-5 shadow-xl">
              Order Now
            </PrimaryButton>
            <GhostButton className="w-full sm:w-auto md:px-10 md:py-5 hidden sm:flex border-white text-white hover:bg-white hover:text-black">
              View Menu
            </GhostButton>
            <Link href="/menu" className="sm:hidden block text-white font-bold uppercase tracking-widest text-[10px] py-2 mt-2">View Full Menu</Link>
          </div>
        </div>

        {/* Announcement Strip */}
        <div className="absolute bottom-0 w-full bg-primary py-2 md:py-3 overflow-hidden z-20 font-dm-sans">
          <div className="flex whitespace-nowrap animate-pulse md:animate-none md:text-center md:justify-center">
            <span className="text-on-primary text-[9px] md:text-sm font-black uppercase tracking-[0.2em] px-4 w-full text-center">Now delivering across Accra • Authenticity in every bite</span>
          </div>
        </div>
      </section>

      {/* Menu Preview Section */}
      <motion.section 
        ref={scrollRef}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="py-12 md:py-24 px-6 md:px-12 bg-surface font-body"
      >
        <div className="max-w-7xl mx-auto">
          <div className="md:flex md:items-center md:gap-6 mb-8 md:mb-16">
            <div className="md:hidden">
              <span className="font-dm-sans text-[10px] text-primary font-black uppercase tracking-widest mb-1 block">Selections</span>
              <h2 className="font-headline text-3xl font-black uppercase tracking-tighter text-on-surface">Menu Favorites</h2>
            </div>
            <h2 className="hidden md:block text-4xl lg:text-5xl font-black tracking-tighter uppercase font-headline">WHAT WE'RE COOKING</h2>
            <div className="hidden md:block h-1 flex-1 bg-primary"></div>
          </div>

          <div className="flex md:grid overflow-x-auto md:overflow-x-visible snap-x snap-mandatory hide-scrollbar gap-4 md:grid-cols-3 md:gap-12 pb-4 md:pb-0 -mx-6 md:mx-0 px-6 md:px-0">
            {/* Card 1 */}
            <div className="min-w-[280px] md:min-w-0 snap-center bg-surface-container-low border border-surface-container-high md:border-none shadow-sm md:shadow-none group md:bg-transparent">
              <div className="aspect-[4/3] md:aspect-square overflow-hidden mb-0 md:mb-6 rounded-none">
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="w-full h-[200px] md:h-full object-cover transition-transform duration-700 md:group-hover:scale-110" 
                  alt="One Man Kenkey" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrUfr87McCDa2QdE9rW4vdqDKSoyyKfGUkrs5qPifd-i6mHfeW5NtuhALYbCn_ZhWl4V76yhLghUKJgTuhjqN-pzDqyiwj76MoR4rt2rhudunWPHv3DOS26Hjxi642Amp6nOWbkOtyLSXAy8FiKip_TQoGrhsyYbnSxE5vZuXAolF7ndd7mgH-fq92oD6p5JyL7e-gh32MCLBDFr2HUdZv7x49_iz4bVCQtXNQ_S6SHnAaWpCJjjff5hFeHYTeqVuLEYAxDQ42W4s"
                />
              </div>
              <div className="p-5 md:p-0 flex flex-col gap-1 md:block">
                <div className="flex justify-between items-start mb-1 md:mb-2 font-headline">
                  <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight">One Man Kenkey</h3>
                  <span className="font-dm-sans md:font-bold text-sm md:text-xl font-black text-primary md:text-secondary whitespace-nowrap ml-4">GHC 30</span>
                </div>
                <p className="text-[11px] md:text-sm text-on-surface-variant md:text-zinc-600 font-medium leading-relaxed mb-4 md:mb-6 h-8 md:h-auto overflow-hidden">The classic solo mission. One ball of fermented kenkey with hot pepper sauce and fried fish.</p>
                
                <PrimaryButton className="hidden md:flex w-full py-4 text-xs">Add to Cart</PrimaryButton>
                <button className="md:hidden self-end w-12 h-12 bg-primary text-on-primary flex items-center justify-center active-tap">
                  <span className="font-dm-sans text-2xl font-light">+</span>
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="min-w-[280px] md:min-w-0 snap-center bg-surface-container-low border border-surface-container-high md:border-none shadow-sm md:shadow-none group md:bg-transparent">
              <div className="aspect-[4/3] md:aspect-square overflow-hidden mb-0 md:mb-6 rounded-none">
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="w-full h-[200px] md:h-full object-cover transition-transform duration-700 md:group-hover:scale-110" 
                  alt="Party Pack" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwIuYPCmU2Gcrj2ACGjd9sxZD4sBDd0_orcCuwsEUUKMrlUbIld6IBvUxg7_Nh8cQ2_hJGl3yaG21fpBxtOJvE4xjh0C0zSsOeDW2PD35fmyAFpRJsBySaoySzJImZjZps4fWos-I1fVxWj67ZyKuRSUd2YAYFrqPPjDELjd9hTt1makEkkznS5CbV0mWVaT-kWB-8coqNaWSrk2m7y_G9Wnw_BNGja6pIECOnjmpviih8rJ6uxykUb6wmXJCpOFJeVaVmaxaKWn4"
                />
              </div>
              <div className="p-5 md:p-0 flex flex-col gap-1 md:block">
                <div className="flex justify-between items-start mb-1 md:mb-2 font-headline">
                  <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight">Party Pack</h3>
                  <span className="font-dm-sans md:font-bold text-sm md:text-xl font-black text-primary md:text-secondary whitespace-nowrap ml-4">GHC 65</span>
                </div>
                <p className="text-[11px] md:text-sm text-on-surface-variant md:text-zinc-600 font-medium leading-relaxed mb-4 md:mb-6 h-8 md:h-auto overflow-hidden">Built for the squad. Three balls of kenkey with double helpings of fish, eggs, and extra octopus.</p>
                
                <PrimaryButton className="hidden md:flex w-full py-4 text-xs">Add to Cart</PrimaryButton>
                <button className="md:hidden self-end w-12 h-12 bg-primary text-on-primary flex items-center justify-center active-tap">
                  <span className="font-dm-sans text-2xl font-light">+</span>
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="min-w-[280px] md:min-w-0 snap-center bg-surface-container-low border border-surface-container-high md:border-none shadow-sm md:shadow-none group md:bg-transparent">
              <div className="aspect-[4/3] md:aspect-square overflow-hidden mb-0 md:mb-6 rounded-none">
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="w-full h-[200px] md:h-full object-cover transition-transform duration-700 md:group-hover:scale-110" 
                  alt="Spicy Heat" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoONJSdLS9UyXi7AFjDLnAVJmJ7s79oMAY404eJlRLhKiEmv7xXZSeE1lQW8vehXd5Iw0bGEtNA5_6TE_BM9R1F1fwYR40YpMWN5xzInPHJKEd65qKNebf91iKb3MaQ6q1CjKmIryHEzcwMzitGTLB3-JqtXGsRS2GIIz5EnKeBq0YW6SQMAvAmDBqu6pDwTOCTGUwlAwzZrKGv0iDYiVqbWHQcyiL1p5aMTHwEUx_7kTjW9EiTDPuRCXpHhAaipfo05epBSYJr3M"
                />
              </div>
              <div className="p-5 md:p-0 flex flex-col gap-1 md:block">
                <div className="flex justify-between items-start mb-1 md:mb-2 font-headline">
                  <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight">Spicy Heat</h3>
                  <span className="font-dm-sans md:font-bold text-sm md:text-xl font-black text-primary md:text-secondary whitespace-nowrap ml-4">GHC 260</span>
                </div>
                <p className="text-[11px] md:text-sm text-on-surface-variant md:text-zinc-600 font-medium leading-relaxed mb-4 md:mb-6 h-8 md:h-auto overflow-hidden">Family feast. Twelve balls of kenkey, assorted sea-food platter, and our signature heritage pepper.</p>
                
                <PrimaryButton className="hidden md:flex w-full py-4 text-xs">Add to Cart</PrimaryButton>
                <button className="md:hidden self-end w-12 h-12 bg-primary text-on-primary flex items-center justify-center active-tap">
                  <span className="font-dm-sans text-2xl font-light">+</span>
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </motion.section>

      {/* How It Works Strip */}
      <motion.section 
        ref={processRef}
        initial={{ opacity: 0, y: 40 }}
        animate={isProcessInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-zinc-950 md:bg-zinc-950 text-white md:py-20 md:px-6 bg-surface-container py-16 px-6 md:text-white text-on-surface font-body"
      >
        <div className="md:hidden max-w-7xl mx-auto mb-10 text-center text-on-surface">
           <span className="font-dm-sans text-[10px] text-primary font-black uppercase tracking-widest mb-1 block">Process</span>
           <h2 className="font-headline text-3xl font-black uppercase tracking-tighter">How We Serve</h2>
        </div>

        <div className="max-w-7xl mx-auto md:grid md:grid-cols-3 md:gap-16 md:text-center space-y-4 md:space-y-0">
          <div className="flex md:flex-col items-center md:items-center p-6 md:p-0 bg-surface md:bg-transparent border border-surface-container-high md:border-none gap-6 md:gap-0 h-full">
            <div className="text-4xl md:text-6xl font-light text-primary/10 md:text-primary/40 md:mb-4 font-newsreader leading-none">01</div>
            <div>
              <h4 className="text-xs md:text-xl font-bold md:font-bold uppercase tracking-wider md:tracking-widest mb-1 md:mb-2 md:text-white">Select Heritage</h4>
              <p className="text-[11px] md:text-sm text-on-surface-variant md:text-zinc-400 font-medium">Choose from our curated menu of authentic Accra classics.</p>
            </div>
          </div>
          <div className="flex md:flex-col items-center md:items-center p-6 md:p-0 bg-surface md:bg-transparent border border-surface-container-high md:border-none gap-6 md:gap-0 h-full">
            <div className="text-4xl md:text-6xl font-light text-primary/10 md:text-primary/40 md:mb-4 font-newsreader leading-none">02</div>
            <div>
              <h4 className="text-xs md:text-xl font-bold md:font-bold uppercase tracking-wider md:tracking-widest mb-1 md:mb-2 md:text-white">Firewood Prep</h4>
              <p className="text-[11px] md:text-sm text-on-surface-variant md:text-zinc-400 font-medium">Traditional methods ensure the smoky flavor of history.</p>
            </div>
          </div>
          <div className="flex md:flex-col items-center md:items-center p-6 md:p-0 bg-surface md:bg-transparent border border-surface-container-high md:border-none gap-6 md:gap-0 h-full">
            <div className="text-4xl md:text-6xl font-light text-primary/10 md:text-primary/40 md:mb-4 font-newsreader leading-none">03</div>
            <div>
               <h4 className="text-xs md:text-xl font-bold md:font-bold uppercase tracking-wider md:tracking-widest mb-1 md:mb-2 md:text-white">Accra Wide</h4>
               <p className="text-[11px] md:text-sm text-on-surface-variant md:text-zinc-400 font-medium">Meal arrives hot and fresh in sustainable packaging.</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section 
        ref={aboutRef}
        initial={{ opacity: 0, y: 40 }}
        animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-surface py-0 md:py-32 md:px-6 overflow-hidden pb-12 font-body"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-20 items-center">
          <div className="relative w-full">
            <img 
              className="w-full h-[300px] md:aspect-[4/5] md:h-auto object-cover grayscale-[30%] md:grayscale-0" 
              alt="Story" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-VrgEDxBgd5D-z2Q7SqrgEoLri0bQfc_9x5z6qDQiYBvteAvyCOjd1nJoEIV_anM3df-Pzj4lFxYQanLhvT1usVrS4f2uX-y1qGF3Vw4OLl1QbGHudl2k6la4x_r5SjUu_-VfmzyEbgWV1y1ufaAqQnRKVWn-6BOBDGrDGR0ORYWxbqZQGwSSIwbhaSFiEPr7aq41vftQeZMpcgnzvVIdlumIGm_tFVOux3qvKE5wLZnYSx0xnW_a9AfOkOMwiq5l_RxvXNcGkIA"
            />
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-primary p-6 hidden md:flex flex-col justify-end">
              <p className="text-white text-4xl font-black font-newsreader">Est.</p>
              <p className="text-white text-5xl font-black tracking-tighter font-headline">2020</p>
            </div>
          </div>
          <div className="px-6 py-10 md:py-0 text-center md:text-left">
            <div className="w-12 md:w-20 h-1 bg-primary mb-6 md:mb-8 mx-auto md:mx-0"></div>
            <h2 className="font-headline text-3xl md:text-6xl font-black tracking-tighter uppercase leading-tight mb-4 md:mb-10 text-on-surface">
              <span className="md:hidden">Preserving the Flame</span>
              <span className="hidden md:inline">Serving Heritage Since Day One</span>
            </h2>
            <div className="space-y-6 text-xs md:text-lg text-on-surface-variant md:text-zinc-700 leading-relaxed max-w-xs md:max-w-none mx-auto md:mx-0">
               <p className="md:hidden">Komi Heritage is a living archive of Ghanaian culinary art. We celebrate street-side cooking, elevating it with premium ingredients while keeping the soul of the recipe intact.</p>
               <p className="hidden md:block">Komi Heritage was born from a simple desire: to elevate the humble Kenkey into a gourmet experience that respects the Ga tradition while embracing the energy of modern Accra.</p>
               <p className="hidden md:block">Every ball of kenkey is hand-wrapped, every pepper sauce is slow-cooked for hours, and every piece of fish is sourced fresh from the coast. This is not just street food—it's a tribute to our ancestors' kitchen.</p>
            </div>
            
            <Link href="/" className="mt-8 md:mt-12 group inline-flex md:flex justify-center md:justify-start items-center gap-2 md:gap-4 text-primary font-bold uppercase tracking-widest text-[10px] md:text-sm">
              Explore Our Story
              <ArrowRight className="group-hover:translate-x-2 transition-transform" size={16} />
            </Link>
          </div>
        </div>
      </motion.section>

    </PageWrapper>
  );
}
