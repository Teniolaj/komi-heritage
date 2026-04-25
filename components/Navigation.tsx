"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Menu, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clearAuthTransition, startAuthTransition } from "@/lib/auth-transition";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

/** Returns up to 2 uppercase initials from a display name or email. */
function getInitials(user: User): string {
  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    "";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
  ];

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    handleScroll();

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isAuthenticated = !!user;
  const initials = user ? getInitials(user) : "";

  async function handleSignOut() {
    const supabase = createClient();
    startAuthTransition("signing-out");

    const { error } = await supabase.auth.signOut();
    if (error) {
      clearAuthTransition();
      return;
    }

    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
    router.refresh();

    if (pathname === "/account") {
      router.push("/");
    }
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[60] flex justify-between items-center px-4 md:px-6 py-3 md:py-4 transition-all duration-500 ease-in-out border-b ${
          scrolled
            ? "bg-surface/90 backdrop-blur-md border-surface-container shadow-sm"
            : "bg-surface/0 backdrop-blur-none border-transparent shadow-none py-4 md:py-5"
        }`}
      >
        <button
          onClick={toggleMenu}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-2xl text-primary active-tap"
        >
          <Menu size={24} />
        </button>

        <Link
          href="/"
          className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-black tracking-tighter text-primary uppercase font-headline"
        >
          <img
            src="/logo.jpg"
            alt="Komi Heritage Logo"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover shadow-sm border border-surface-container"
          />
          Komi Heritage
        </Link>

        <div className="hidden md:flex items-center space-x-8 font-dm-sans">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`nav-link text-on-surface font-bold transition-colors duration-300 ${
                pathname === link.href ? "active text-primary" : "hover:text-primary"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {!isAuthenticated && (
            <Link
              href="/signup"
              className="cta-sheen hidden md:inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 font-dm-sans text-xs font-black uppercase tracking-[0.22em] text-on-primary shadow-lg shadow-primary/20 transition-transform duration-300 hover:-translate-y-0.5"
            >
              Sign Up
            </Link>
          )}

          {isAuthenticated && (
            <>
              <Link
                href="/menu?cart=open"
                className="w-10 h-10 flex items-center justify-center text-primary active-tap transition-colors hover:bg-primary/5 rounded-full"
              >
                <ShoppingCart size={24} />
              </Link>

              <div ref={profileMenuRef} className="relative hidden md:block">
                <button
                  type="button"
                  title={user?.email}
                  aria-haspopup="menu"
                  aria-expanded={isProfileMenuOpen}
                  aria-label="Open profile menu"
                  onClick={() => setIsProfileMenuOpen((open) => !open)}
                  className="flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-200 hover:scale-[1.03]"
                >
                  <span className="flex h-11 w-11 rounded-full border-2 border-primary items-center justify-center bg-primary text-on-primary font-dm-sans font-black text-[13px] uppercase overflow-hidden shadow-sm">
                    {user?.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt={initials}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      initials
                    )}
                  </span>
                </button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 top-[calc(100%+0.75rem)] w-56 overflow-hidden rounded-3xl border border-surface-container bg-surface/95 p-2 shadow-2xl backdrop-blur-xl"
                    >
                      <div className="border-b border-surface-container px-4 py-3">
                        <p className="text-[11px] font-dm-sans font-black uppercase tracking-[0.22em] text-primary/70">
                          Signed in
                        </p>
                        <p className="mt-1 truncate font-dm-sans text-sm font-bold text-on-surface">
                          {user?.email}
                        </p>
                      </div>

                      <div className="pt-2">
                        <Link
                          href="/account"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center rounded-2xl px-4 py-3 font-dm-sans text-sm font-bold text-on-surface transition-colors duration-200 hover:bg-primary/5 hover:text-primary"
                        >
                          Account
                        </Link>
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-dm-sans text-sm font-bold text-[#9F1D23] transition-colors duration-200 hover:bg-[#9F1D23]/8"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/account"
                className="md:hidden flex w-10 h-10 rounded-full border-2 border-primary items-center justify-center bg-primary text-on-primary font-dm-sans font-black text-[13px] uppercase overflow-hidden"
              >
                {user?.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={initials}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  initials
                )}
              </Link>
            </>
          )}
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[70] bg-surface flex flex-col md:hidden"
          >
            <div className="flex justify-between items-center px-4 py-3 border-b border-surface-container">
              <span className="text-xl font-black tracking-tighter text-primary uppercase font-headline">
                Menu
              </span>
              <button
                onClick={toggleMenu}
                className="w-10 h-10 flex items-center justify-center rounded-2xl text-on-surface active-tap"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 flex flex-col pt-8 px-6 gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={toggleMenu}
                    className="text-3xl font-black uppercase tracking-tighter text-on-surface font-headline"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <div className="mt-auto pb-12 flex flex-col gap-4 font-dm-sans">
                {isAuthenticated ? (
                  <button
                    onClick={handleSignOut}
                    className="w-full rounded-2xl border-2 border-primary text-primary font-bold px-6 py-4 text-center uppercase tracking-widest active-tap"
                  >
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={toggleMenu}
                      className="w-full rounded-2xl border-2 border-primary text-primary font-bold px-6 py-4 text-center uppercase tracking-widest active-tap"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={toggleMenu}
                      className="cta-sheen w-full rounded-2xl bg-primary text-on-primary font-bold px-6 py-4 text-center uppercase tracking-widest active-tap border-b-2 border-[#8B1A1E]"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
