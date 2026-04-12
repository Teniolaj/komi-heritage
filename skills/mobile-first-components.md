---
name: mobile-first-components
description: Mobile-first layout and component rules for Komi Heritage. Covers navigation, cart sheet, bottom bars, touch targets, and responsive breakpoint behavior.
---

# Mobile-First Components — Komi Heritage

## Core Rule
**Design for 375px first. Add desktop styles with `md:` and `lg:` prefixes.** The majority of Komi Heritage's users are on mobile (TikTok-driven audience). Mobile experience is the primary experience.

## Minimum Touch Target
Every tappable element must be at least 44×44px:

```tsx
// Good — explicit min size
<button className="min-w-[44px] min-h-[44px] flex items-center justify-center">

// Good — padding creates the target area
<button className="px-4 py-3"> {/* 48px+ height */}
```

## Bottom Tab Navigation (Mobile)
On mobile, the main nav is a bottom tab bar — not a hamburger menu. It sticks to the bottom of the viewport.

```tsx
// components/layout/BottomNav.tsx
import { motion } from 'framer-motion'
import { Home, UtensilsCrossed, ShoppingBag, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/',        icon: Home,            label: 'Home' },
  { href: '/menu',    icon: UtensilsCrossed, label: 'Menu' },
  { href: '/cart',    icon: ShoppingBag,     label: 'Cart' },
  { href: '/account', icon: User,            label: 'Account' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t
      border-[#E8E0D5] md:hidden safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link key={href} href={href}
              className="flex flex-col items-center gap-1 min-w-[44px] min-h-[44px]
                justify-center px-3">
              <motion.div
                animate={{ scale: isActive ? 1.1 : 1, color: isActive ? '#C0272D' : '#6B6B6B' }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Icon size={22} />
              </motion.div>
              <span className={`text-[10px] font-dm-sans
                ${isActive ? 'text-[#C0272D] font-medium' : 'text-[#6B6B6B]'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
```

Add `pb-20 md:pb-0` to the main content area so content isn't hidden behind the tab bar.

## Desktop Header Navigation
On `md:` and above, show a top horizontal nav instead of the bottom bar:

```tsx
// components/layout/Header.tsx
// Hidden on mobile (md:flex), shown on desktop
<header className="hidden md:flex items-center justify-between
  px-8 py-4 bg-white border-b border-[#E8E0D5] sticky top-0 z-40">
  <Link href="/" className="font-syne font-black text-xl text-[#C0272D]">
    KOMI HERITAGE
  </Link>
  <nav className="flex items-center gap-8">
    {/* nav links with animated underline */}
  </nav>
  <div className="flex items-center gap-4">
    {/* cart icon with badge + account button */}
  </div>
</header>
```

## Floating Cart Bar (Mobile)
Appears after the first item is added to cart. Sits above the bottom tab bar.

```tsx
// components/cart/FloatingCartBar.tsx
import { motion, AnimatePresence } from 'framer-motion'

export function FloatingCartBar({ itemCount, subtotal, onOpen }) {
  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed bottom-20 inset-x-4 z-30 md:hidden"
        >
          <button
            onClick={onOpen}
            className="w-full bg-[#C0272D] text-white rounded-2xl
              flex items-center justify-between px-5 py-4
              shadow-lg shadow-red-900/30"
          >
            <span className="bg-white/20 text-white text-sm font-medium
              px-2.5 py-1 rounded-lg font-dm-sans">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
            <span className="font-syne font-bold text-base">View Cart →</span>
            <span className="font-syne font-bold text-base">
              GHC {subtotal.toFixed(2)}
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

## Cart Bottom Sheet (Mobile Full-Screen)
Tapping "View Cart" slides up a full bottom sheet:

```tsx
// components/cart/CartSheet.tsx
<AnimatePresence>
  {isOpen && (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
      />
      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl
          max-h-[90vh] overflow-y-auto md:hidden"
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-4" />
        {/* Cart content */}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

## Menu Grid — Responsive
```tsx
// Mobile: 1 column. Tablet: 2 columns. Desktop: 3 columns.
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  {items.map(item => <MenuCard key={item.id} item={item} />)}
</div>
```

## Item Detail — Mobile Bottom Sheet
On mobile, tapping a menu card opens a bottom sheet (not a new page) with full details:

```tsx
<AnimatePresence>
  {selectedItem && (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl
        p-6 md:hidden max-h-[85vh] overflow-y-auto"
    >
      <img src={selectedItem.image_url}
        className="w-full h-52 object-cover rounded-2xl mb-4" />
      <h2 className="font-syne font-black text-2xl">{selectedItem.name}</h2>
      <p className="font-dm-sans text-[#6B6B6B] mt-2">{selectedItem.description}</p>
      <div className="flex items-center justify-between mt-6">
        <span className="font-syne font-bold text-[#D4A437] text-2xl">
          GHC {selectedItem.price}
        </span>
        <QuantityStepper />
      </div>
      <PrimaryButton className="w-full mt-4">Add to Cart</PrimaryButton>
    </motion.div>
  )}
</AnimatePresence>
```

## Responsive Typography Scale
```css
/* Mobile first — scale up with md: */
h1 { font-size: clamp(2rem, 8vw, 5rem); }     /* 32px → 80px */
h2 { font-size: clamp(1.5rem, 5vw, 3rem); }   /* 24px → 48px */
h3 { font-size: clamp(1.1rem, 3vw, 1.5rem); } /* 18px → 24px */
```

## Page Bottom Padding (account for tab bar)
Every page that shows the bottom tab nav must have bottom padding:

```tsx
<main className="pb-24 md:pb-0">
  {/* page content */}
</main>
```

## Staff Portal — Tablet Warning on Mobile
```tsx
// Show this banner on screens smaller than 768px in the staff portal
<div className="md:hidden bg-amber-50 border border-amber-200 text-amber-800
  text-sm font-dm-sans p-4 text-center">
  The staff portal works best on a tablet or laptop.
  You're on a small screen — some features may be limited.
</div>
```

## Safe Area (iPhone notch / home indicator)
Add to globals.css for proper spacing on iPhones:

```css
.safe-area-pb {
  padding-bottom: env(safe-area-inset-bottom);
}
```

Apply to the bottom nav and floating cart bar.
