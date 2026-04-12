---
name: motion-animations
description: Framer Motion animation system for Komi Heritage. Use this skill for all page transitions, scroll reveals, hover states, and interactive animations.
---

# Motion & Animations

## Setup
This project uses Framer Motion for all animations. Always import from `framer-motion`.

```ts
import { motion, AnimatePresence, useInView } from 'framer-motion'
```

## Page Entrance Animation
Every page component wraps its root element in a `motion.div` with this config:

```tsx
<motion.div
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -12 }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
>
  {/* page content */}
</motion.div>
```

## Staggered Children
When rendering a list of items (menu cards, order history, customer list), use variants to stagger them:

```tsx
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

// Usage
<motion.ul variants={containerVariants} initial="hidden" animate="show">
  {items.map(item => (
    <motion.li key={item.id} variants={itemVariants}>
      {/* card content */}
    </motion.li>
  ))}
</motion.ul>
```

## Scroll-Triggered Reveals
Sections below the fold animate in when they enter the viewport:

```tsx
const ref = useRef(null)
const isInView = useInView(ref, { once: true, margin: '-80px' })

<motion.section
  ref={ref}
  initial={{ opacity: 0, y: 40 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.6, ease: 'easeOut' }}
>
  {/* section content */}
</motion.section>
```

## Card Hover
All cards (menu items, order cards, customer cards) use:

```tsx
<motion.div
  whileHover={{ y: -4, scale: 1.01 }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
>
```

The food image inside the card zooms slightly on hover:

```tsx
<div className="overflow-hidden rounded-t-xl">
  <motion.img
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    src={item.image_url}
  />
</div>
```

## Button Interactions
All buttons use `whileTap` for the press-down feel:

```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.97 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
```

## Cart Badge Bounce
When an item is added to cart, the item count badge bounces:

```tsx
<motion.span
  key={cartCount}  // key change triggers re-animation
  initial={{ scale: 1.5 }}
  animate={{ scale: 1 }}
  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
>
  {cartCount}
</motion.span>
```

## Cart Sheet (Mobile)
The mobile cart slides up from the bottom using AnimatePresence:

```tsx
<AnimatePresence>
  {isCartOpen && (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl"
    >
      {/* cart content */}
    </motion.div>
  )}
</AnimatePresence>
```

## Order Status Timeline
Each status step fills in with a satisfying animation. The active step pulses:

```tsx
// Active step pulse ring
<motion.div
  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
  className="absolute inset-0 rounded-full bg-red-600"
/>
```

## Staff Portal — New Order Slide In
New order cards slide down from the top of the queue:

```tsx
<motion.div
  initial={{ opacity: 0, y: -30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
>
  {/* order card */}
</motion.div>
```

## Skeleton Loaders
Loading skeletons pulse with a warm shimmer (not cold grey):

```tsx
<motion.div
  animate={{ opacity: [0.5, 1, 0.5] }}
  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
  className="bg-amber-100 rounded-lg h-48 w-full"
/>
```
