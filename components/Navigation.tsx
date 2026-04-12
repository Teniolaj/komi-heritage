"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
  ];

  // Dummy authentication state (replace with actual backend auth check)
  const isAuthenticated = false;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[60] flex justify-between items-center px-4 md:px-6 py-3 md:py-4 bg-surface/90 backdrop-blur-md border-b border-surface-container shadow-sm">
        {/* Mobile Hamburger */}
        <button onClick={toggleMenu} className="md:hidden w-10 h-10 flex items-center justify-center text-on-surface active-tap">
          <Menu size={24} />
        </button>

        <Link href="/" className="text-xl md:text-2xl font-black tracking-tighter text-primary uppercase font-headline">
          Komi Heritage
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 font-dm-sans">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`nav-link text-on-surface font-bold transition-colors duration-300 ${pathname === link.href ? 'active text-primary' : 'hover:text-primary'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {isAuthenticated && (
            <>
              <Link href="/checkout" className="w-10 h-10 flex items-center justify-center text-primary active-tap transition-colors hover:bg-primary/5 rounded-full">
                <ShoppingCart size={24} />
              </Link>
              
              <Link href="/login" className="hidden md:block w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
                 <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhP4gI7-h3RK2aShKVIXxxA2qBmIKJ9kMPOx3w1mYyY5GCM4khYvmthSIkXfw0_6NA1Upd5PxAOMkCLurfdQ0sbILp2BY7FOrKz6y9BtHqcHNIE-ZSF7ER4DCK5qsPR3LPGB7qIyvfiOSEcEfPOSm8dIGNdtofhKkm3IswkbHDPYtmLbktcvK284oLrcMIp-SYi-Bau1SuZWuM3GEhVPoWOsV8JymW6RP_M6rJ90yu2B11nNBB9OgL6G7hnY-hF4fjuWqRBGZZt2c" alt="User" className="w-full h-full object-cover" />
              </Link>
              <Link href="/login" className="md:hidden w-10 h-10 bg-surface-container-high flex items-center justify-center active-tap">
                <User size={24} />
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu Slide-in from Left */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[70] bg-surface flex flex-col md:hidden"
          >
            <div className="flex justify-between items-center px-4 py-3 border-b border-surface-container">
              <span className="text-xl font-black tracking-tighter text-primary uppercase font-headline">
                Menu
              </span>
              <button onClick={toggleMenu} className="w-10 h-10 flex items-center justify-center text-on-surface active-tap">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 flex flex-col pt-8 px-6 gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (i * 0.05) }}
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
                <Link href="/login" onClick={toggleMenu} className="w-full border-2 border-primary text-primary font-bold px-6 py-4 text-center uppercase tracking-widest active-tap">
                  Sign In
                </Link>
                <Link href="/signup" onClick={toggleMenu} className="w-full bg-primary text-on-primary font-bold px-6 py-4 text-center uppercase tracking-widest active-tap border-b-2 border-[#8B1A1E]">
                  Create Account
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
