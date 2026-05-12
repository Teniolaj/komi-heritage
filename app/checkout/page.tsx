"use client";

import { PageWrapper } from "@/components/PageWrapper";
import { PrimaryButton } from "@/components/ui/Button";
import Link from "next/link";
import { Lock, ArrowLeft, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type CartItem = {
  id: string;
  cartItemId: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  quantity: number;
  selectedExtras: { name: string; price: number; quantity: number }[];
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

function ItemImage({ item, className }: { item: CartItem; className: string }) {
  if (item.image_url) {
    return <img className={className} src={item.image_url} alt={item.name} />;
  }
  return (
    <div className={`${className} flex items-center justify-center bg-gradient-to-br from-stone-900 via-stone-700 to-stone-500`}>
      <span className="font-headline text-lg font-black text-white">{getItemInitials(item.name)}</span>
    </div>
  );
}

export default function CheckoutPage() {
  const [fulfillment, setFulfillment] = useState<"Delivery" | "Pickup">("Delivery");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  // Form fields
  const [streetAddress, setStreetAddress] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("Accra");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState(""); // stored as raw digits only, e.g. "203907852"
  const [note, setNote] = useState("");

  // User
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Format phone for display: "203907852" → "203-907-852"
  function formatPhoneDisplay(raw: string): string {
    const digits = raw.replace(/\D/g, "").slice(0, 9);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // Handle phone input: strip dashes and non-digits, cap at 9
  function handlePhoneChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    setPhone(digits);
  }

  // Strip country code prefix from stored phone if present
  function cleanPhonePrefill(rawPhone: string): string {
    let p = rawPhone.replace(/\D/g, "");
    if (p.startsWith("233")) p = p.slice(3);
    if (p.startsWith("0")) p = p.slice(1);
    return p.slice(0, 9);
  }

  useEffect(() => {
    // Read cart from localStorage
    const savedCart = localStorage.getItem("komiCart");
    const savedFulfillment = localStorage.getItem("komiCartFulfillment");

    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch {
        // malformed cart
      }
    }

    if (savedFulfillment === "pickup") {
      setFulfillment("Pickup");
    }

    // Get user info
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserEmail(data.user.email ?? null);
        setUserId(data.user.id);
        // Pre-fill name from user metadata
        const meta = data.user.user_metadata;
        if (meta?.full_name) setFullName(meta.full_name);
        if (meta?.phone) setPhone(cleanPhonePrefill(meta.phone));
      }
    });

    setIsLoaded(true);
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => {
      const extrasTotal = item.selectedExtras?.reduce((s, e) => s + (Number(e.price) * e.quantity), 0) ?? 0;
      return sum + (Number(item.price) + extrasTotal) * item.quantity;
    },
    0,
  );
  const deliveryFee = fulfillment === "Delivery" ? 12 : 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = useCallback(async () => {
    if (isPaying || cartItems.length === 0) return;

    // Validate
    if (!fullName.trim()) {
      setPayError("Please enter your full name.");
      return;
    }
    if (phone.replace(/\D/g, "").length !== 9) {
      setPayError("Please enter a valid 9-digit phone number.");
      return;
    }
    if (fulfillment === "Delivery" && !streetAddress.trim()) {
      setPayError("Please enter your delivery address.");
      return;
    }
    if (!userEmail || !userId) {
      setPayError("You must be logged in to place an order.");
      return;
    }

    setPayError(null);
    setIsPaying(true);

    try {
      // Dynamically import Paystack Inline
      const PaystackPop = (await import("@paystack/inline-js")).default;
      const paystack = new PaystackPop();

      const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      if (!paystackKey) {
        setPayError("Payment configuration error. Please contact support.");
        setIsPaying(false);
        return;
      }

      paystack.newTransaction({
        key: paystackKey,
        email: userEmail,
        amount: Math.round(total * 100), // Paystack expects pesewas (integer)
        currency: "GHS",
        channels: ["mobile_money", "card"],
        onSuccess: async (transaction: { reference: string }) => {
          // Verify payment on server and create order (with retry for MoMo network gaps)
          const payload = JSON.stringify({
            reference: transaction.reference,
            cartItems: cartItems.map((item) => ({
              menu_item_id: item.id,
              snapshot_name: item.name,
              unit_price: Number(item.price),
              quantity: item.quantity,
              selected_extras: item.selectedExtras,
            })),
            fulfillment: fulfillment.toLowerCase(),
            address:
              fulfillment === "Delivery"
                ? [streetAddress, area, city].filter(Boolean).join(", ")
                : null,
            note: note.trim() || null,
            fullName: fullName.trim(),
            phone: `0${phone.replace(/\D/g, "")}`,
          });

          let lastError = "";
          for (let attempt = 0; attempt < 3; attempt++) {
            try {
              if (attempt > 0) {
                await new Promise((r) => setTimeout(r, 1500 * attempt));
              }

              const res = await fetch("/api/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payload,
              });

              const result = await res.json();

              if (res.ok && result.orderId) {
                // Clear cart from localStorage
                localStorage.removeItem("komiCart");
                localStorage.removeItem("komiCartFulfillment");
                // Redirect to tracking page
                window.location.href = `/orders/${result.orderId}`;
                return;
              } else {
                lastError = result.error || "Order creation failed.";
              }
            } catch {
              lastError = "Network error — retrying...";
            }
          }

          setPayError(`${lastError} Your payment was received — please contact support with ref: ${transaction.reference}`);
          setIsPaying(false);
        },
        onCancel: () => {
          setIsPaying(false);
        },
      });
    } catch {
      setPayError("Could not initialize payment. Please try again.");
      setIsPaying(false);
    }
  }, [isPaying, cartItems, fullName, phone, fulfillment, streetAddress, area, city, userEmail, userId, total, note]);

  if (!isLoaded) {
    return (
      <PageWrapper className="bg-surface font-body min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </PageWrapper>
    );
  }

  if (cartItems.length === 0 && isLoaded) {
    return (
      <PageWrapper className="bg-surface font-body min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <h1 className="font-headline text-3xl font-bold text-primary">Your Cart is Empty</h1>
          <p className="font-dm-sans text-on-surface-variant">Add some items from the menu to get started.</p>
          <Link href="/menu">
            <PrimaryButton className="px-8 py-3 text-sm mt-4">Browse Menu</PrimaryButton>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="bg-surface font-body min-h-screen">
      <div className="flex-grow max-w-7xl mx-auto w-full px-6 py-6 md:px-12 mt-2 md:mt-4 lg:mt-0 pb-48 lg:pb-12 border-t-0">
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

            {/* Mobile Order Summary */}
            <section className="lg:hidden space-y-6 bg-surface-container-low p-6 -mx-6 md:mx-0">
              <h2 className="text-xl font-headline font-bold">Order Summary</h2>
              {cartItems.map((item) => {
                const extrasTotal = item.selectedExtras?.reduce((s, e) => s + (Number(e.price) * e.quantity), 0) ?? 0;
                const itemTotal = (Number(item.price) + extrasTotal) * item.quantity;

                return (
                  <div key={item.cartItemId} className="flex gap-4 items-center">
                    <div className="w-20 h-20 bg-surface-container overflow-hidden shrink-0">
                      <ItemImage item={item} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <span className="font-dm-sans text-[9px] uppercase font-bold text-secondary tracking-widest block mb-1">{item.category}</span>
                      <h3 className="font-headline text-lg leading-tight mb-1 font-bold">{item.name}</h3>
                      {item.selectedExtras && item.selectedExtras.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-1">
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
                      <div className="flex justify-between items-end">
                        <p className="text-sm font-medium text-on-surface-variant font-dm-sans">Qty: {String(item.quantity).padStart(2, "0")}</p>
                        <p className="font-bold text-primary font-dm-sans">{formatPrice(itemTotal)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                      <input
                        className="minimalist-input bg-transparent font-dm-sans text-base md:text-lg w-full text-on-surface"
                        placeholder="12 Osu Badu Street"
                        type="text"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col space-y-2 hidden md:flex mt-4">
                      <label className="text-[10px] font-dm-sans font-bold uppercase tracking-widest text-secondary">Area</label>
                      <input
                        className="minimalist-input bg-transparent font-dm-sans text-base md:text-lg w-full text-on-surface"
                        placeholder="Airport Residential Area"
                        type="text"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col space-y-2 hidden md:flex mt-4">
                      <label className="text-[10px] font-dm-sans font-bold uppercase tracking-widest text-secondary">City</label>
                      <input
                        className="minimalist-input bg-transparent font-dm-sans text-base md:text-lg w-full text-on-surface"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
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
                    <input
                      className="minimalist-input bg-transparent font-dm-sans text-base md:text-lg w-full text-on-surface"
                      placeholder="Kwame Mensah"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] font-dm-sans font-bold uppercase tracking-widest text-secondary">Phone Number</label>
                    <div className="flex items-center border-b-2 border-outline-variant focus-within:border-primary transition-colors pb-[4px]">
                      <span className="text-base md:text-lg font-dm-sans text-on-surface-variant mr-2">0</span>
                      <input
                        className="w-full bg-transparent border-0 outline-none p-0 font-dm-sans text-base md:text-lg focus:ring-0 text-on-surface"
                        placeholder="XX-XXX-XXXX"
                        type="tel"
                        value={formatPhoneDisplay(phone)}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        maxLength={11}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Special Instructions */}
              <section className="space-y-6 mt-12 md:mt-16 pb-8 lg:pb-0 border-0">
                <h2 className="text-xl md:text-2xl font-headline border-b border-outline-variant pb-4 font-bold">Special Instructions</h2>
                <div className="flex flex-col space-y-2 mt-4 md:mt-0">
                  <label className="text-[10px] font-dm-sans font-bold uppercase tracking-widest text-secondary">Order Notes</label>
                  <textarea
                    className="bg-transparent border-0 border-b-2 border-outline-variant py-2 font-dm-sans text-base md:text-lg focus:ring-0 focus:border-primary resize-none outline-none text-on-surface"
                    placeholder="Any preferences? e.g. Extra spicy, no onions..."
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </section>
              
              {/* Mobile Price Breakdown & CTA */}
              <div className="lg:hidden space-y-8 mt-12 border-t border-outline-variant pt-8">
                <div className="space-y-4 font-dm-sans">
                  <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>Subtotal</span>
                    <span className="font-bold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>{fulfillment === "Delivery" ? "Delivery Fee" : "Heritage Fee"}</span>
                    <span className="font-bold">{formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between items-end border-t border-outline-variant/20 pt-4 mt-4">
                    <span className="font-headline font-bold text-xl uppercase tracking-tight text-on-surface">Total Payable</span>
                    <span className="font-dm-sans font-black text-3xl text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                {payError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 text-sm font-dm-sans">
                    {payError}
                  </div>
                )}

                <PrimaryButton
                  className="w-full py-5 text-sm font-bold uppercase tracking-[0.2em]"
                  onClick={handlePlaceOrder}
                  disabled={isPaying}
                >
                  {isPaying ? (
                    <span className="flex items-center gap-2 justify-center">
                      <Loader2 size={16} className="animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    "Place Order & Pay"
                  )}
                </PrimaryButton>
                
                <div className="flex justify-center items-center gap-2 font-dm-sans pb-12">
                  <Lock size={14} className="text-secondary" />
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest text-[#7a5900]">Secure Heritage Checkout</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Order Summary (40%) Desktop */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-[100px]">
            <div className="bg-surface-container p-8 space-y-8">
              <h2 className="text-3xl font-headline tracking-tighter font-bold text-on-surface">Your Order</h2>
              
              {/* Items List */}
              <div className="space-y-6 border-0">
                {cartItems.map((item) => {
                  const extrasTotal = item.selectedExtras?.reduce((s, e) => s + (Number(e.price) * e.quantity), 0) ?? 0;
                  const itemTotal = (Number(item.price) + extrasTotal) * item.quantity;

                  return (
                    <div key={item.cartItemId} className="flex gap-4">
                      <div className="w-20 h-20 flex-shrink-0 bg-surface-container-high border-0">
                        <ItemImage item={item} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow flex flex-col justify-between py-1">
                        <div>
                          <h3 className="font-headline font-bold text-base leading-tight uppercase text-on-surface">{item.name}</h3>
                          {item.selectedExtras && item.selectedExtras.length > 0 && (
                            <div className="mt-1 flex flex-col gap-0.5">
                              {item.selectedExtras.map((extra, idx) => (
                                <span
                                  key={idx}
                                  className="font-dm-sans text-[10px] font-bold uppercase tracking-widest text-secondary"
                                >
                                  + {extra.quantity}x {extra.name}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="text-xs font-dm-sans text-on-surface-variant mt-1">Qty: {String(item.quantity).padStart(2, "0")}</p>
                        </div>
                        <p className="font-dm-sans font-bold text-sm text-primary">{formatPrice(itemTotal)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-outline-variant pt-8 space-y-4">
                <div className="flex justify-between text-sm font-dm-sans font-bold text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-dm-sans font-bold text-on-surface-variant">
                  <span>{fulfillment === "Delivery" ? "Delivery Fee" : "Heritage Fee"}</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-4 border-t border-outline-variant/30 mt-4">
                  <span className="font-headline text-xl font-bold uppercase tracking-tighter text-on-surface">Total Payable</span>
                  <span className="font-dm-sans font-extrabold text-3xl text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Error Message */}
              {payError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 text-sm font-dm-sans">
                  {payError}
                </div>
              )}

              {/* CTA */}
              <PrimaryButton
                className="w-full py-5 text-sm"
                onClick={handlePlaceOrder}
                disabled={isPaying}
              >
                {isPaying ? (
                  <span className="flex items-center gap-2 justify-center">
                    <Loader2 size={16} className="animate-spin" />
                    PROCESSING...
                  </span>
                ) : (
                  "PLACE ORDER & PAY"
                )}
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
              <p className="font-headline italic text-lg text-on-surface-variant leading-relaxed">&quot;Authenticity in every grain, tradition in every flame.&quot;</p>
            </div>
          </aside>
        </div>
      </div>


    </PageWrapper>
  );
}
