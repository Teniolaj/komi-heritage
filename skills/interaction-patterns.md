---
name: interaction-patterns
description: Interaction design rules for Komi Heritage. Covers button states, card interactions, form inputs, cart feedback, and all clickable element behaviors.
---

# Interaction Patterns — Komi Heritage

## Core Rule
**Every interactive element must have three states explicitly designed: default, hover, and active/tap.** Nothing should feel static or unresponsive. The UI should feel alive.

## Button System

### Primary Button (Red — main CTA)
```tsx
// components/ui/Button.tsx
import { motion } from 'framer-motion'

export function PrimaryButton({ children, onClick, className = '' }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, backgroundColor: '#D42D34' }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`bg-[#C0272D] text-white font-dm-sans font-medium
        px-6 py-3 rounded-xl cursor-pointer select-none ${className}`}
      style={{ boxShadow: '0 2px 0 #8B1A1E' }}  // subtle bottom shadow = depth
    >
      {children}
    </motion.button>
  )
}
```

### Ghost Button (outline — secondary CTA)
```tsx
<motion.button
  whileHover={{ backgroundColor: '#C0272D', color: '#ffffff', borderColor: '#C0272D' }}
  whileTap={{ scale: 0.97 }}
  transition={{ duration: 0.2 }}
  className="border-2 border-[#C0272D] text-[#C0272D] bg-transparent
    font-dm-sans font-medium px-6 py-3 rounded-xl cursor-pointer"
>
  {children}
</motion.button>
```

### Icon Button (circular — +/- quantity, cart add)
```tsx
<motion.button
  whileHover={{ scale: 1.1, backgroundColor: '#C0272D', color: '#fff' }}
  whileTap={{ scale: 0.9 }}
  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
  className="w-10 h-10 rounded-full border-2 border-[#C0272D] text-[#C0272D]
    flex items-center justify-center cursor-pointer"
>
  +
</motion.button>
```

## Menu Item Card Interaction
Full interaction spec for a menu item card:

```tsx
<motion.div
  whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
  className="bg-white rounded-2xl overflow-hidden cursor-pointer"
>
  {/* Image container — zoom on hover */}
  <div className="overflow-hidden h-48">
    <motion.img
      whileHover={{ scale: 1.06 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      src={item.image_url}
      className="w-full h-full object-cover"
    />
  </div>

  {/* Card body */}
  <div className="p-4">
    <h3 className="font-syne font-bold text-lg">{item.name}</h3>
    <p className="font-dm-sans text-[#6B6B6B] text-sm mt-1">{item.description}</p>
    <div className="flex items-center justify-between mt-4">
      <span className="font-syne font-bold text-[#D4A437] text-xl">
        GHC {item.price}
      </span>
      {/* Add button — spring bounce on click */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        transition={{ type: 'spring', stiffness: 500 }}
        onClick={() => addToCart(item)}
        className="bg-[#C0272D] text-white w-10 h-10 rounded-full
          flex items-center justify-center text-xl font-bold"
      >
        +
      </motion.button>
    </div>
  </div>
</motion.div>
```

## Form Input States
All inputs must feel responsive on focus:

```tsx
// In globals.css — add to your input base styles
input, textarea, select {
  border: 1.5px solid var(--color-border);
  border-radius: 12px;
  padding: 12px 16px;
  font-family: var(--font-dm-sans);
  background: white;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  outline: none;
}

input:focus, textarea:focus, select:focus {
  border-color: #C0272D;
  box-shadow: 0 0 0 3px rgba(192, 39, 45, 0.12);
}

input:hover:not(:focus) {
  border-color: #aaa;
}
```

## Add to Cart Feedback
When a user taps "Add to Cart", show a micro-confirmation so they know it worked:

```tsx
const [added, setAdded] = useState(false)

const handleAdd = () => {
  addToCart(item)
  setAdded(true)
  setTimeout(() => setAdded(false), 1200)
}

// Button shows checkmark briefly
<motion.button onClick={handleAdd}>
  <AnimatePresence mode="wait">
    {added ? (
      <motion.span
        key="check"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
      >
        ✓
      </motion.span>
    ) : (
      <motion.span key="plus">+</motion.span>
    )}
  </AnimatePresence>
</motion.button>
```

## Navigation Link Hover
Nav links get an animated underline that grows from the left:

```css
.nav-link {
  position: relative;
  font-family: var(--font-dm-sans);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #C0272D;
  transition: width 0.25s ease;
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}
```

## Status Badge Colors
Order status badges use consistent color coding:

```tsx
const statusStyles = {
  received:        'bg-blue-100 text-blue-700',
  preparing:       'bg-amber-100 text-amber-700',
  ready:           'bg-emerald-100 text-emerald-700',
  out_for_delivery:'bg-purple-100 text-purple-700',
  delivered:       'bg-green-100 text-green-700',
  picked_up:       'bg-green-100 text-green-700',
  cancelled:       'bg-red-100 text-red-600',
}

<span className={`px-3 py-1 rounded-full text-xs font-medium font-dm-sans
  ${statusStyles[order.status]}`}>
  {order.status.replace('_', ' ')}
</span>
```

## Page Link / Route Transitions
Wrap every page in a layout motion component so route changes feel smooth:

```tsx
// components/PageWrapper.tsx
import { motion } from 'framer-motion'

export function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
```

Use in every `page.tsx`:
```tsx
export default function MenuPage() {
  return (
    <PageWrapper>
      {/* page content */}
    </PageWrapper>
  )
}
```

## Tooltip on Hover (for icon-only buttons)
Staff portal and admin dashboard icon buttons should show a tooltip:

```tsx
<div className="relative group">
  <button className="p-2 rounded-lg hover:bg-gray-100">
    <TrashIcon />
  </button>
  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white
    text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100
    transition-opacity duration-200 whitespace-nowrap pointer-events-none">
    Delete item
  </span>
</div>
```
