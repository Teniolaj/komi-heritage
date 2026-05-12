"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowRight, Lock, Minus, Plus, ShoppingBag, X } from "lucide-react";

import { PageWrapper } from "@/components/PageWrapper";
import { PrimaryButton } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import type { MenuItem, MenuItemExtra } from "@/lib/types";

type CartItem = MenuItem & {
  cartItemId: string;
  quantity: number;
  selectedExtras: { name: string; price: number; quantity: number }[];
};

const DEFAULT_EXTRAS = [
  { id: "def-fish", name: "Fried Fish", price: 15, is_available: true },
  { id: "def-egg", name: "Fried Egg", price: 5, is_available: true },
  { id: "def-sausage", name: "Sausage", price: 10, is_available: true },
  { id: "def-shrimps", name: "Shrimps", price: 20, is_available: true },
  { id: "def-octopus", name: "Octopus", price: 25, is_available: true },
];

function MenuItemCard({
  item,
  onAddToCart,
}: {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity: number, extras: { name: string; price: number; quantity: number }[]) => void;
}) {
  const [phase, setPhase] = useState<"idle" | "quantity" | "extras">("idle");
  const [quantity, setQuantity] = useState(1);
  const [extraQuantities, setExtraQuantities] = useState<Record<string, number>>({});

  const availableExtras = [
    ...(item.extras?.filter((e) => e.is_available) || []),
    ...DEFAULT_EXTRAS
  ];
  const hasExtras = availableExtras.length > 0;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhase("extras");
  };

  const confirmOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const selectedExtras = availableExtras
      .filter((extra) => extraQuantities[extra.id] > 0)
      .map((extra) => ({
        name: extra.name,
        price: Number(extra.price),
        quantity: extraQuantities[extra.id],
      }));
    onAddToCart(item, quantity, selectedExtras);
    setPhase("idle");
    setQuantity(1);
    setExtraQuantities({});
  };

  const updateExtraQty = (extraId: string, delta: number) => {
    setExtraQuantities((prev) => {
      const current = prev[extraId] || 0;
      return { ...prev, [extraId]: Math.max(0, current + delta) };
    });
  };

  return (
    <motion.div variants={itemVariants}>
      <motion.div
        initial="initial"
        whileHover={phase === "idle" ? "hovered" : "initial"}
        animate="initial"
        variants={{
          initial: { y: 0, boxShadow: "0 0px 0px rgba(0,0,0,0)" },
          hovered: {
            y: -4,
            boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
            transition: { type: "spring", stiffness: 300, damping: 20 },
          },
        }}
        className="group relative z-0 flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-surface-container-high bg-surface p-1 md:p-[5px]"
        onClick={() => {
          if (phase === "idle") {
            setPhase("quantity");
          }
        }}
      >
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-xl">
          <motion.div className="absolute bottom-0 left-1/2 h-[2px] bg-[#D4AF37]" variants={{ initial: { width: 0 }, hovered: { width: "50%", transition: { duration: 0.1, ease: "linear" } } }} />
          <motion.div className="absolute bottom-0 right-0 w-[2px] bg-[#D4AF37]" variants={{ initial: { height: 0 }, hovered: { height: "100%", transition: { duration: 0.25, delay: 0.1, ease: "linear" } } }} />
          <motion.div className="absolute right-0 top-0 h-[2px] bg-[#D4AF37]" variants={{ initial: { width: 0 }, hovered: { width: "50%", transition: { duration: 0.1, delay: 0.35, ease: "linear" } } }} />
          <motion.div className="absolute bottom-0 right-1/2 h-[2px] bg-[#D4AF37]" variants={{ initial: { width: 0 }, hovered: { width: "50%", transition: { duration: 0.1, ease: "linear" } } }} />
          <motion.div className="absolute bottom-0 left-0 w-[2px] bg-[#D4AF37]" variants={{ initial: { height: 0 }, hovered: { height: "100%", transition: { duration: 0.25, delay: 0.1, ease: "linear" } } }} />
          <motion.div className="absolute left-0 top-0 h-[2px] bg-[#D4AF37]" variants={{ initial: { width: 0 }, hovered: { width: "50%", transition: { duration: 0.1, delay: 0.35, ease: "linear" } } }} />
        </div>

        <div className="relative mb-4 h-64 w-full shrink-0 overflow-hidden rounded-lg bg-surface-container-low md:h-[280px]">
          <motion.div whileHover={{ scale: phase === "idle" ? 1.05 : 1 }} transition={{ duration: 0.4, ease: "easeOut" }} className="h-full w-full">
            <MenuItemVisual
              imageUrl={item.image_url}
              name={item.name}
              className={`h-full w-full object-cover transition-transform duration-700 ${phase === "idle" ? "md:group-hover:scale-110" : ""}`}
              textClassName="font-headline text-5xl font-black text-white"
            />
          </motion.div>
          <span className="absolute left-2 top-2 bg-secondary px-2 py-1 font-dm-sans text-[9px] font-bold uppercase tracking-widest text-on-secondary md:left-4 md:top-4 md:px-3 md:text-[10px]">
            {item.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col px-3 pb-3 md:px-5 md:py-6 relative z-10">
          <div className="mb-2 flex flex-col items-start font-headline md:mb-3 md:flex-row md:justify-between">
            <h3 className="mb-1 text-lg font-bold leading-tight text-on-surface md:mb-0 md:text-2xl">
              {item.name}
            </h3>
            <span className="ml-0 whitespace-nowrap font-dm-sans text-sm font-bold text-secondary md:ml-4 md:text-base">
              {formatPrice(Number(item.price))}
            </span>
          </div>
          <p className="hidden font-body text-sm leading-relaxed text-stone-500 md:block">
            {item.description ?? "A signature heritage plate from the kitchen archive."}
          </p>

          <div className="relative z-10 mt-auto hidden space-y-4 pt-4 md:block">
            <PrimaryButton className="w-full border-b-0 py-4 text-xs shadow-none" onClick={(e) => { e.stopPropagation(); setPhase("quantity"); }}>
              Add to Cart
            </PrimaryButton>
          </div>

          <div className="relative z-10 mt-auto flex justify-end md:hidden">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-transform active:scale-90" onClick={(e) => { e.stopPropagation(); setPhase("quantity"); }}>
              <span className="mb-1 font-dm-sans text-2xl font-light">+</span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {phase === "quantity" && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 z-30 flex h-[50%] flex-col rounded-t-2xl border-t border-surface-container-high bg-surface p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-headline text-lg font-bold text-on-surface">Quantity</h4>
                <button onClick={(e) => { e.stopPropagation(); setPhase("idle"); }} className="rounded-full bg-surface-container p-1 text-on-surface hover:bg-surface-container-high">
                  <X size={16} />
                </button>
              </div>
              <div className="mb-auto flex items-center justify-center gap-6">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant transition-colors hover:bg-surface-container active:bg-surface-container-high"><Minus size={16} /></button>
                <span className="w-8 text-center font-dm-sans text-2xl font-black">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant transition-colors hover:bg-surface-container active:bg-surface-container-high"><Plus size={16} /></button>
              </div>
              <PrimaryButton onClick={handleNext} className="w-full py-3 text-xs uppercase tracking-widest">Next: Choose Extras</PrimaryButton>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === "extras" && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute inset-0 z-40 flex flex-col bg-surface p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between border-b border-surface-container-high pb-3">
                <h4 className="font-headline text-lg font-bold text-on-surface">Add Extras</h4>
                <button onClick={(e) => { e.stopPropagation(); setPhase("quantity"); }} className="rounded-full bg-surface-container p-1 text-on-surface hover:bg-surface-container-high">
                  <X size={16} />
                </button>
              </div>
              <div className="hide-scrollbar mb-4 flex-1 space-y-4 overflow-y-auto">
                {availableExtras.map((extra) => {
                  const qty = extraQuantities[extra.id] || 0;
                  return (
                    <div key={extra.id} className="flex items-center justify-between">
                      <div>
                        <span className="block font-dm-sans text-sm font-bold text-on-surface">{extra.name}</span>
                        <span className="font-dm-sans text-xs text-secondary">+{formatPrice(Number(extra.price))}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={(e) => { e.stopPropagation(); updateExtraQty(extra.id, -1); }} className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${qty > 0 ? "border-outline-variant hover:bg-surface-container" : "border-transparent opacity-50"}`} disabled={qty === 0}><Minus size={14} /></button>
                        <span className="w-4 text-center font-dm-sans text-sm font-bold">{qty}</span>
                        <button onClick={(e) => { e.stopPropagation(); updateExtraQty(extra.id, 1); }} className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant transition-colors hover:bg-surface-container"><Plus size={14} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-auto border-t border-surface-container-high pt-4">
                <PrimaryButton onClick={confirmOrder} className="w-full py-4 text-xs">Confirm & Add to Cart</PrimaryButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}


const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

function formatPrice(price: number) {
  return `GH₵${Number(price).toFixed(2)}`;
}

function getItemInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function MenuItemVisual({
  imageUrl,
  name,
  className,
  textClassName,
}: {
  imageUrl: string | null;
  name: string;
  className: string;
  textClassName?: string;
}) {
  if (imageUrl) {
    return <img src={imageUrl} alt={name} className={className} />;
  }

  return (
    <div
      className={`${className} flex items-center justify-center bg-gradient-to-br from-stone-900 via-stone-700 to-stone-500`}
    >
      <span className={textClassName ?? "font-headline text-3xl font-black text-white"}>
        {getItemInitials(name)}
      </span>
    </div>
  );
}

export default function MenuPageClient({ menuItems }: { menuItems: MenuItem[] }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [fulfillmentType, setFulfillmentType] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const shouldOpenCart = window.location.search.includes("cart=open");
    const savedCart = localStorage.getItem("komiCart");
    const savedFulfillment = localStorage.getItem("komiCartFulfillment");

    queueMicrotask(() => {
      if (shouldOpenCart) {
        setShowMobileCart(true);
      }

      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch {}
      }

      if (savedFulfillment === "delivery" || savedFulfillment === "pickup") {
        setFulfillmentType(savedFulfillment);
      }

      setIsCartLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!isCartLoaded) {
      return;
    }

    localStorage.setItem("komiCart", JSON.stringify(cartItems));
    localStorage.setItem("komiCartFulfillment", fulfillmentType);
    window.dispatchEvent(new Event("cart-updated"));
  }, [cartItems, fulfillmentType, isCartLoaded]);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => setIsAuthenticated(Boolean(data.user)));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session?.user));
    });

    return () => subscription.unsubscribe();
  }, []);

  const addToCart = (item: MenuItem, quantity: number, selectedExtras: { name: string; price: number; quantity: number }[]) => {
    setCartItems((prev) => {
      const previousItems = Array.isArray(prev) ? prev : [];
      const sortedExtras = [...selectedExtras].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      const extrasHash = JSON.stringify(sortedExtras);
      const cartItemId = `${item.id}-${extrasHash}`;

      const existingItemIndex = previousItems.findIndex((entry) => entry.cartItemId === cartItemId);

      if (existingItemIndex !== -1) {
        const newItems = [...previousItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
        };
        return newItems;
      }

      return [...previousItems, { ...item, cartItemId, quantity, selectedExtras }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((previousItems) => previousItems.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => setCartItems([]);

  const subtotal = cartItems.reduce(
    (sum, item) => {
      const extrasTotal = item.selectedExtras?.reduce((s, e) => s + (Number(e.price) * e.quantity), 0) ?? 0;
      return sum + (Number(item.price) + extrasTotal) * item.quantity;
    },
    0,
  );
  const heritageFee = subtotal > 0 ? 12 : 0;
  const total = subtotal + heritageFee;

  return (
    <PageWrapper>
      <section className="relative -mt-[72px] flex h-[292px] items-center justify-center overflow-hidden bg-black p-6 pt-[72px] md:-mt-[80px] md:h-[540px] md:items-center md:justify-center md:p-0 md:pt-[80px]">
        <img
          className="absolute inset-0 h-full w-full object-cover brightness-50 grayscale md:brightness-100"
          alt="Menu hero"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLWLr7RVO-lvUC-IdkXxyCiAaBbwIHTOsKByHz6vCiSWJLPkxvqH6oFUjbaXNvPkKV_1V3dBZPAYErtTGoaVfwBaQBghlHytJCkR7GAQTZv1UYYf3iq7eFPHFZ4-JChZXLw5dL2DtrmYp8Tg-wDtiGz4puWn6AUso113F-QtKFgXeNNC5mQdD3SpJl16Wuxm9IV_JPSvwrOxQNHwbOqg0mYNG3m3lutyY2TeCP05uQccPhaMzW0ZjLOCUUfhYX-1oTSCUjSUWFM6s"
        />
        <div className="absolute inset-0 hidden bg-on-surface/40 md:block"></div>
        <div className="relative z-10 w-full text-center md:px-4">
          <span className="mb-1 block font-dm-sans text-[10px] uppercase tracking-widest text-secondary-container md:mb-2 md:text-sm md:font-bold">
            The Heritage Kitchen
          </span>
          <h1 className="mb-0 font-headline text-5xl font-extrabold uppercase leading-none tracking-tighter text-white md:mb-4 md:text-7xl md:tracking-tighter lg:text-9xl">
            THE MENU
          </h1>
          <p className="mx-auto hidden max-w-xl font-body text-xl text-surface-container-highest md:block md:text-2xl">
            Choose your combo. We&apos;ll handle the rest.
          </p>
        </div>
      </section>

      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="mx-auto mt-4 w-full max-w-6xl flex-1 px-6 pb-32 md:mt-12 md:px-6 md:pb-20 lg:px-12">
          {menuItems.length === 0 ? (
            <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-surface-container-high bg-surface-container-lowest p-10 text-center">
              <div>
                <p className="font-dm-sans text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">
                  Menu Update Pending
                </p>
                <h2 className="mt-4 font-headline text-3xl font-black text-on-surface">
                  No menu items are live yet.
                </h2>
                <p className="mt-3 font-body text-sm text-on-surface-variant">
                  Check back shortly while the kitchen publishes the next drop.
                </p>
              </div>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-4 bg-surface-container-highest/20 px-6 pt-4 md:mx-0 md:grid-cols-2 md:gap-12 md:bg-transparent md:px-0 md:pt-0 lg:grid-cols-3"
            >
              {menuItems.map((item) => (
                <MenuItemCard key={item.id} item={item} onAddToCart={addToCart} />
              ))}

              <motion.div
                variants={itemVariants}
                className="group flex flex-col items-center justify-center border-2 border-dashed border-stone-200 bg-surface p-8"
              >
                <span className="mb-4 font-dm-sans text-4xl text-stone-300 md:text-6xl">
                  +
                </span>
                <h3 className="text-center font-headline text-lg font-bold text-stone-400 md:text-xl">
                  More Soon
                </h3>
                <p className="mt-2 hidden text-center text-xs text-stone-400 md:block md:text-sm">
                  New seasonal recipes from the archives.
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>

        <aside className="relative hidden h-[calc(100vh-80px)] w-[400px] border-l border-stone-200/40 bg-surface-container-low p-8 lg:sticky lg:top-[80px] lg:block">
          {!isAuthenticated && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center border-l border-stone-200/40 bg-surface/80 backdrop-blur-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-stone-200/40 bg-surface-container text-stone-400">
                <Lock size={24} />
              </div>
              <p className="mb-2 font-headline text-xl font-bold text-on-surface">
                Sign in to order
              </p>
              <Link href="/login">
                <PrimaryButton className="px-8 py-3 text-sm shadow-sm">Login</PrimaryButton>
              </Link>
            </div>
          )}
          <div
            className={`flex h-full flex-col ${!isAuthenticated ? "pointer-events-none opacity-20" : ""}`}
          >
            <div className="mb-8 flex items-baseline justify-between">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">
                Your Order
              </h2>
              {cartItems.length > 0 && (
                <button
                  onClick={clearCart}
                  className="font-dm-sans text-[10px] font-bold uppercase tracking-widest text-stone-400 transition-colors hover:text-primary"
                >
                  Clear Cart
                </button>
              )}
            </div>

            <div className="mb-6 flex rounded-sm border border-surface-container-high bg-surface p-1 font-dm-sans">
              <button
                onClick={() => setFulfillmentType("delivery")}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
                  fulfillmentType === "delivery"
                    ? "bg-primary text-on-primary"
                    : "text-stone-500 hover:bg-surface-container"
                }`}
              >
                Delivery
              </button>
              <button
                onClick={() => setFulfillmentType("pickup")}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
                  fulfillmentType === "pickup"
                    ? "bg-primary text-on-primary"
                    : "text-stone-500 hover:bg-surface-container"
                }`}
              >
                Pickup
              </button>
            </div>

            <div className="hide-scrollbar mb-8 flex-1 space-y-6 overflow-y-auto pr-2">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center space-y-4 text-stone-400">
                  <ShoppingBag size={48} className="opacity-20" />
                  <p className="font-dm-sans text-sm">Your cart is empty</p>
                </div>
              ) : (
                cartItems.map((item) => {
                  const extrasTotal = item.selectedExtras?.reduce((sum, e) => sum + (Number(e.price) * e.quantity), 0) ?? 0;
                  const itemTotal = (Number(item.price) + extrasTotal) * item.quantity;

                  return (
                    <div key={item.cartItemId} className="flex gap-4">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-surface-container">
                        <MenuItemVisual
                          imageUrl={item.image_url}
                          name={item.name}
                          className="h-full w-full object-cover"
                          textClassName="font-headline text-sm font-black text-white"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <div className="flex justify-between font-headline text-sm font-bold">
                          <h4 className="pr-2 leading-tight">{item.name}</h4>
                          <span className="shrink-0">{formatPrice(itemTotal)}</span>
                        </div>
                        {item.selectedExtras && item.selectedExtras.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.selectedExtras.map((extra, idx) => (
                              <span
                                key={idx}
                                className="font-dm-sans text-[9px] font-bold uppercase tracking-widest text-secondary"
                              >
                                + {extra.quantity}x {extra.name}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="mt-2 flex items-center gap-4 font-dm-sans text-xs text-stone-400">
                          <span>Qty: {item.quantity}</span>
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-[10px] font-bold uppercase text-red-500/80 transition-colors hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="space-y-4 border-t border-stone-200/40 pt-6">
              <div className="flex justify-between font-body text-sm text-stone-500">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between font-body text-sm text-stone-500">
                <span>Heritage Fee</span>
                <span>{formatPrice(heritageFee)}</span>
              </div>
              <div className="flex justify-between pt-4 font-headline text-xl font-bold text-on-surface">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
              <Link
                href="/checkout"
                className="block"
                onClick={(event) => {
                  if (cartItems.length === 0) {
                    event.preventDefault();
                  }
                }}
              >
                <PrimaryButton
                  className={`w-full gap-3 border-0 py-5 text-sm ${cartItems.length === 0 ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </PrimaryButton>
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {isAuthenticated ? (
        <div
          className="fixed bottom-6 left-4 right-4 z-40 flex h-14 cursor-pointer items-center overflow-hidden rounded-full border border-[#404040] bg-[#31302d] pl-5 pr-0 text-white shadow-xl lg:hidden"
          onClick={() => setShowMobileCart(true)}
        >
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} />
            <motion.span
              key={cartItems.length}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="font-dm-sans text-sm font-bold"
            >
              {cartItems.length} ITEM{cartItems.length !== 1 && "S"}
            </motion.span>
          </div>
          <div className="mx-auto h-4 w-px bg-white/20"></div>
          <span className="font-dm-sans text-sm font-bold">{formatPrice(total)}</span>
          <div className="ml-auto flex h-full items-center gap-2 bg-primary px-6 font-dm-sans text-xs font-bold uppercase tracking-wider text-white">
            View Cart <ArrowRight size={16} />
          </div>
        </div>
      ) : (
        <div className="fixed bottom-6 left-4 right-4 z-40 flex h-14 items-center overflow-hidden rounded-full border border-stone-200/40 bg-surface-container/90 pl-5 pr-0 text-on-surface shadow-xl backdrop-blur-md lg:hidden">
          <div className="flex items-center gap-3 text-stone-500">
            <Lock size={18} />
            <span className="font-dm-sans text-sm font-bold text-on-surface">
              Sign in to order
            </span>
          </div>
          <Link
            href="/login"
            className="ml-auto flex h-full items-center gap-2 bg-primary px-8 font-dm-sans text-xs font-bold uppercase tracking-wider text-white"
          >
            Login
          </Link>
        </div>
      )}



      <AnimatePresence>
        {showMobileCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setShowMobileCart(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="flex h-[90vh] w-full flex-col bg-surface"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex shrink-0 items-center justify-between border-b border-surface-container-high p-4">
                <h2 className="font-headline text-xl font-bold text-on-surface">Your Order</h2>
                <div className="flex items-center gap-4">
                  {cartItems.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-primary"
                    >
                      Clear Cart
                    </button>
                  )}
                  <button
                    onClick={() => setShowMobileCart(false)}
                    className="rounded-full bg-surface-container p-2 text-on-surface"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="flex shrink-0 border-b border-surface-container-high bg-surface p-4 font-dm-sans">
                <button
                  onClick={() => setFulfillmentType("delivery")}
                  className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
                    fulfillmentType === "delivery"
                      ? "bg-primary text-on-primary"
                      : "text-stone-500 hover:bg-surface-container"
                  }`}
                >
                  Delivery
                </button>
                <button
                  onClick={() => setFulfillmentType("pickup")}
                  className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
                    fulfillmentType === "pickup"
                      ? "bg-primary text-on-primary"
                      : "text-stone-500 hover:bg-surface-container"
                  }`}
                >
                  Pickup
                </button>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto p-4">
                {cartItems.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center space-y-4 text-stone-400">
                    <ShoppingBag size={48} className="opacity-20" />
                    <p className="font-dm-sans text-sm">Your cart is empty</p>
                  </div>
                ) : (
                  cartItems.map((item) => {
                    const extrasTotal = item.selectedExtras?.reduce((sum, e) => sum + (Number(e.price) * e.quantity), 0) ?? 0;
                    const itemTotal = (Number(item.price) + extrasTotal) * item.quantity;

                    return (
                      <div key={item.cartItemId} className="flex gap-4">
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-surface-container">
                          <MenuItemVisual
                            imageUrl={item.image_url}
                            name={item.name}
                            className="h-full w-full object-cover"
                            textClassName="font-headline text-lg font-black text-white"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-center">
                          <div className="flex justify-between font-headline text-sm font-bold">
                            <h4 className="pr-2 leading-tight">{item.name}</h4>
                            <span className="shrink-0">{formatPrice(itemTotal)}</span>
                          </div>
                          {item.selectedExtras && item.selectedExtras.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {item.selectedExtras.map((extra, idx) => (
                                <span
                                  key={idx}
                                  className="font-dm-sans text-[9px] font-bold uppercase tracking-widest text-secondary"
                                >
                                  + {extra.quantity}x {extra.name}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="mt-2 flex items-center gap-4 font-dm-sans text-xs text-stone-400">
                            <span>Qty: {item.quantity}</span>
                            <button
                              onClick={() => removeFromCart(item.cartItemId)}
                              className="text-[10px] font-bold uppercase text-red-500/80"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="shrink-0 space-y-3 border-t border-surface-container-high bg-surface p-4 pb-8">
                <div className="flex justify-between font-body text-sm text-stone-500">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between font-body text-sm text-stone-500">
                  <span>Heritage Fee</span>
                  <span>{formatPrice(heritageFee)}</span>
                </div>
                <div className="mb-4 mt-2 flex justify-between pt-2 font-headline text-xl font-bold text-on-surface">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
                <Link
                  href="/checkout"
                  className="block w-full"
                  onClick={(event) => {
                    if (cartItems.length === 0) {
                      event.preventDefault();
                    }
                  }}
                >
                  <PrimaryButton
                    className={`w-full gap-2 border-0 py-4 text-sm ${cartItems.length === 0 ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    Proceed to Checkout
                    <ArrowRight size={18} />
                  </PrimaryButton>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
