"use client";

import { PageWrapper } from "@/components/PageWrapper";
import { useInView, motion } from "framer-motion";
import type { CSSProperties } from "react";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const craftedListItems = [
  {
    title: "One Man Kenkey",
    description:
      "The essential classic. One perfectly fermented ball with prime fried fish and house shito.",
    price: "GH₵ 45",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAIt7wSokEtXKvmIAtemLqmLEX6yZjPtaNAWrZpYnDMhLbkndWBb6B8goEChAtTaI0KZu6xVldHtO_-qpXLVXEpQlSnQlCHwfJ4GApER1UOXEWKwBxuk6xXlpks2FehLdQyCrrqdL61IdRY_s0Fky9xV_I2mzyrEyM6pCy-RCTHm_NVwBYfRbkX0vUA2LtjFGZeaAd1y6vlHRLPc9XybaceQBJYodNVqEBPltrv9fw4wmKxFda64EMwzueBiwfb3B-BAP_9r_FMkbM",
    cardClassName: "bg-[#1A1A1A]",
    imageClassName: "h-64",
    style: {
      "--card-rotate": "-3deg",
      "--card-translate-y": "2rem",
      "--card-translate-x": "-1.5rem",
      "--card-scale": "1",
    } as CSSProperties,
  },
  {
    title: "The Heritage Platter",
    description:
      "Designed for the table. Four balls, red and green shito, grilled octopus, and fresh avocado.",
    price: "GH₵ 180",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTPIeaIyhBWSS_nzIWX6G9DJHbn6hDTxinKZS1XF7TqXAtSUcPlIPuGFZf_nXxVpfk-HMHntGB1ESNm4idME3Nm2H0AqlSVvoiMfs6iNQdUkKX8djrtrB2blj39o3j5PLzVjlAe86vurrILMIoE4h4CXIqiIxKrjyrMmurOVkwpjUBI9oYmpM38a35bQfz7HBLdoBEjUbhq3-9WsdKfxojbYIzXhlTRJdoO7wHG40TzQX6ub7WNmDtS1lAFsoNZyvmR5GKmw3i768",
    cardClassName:
      "z-20 border border-[#D4A437]/20 bg-stone-900",
    imageClassName: "h-80",
    style: {
      "--card-rotate": "0deg",
      "--card-translate-y": "0rem",
      "--card-translate-x": "0rem",
      "--card-scale": "1.05",
    } as CSSProperties,
  },
  {
    title: "Classic Gold",
    description:
      "A refined take. Smooth textured kenkey served with jumbo prawns and ginger-infused sauce.",
    price: "GH₵ 95",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAv9c6243QvOPlQ_8RVqLBzu7to8OgAZ-OUGmS9KItYL60PGjGUJ-1bcxGkbmswNa1BUHGdJ9q_yUbmsy7RGWbHi50K9-M8gNYzjhZlEOeYwuQTYnoZZQioBc1g0V9wRt-XRb-nSKGn-FnTP7cXMfFyGS21fKYY373yWiCrGRXRgMxelRt5kNVMFKfe3zhRYrm7X3ebF63bhjm_2WNRVWmSuKHqCy4Mxv-foLsmIoAa-wLZ1SWJxj_o_5t8a-yTLGya7K6BbwN9HNY",
    cardClassName: "bg-[#1A1A1A]",
    imageClassName: "h-64",
    style: {
      "--card-rotate": "6deg",
      "--card-translate-y": "-2rem",
      "--card-translate-x": "1.5rem",
      "--card-scale": "1",
    } as CSSProperties,
  },
];

export default function Homepage() {
  const scrollRef = useRef(null);
  const isInView = useInView(scrollRef, { once: true, margin: "-80px" });

  const processRef = useRef(null);
  const isProcessInView = useInView(processRef, { once: true, margin: "-80px" });

  const aboutRef = useRef(null);
  const isAboutInView = useInView(aboutRef, { once: true, margin: "-80px" });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setIsAuthenticated(!!data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsAuthenticated(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <PageWrapper>
      <section className="relative -mt-[72px] md:-mt-[80px] h-[70vh] md:h-[100vh] w-full flex flex-col justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 hero-slide">
          <img
            className="w-full h-full object-cover md:object-center object-[65%_center] md:grayscale-0 grayscale-[20%] brightness-75 md:brightness-100"
            alt="Traditional Ghanaian Kenkey"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTz44NE7IdTxG5QCoMyKQ2MnZxdsMsh-F1_RU9_fiqAMCSQ8pExSvPT_mUG-Vcz9EdX06KI4ibo0BxX8Lv4sYdhb80TqJyNYBaJZtTv3gf0kq1Sgu-_wyfFdMNLvalrVICY_meJ5yYidv6hnODAoIckwCZs89X_gMUgKXmBjbEmLalQUuMQMJo7QOszIbXAzKQT2o_Jni4xWuojdoFhsct6j527FCYw12HZwXV_qHSlpDtVtZ5YyS3sbctKOz6RI6B_4ySOwxKy1c"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent md:bg-gradient-to-b md:from-black/60 md:via-transparent md:to-black/80"></div>
        </div>

        <div className="relative z-20 flex flex-col items-center text-center text-white px-6 md:px-4 pt-24 md:pt-24 pb-10 md:pb-0 font-body">
          <h1 className="font-headline text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.85] md:leading-none mb-3 md:mb-2 text-shadow-xl text-white">
            KOMI HERITAGE
          </h1>
          <p className="hidden md:block text-xl md:text-3xl font-light italic mb-2 tracking-wide opacity-90 font-newsreader">
            Rooted in Flavor. Wrapped in Heritage.
          </p>
          <p className="font-body text-white/90 md:text-white text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase mb-10 md:opacity-75">
            The Soul of Accra Street Food
          </p>

          <div className="flex justify-center max-w-sm sm:max-w-none mx-auto">
            <Link
              href="/menu"
              className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary-container px-10 py-4 font-headline text-lg font-bold text-white transition-colors hover:bg-primary md:px-12"
            >
              Order Now
              <ArrowRight
                className="transition-transform group-hover:translate-x-1"
                size={20}
              />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 w-full bg-primary py-2 md:py-3 overflow-hidden z-20 font-dm-sans">
          <div className="stitch-marquee-container">
            <div className="stitch-marquee-content flex items-center gap-10">
              <span className="whitespace-nowrap text-on-primary text-[9px] md:text-sm font-black uppercase tracking-[0.2em]">
                Now delivering across Accra • Authenticity in every bite • Fresh
                daily • Tantra Hills • Accra wide delivery • Authentic Ga flavors
                • Organic ingredients • The heritage way •
              </span>
              <span className="whitespace-nowrap text-on-primary text-[9px] md:text-sm font-black uppercase tracking-[0.2em]">
                Now delivering across Accra • Authenticity in every bite • Fresh
                daily • Tantra Hills • Accra wide delivery • Authentic Ga flavors
                • Organic ingredients • The heritage way •
              </span>
            </div>
          </div>
        </div>
      </section>

      <motion.section
        ref={scrollRef}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative overflow-hidden bg-[#111111] py-24 md:py-32 font-body"
      >
        <div className="grain-texture absolute inset-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12 md:mb-16">
            <div>
              <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-white mb-4">
                THE CRAFTED LIST
              </h2>
              <div className="w-20 h-1 bg-secondary-container"></div>
            </div>
            <Link
              href="/menu"
              className="font-dm-sans font-bold text-secondary-container underline decoration-2 underline-offset-8 transition-colors hover:text-primary"
            >
              View All Menu
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 md:h-[600px] items-center">
            {craftedListItems.map((item) => (
              <article
                key={item.title}
                style={item.style}
                className={`crafted-card overflow-hidden rounded-lg shadow-2xl ${item.cardClassName} ${item.title === "The Heritage Platter" ? "middle-card" : ""}`}
              >
                <img
                  alt={item.title}
                  className={`w-full object-cover ${item.imageClassName}`}
                  src={item.image}
                />
                <div className="crafted-card-body p-8">
                  <h3 className="font-headline font-bold text-2xl text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-stone-400 font-body mb-6">
                    {item.description}
                  </p>
                  <span className="text-secondary-container font-headline font-bold text-xl">
                    {item.price}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        ref={processRef}
        initial={{ opacity: 0, y: 40 }}
        animate={isProcessInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
        className="bg-zinc-950 text-white py-16 md:py-20 px-6 md:px-6 font-body"
      >
        <div className="md:hidden max-w-7xl mx-auto mb-10 text-center text-white">
          <span className="font-dm-sans text-[10px] text-primary font-black uppercase tracking-widest mb-1 block">
            Process
          </span>
          <h2 className="font-headline text-3xl font-black uppercase tracking-tighter text-white">
            How We Serve
          </h2>
        </div>

        <div className="max-w-7xl mx-auto md:grid md:grid-cols-3 md:gap-16 md:text-center space-y-4 md:space-y-0">
          <div className="flex md:flex-col items-center md:items-center p-6 md:p-0 bg-surface text-on-surface md:bg-transparent md:text-white border border-surface-container-high md:border-none gap-6 md:gap-0 h-full">
            <div className="text-4xl md:text-6xl font-light text-primary/20 md:text-primary/40 md:mb-4 font-newsreader leading-none">
              01
            </div>
            <div>
              <h4 className="text-xs md:text-xl font-bold md:font-bold uppercase tracking-wider md:tracking-widest mb-1 md:mb-2 text-on-surface md:text-white">
                Select Heritage
              </h4>
              <p className="text-[11px] md:text-sm text-on-surface-variant md:text-zinc-400 font-medium">
                Choose from our curated menu of authentic Accra classics.
              </p>
            </div>
          </div>
          <div className="flex md:flex-col items-center md:items-center p-6 md:p-0 bg-surface text-on-surface md:bg-transparent md:text-white border border-surface-container-high md:border-none gap-6 md:gap-0 h-full">
            <div className="text-4xl md:text-6xl font-light text-primary/20 md:text-primary/40 md:mb-4 font-newsreader leading-none">
              02
            </div>
            <div>
              <h4 className="text-xs md:text-xl font-bold md:font-bold uppercase tracking-wider md:tracking-widest mb-1 md:mb-2 text-on-surface md:text-white">
                Firewood Prep
              </h4>
              <p className="text-[11px] md:text-sm text-on-surface-variant md:text-zinc-400 font-medium">
                Traditional methods ensure the smoky flavor of history.
              </p>
            </div>
          </div>
          <div className="flex md:flex-col items-center md:items-center p-6 md:p-0 bg-surface text-on-surface md:bg-transparent md:text-white border border-surface-container-high md:border-none gap-6 md:gap-0 h-full">
            <div className="text-4xl md:text-6xl font-light text-primary/20 md:text-primary/40 md:mb-4 font-newsreader leading-none">
              03
            </div>
            <div>
              <h4 className="text-xs md:text-xl font-bold md:font-bold uppercase tracking-wider md:tracking-widest mb-1 md:mb-2 text-on-surface md:text-white">
                Accra Wide
              </h4>
              <p className="text-[11px] md:text-sm text-on-surface-variant md:text-zinc-400 font-medium">
                Meal arrives hot and fresh in sustainable packaging.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        ref={aboutRef}
        initial={{ opacity: 0, y: 40 }}
        animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
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
              <p className="text-white text-4xl font-black font-newsreader">
                Est.
              </p>
              <p className="text-white text-5xl font-black tracking-tighter font-headline">
                2020
              </p>
            </div>
          </div>
          <div className="px-6 py-10 md:py-0 text-center md:text-left">
            <div className="w-12 md:w-20 h-1 bg-primary mb-6 md:mb-8 mx-auto md:mx-0"></div>
            <h2 className="font-headline text-3xl md:text-6xl font-black tracking-tighter uppercase leading-tight mb-4 md:mb-10 text-on-surface">
              <span className="md:hidden">Preserving the Flame</span>
              <span className="hidden md:inline">Serving Heritage Since Day One</span>
            </h2>
            <div className="space-y-6 text-xs md:text-lg text-on-surface-variant md:text-zinc-700 leading-relaxed max-w-xs md:max-w-none mx-auto md:mx-0">
              <p className="md:hidden">
                Komi Heritage is a living archive of Ghanaian culinary art. We
                celebrate street-side cooking, elevating it with premium
                ingredients while keeping the soul of the recipe intact.
              </p>
              <p className="hidden md:block">
                Komi Heritage was born from a simple desire: to elevate the humble
                Kenkey into a gourmet experience that respects the Ga tradition
                while embracing the energy of modern Accra.
              </p>
              <p className="hidden md:block">
                Every ball of kenkey is hand-wrapped, every pepper sauce is
                slow-cooked for hours, and every piece of fish is sourced fresh
                from the coast. This is not just street food&apos;it&apos;s a tribute to
                our ancestors&apos; kitchen.
              </p>
            </div>

            <Link
              href="/"
              className="mt-8 md:mt-12 group inline-flex md:flex justify-center md:justify-start items-center gap-2 md:gap-4 text-primary font-bold uppercase tracking-widest text-[10px] md:text-sm"
            >
              Explore Our Story
              <ArrowRight
                className="group-hover:translate-x-2 transition-transform"
                size={16}
              />
            </Link>
          </div>
        </div>
      </motion.section>

      <section className="relative bg-[#111111] py-24 md:py-32 text-center overflow-hidden">
        <div className="grain-texture absolute inset-0"></div>
        <div className="relative z-10 px-6">
          <h2 className="font-headline text-5xl md:text-8xl font-extrabold tracking-tighter text-white mb-10 md:mb-12">
            READY TO ORDER?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {!isAuthenticated && (
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-2xl bg-primary px-10 py-5 font-dm-sans text-lg font-bold uppercase tracking-[0.22em] text-white shadow-xl shadow-primary/25 transition-all hover:-translate-y-1 hover:bg-primary-container active:scale-95"
              >
                Create Account
              </Link>
            )}
            <Link
              href="/menu"
              className="inline-flex items-center justify-center rounded-2xl border-2 border-secondary-container px-10 py-5 font-dm-sans text-lg font-bold uppercase tracking-[0.22em] text-secondary-container transition-all hover:-translate-y-1 hover:bg-secondary-container hover:text-[#111111]"
            >
              View Menu
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
