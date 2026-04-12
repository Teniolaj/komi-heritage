---
name: african-design-system
description: African-inspired premium design system for Komi Heritage. Covers colors, typography, textures, Kente dividers, and Adinkra accents.
---

# African Design System — Komi Heritage

## Brand Identity
Komi Heritage is an Accra-based kenkey brand. The visual language is **bold, warm, cultural, and premium** — not kitschy, not generic. Every design decision should feel like it belongs to a serious Ghanaian food brand with personality.

## Color Palette

```css
:root {
  --color-primary:     #C0272D;  /* Deep red — primary brand color */
  --color-primary-hover: #D42D34;
  --color-gold:        #D4A437;  /* Gold accent — heritage, warmth */
  --color-dark:        #111111;  /* Near-black backgrounds */
  --color-dark-2:      #1A1A1A;  /* Slightly lighter dark for cards */
  --color-cream:       #FAF7F2;  /* Warm off-white — never pure white */
  --color-cream-2:     #F2EDE5;  /* Slightly deeper cream for section alternates */
  --color-text:        #1C1C1C;  /* Body text */
  --color-muted:       #6B6B6B;  /* Secondary text */
  --color-border:      #E8E0D5;  /* Warm border tone */
}
```

**Never use** cold greys (#f5f5f5, #e0e0e0), purple gradients, or blue as accent. Keep the palette warm at all times.

## Typography

Import in `app/layout.tsx`:

```tsx
import { Syne, DM_Sans } from 'next/font/google'

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-sans',
})
```

Usage rules:
- **Headings, display text, nav brand name** → `font-syne` (var(--font-syne))
- **Body text, descriptions, labels, UI copy** → `font-dm-sans` (var(--font-dm-sans))
- Headings are always **uppercase or title case with tight tracking** (`tracking-tight` or `tracking-wider` for all-caps)
- Never use Inter, Roboto, Arial, or system fonts in this project

```css
h1, h2, h3 { font-family: var(--font-syne); font-weight: 800; }
body, p, label, input { font-family: var(--font-dm-sans); font-weight: 400; }
```

## Kente-Inspired Section Divider

Place this SVG between major page sections (between hero and menu preview, between menu preview and about, etc.):

```tsx
// components/ui/KenteDivider.tsx
export function KenteDivider() {
  return (
    <div className="w-full overflow-hidden" style={{ height: '6px' }}>
      <svg width="100%" height="6" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="kente" x="0" y="0" width="24" height="6" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="8" height="6" fill="#C0272D" />
            <rect x="8" y="0" width="8" height="6" fill="#D4A437" />
            <rect x="16" y="0" width="8" height="6" fill="#111111" />
          </pattern>
        </defs>
        <rect width="100%" height="6" fill="url(#kente)" />
      </svg>
    </div>
  )
}
```

Use `<KenteDivider />` between every major section on the homepage.

## Adinkra Accent Component

Use small Adinkra-inspired SVG symbols as decorative section markers, list bullets, or divider accents. Keep them subtle — 20–28px, color matched to context (gold on dark, red on cream).

```tsx
// components/ui/AdinkraAccent.tsx
// Gye Nyame symbol (simplified geometric interpretation)
export function AdinkraAccent({ size = 24, color = '#D4A437' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
      <path d="M12 4 L12 20 M4 12 L20 12 M6.3 6.3 L17.7 17.7 M17.7 6.3 L6.3 17.7"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" />
    </svg>
  )
}
```

Place one before section headings on the homepage and about page, like:
```tsx
<div className="flex items-center gap-2 mb-3">
  <AdinkraAccent size={20} color="#D4A437" />
  <span className="text-gold text-sm font-dm-sans uppercase tracking-widest">Our Story</span>
</div>
<h2 className="font-syne text-4xl font-black">Rooted in Flavor</h2>
```

## Grain Texture Overlay

Apply on dark hero sections and dark backgrounds for tactile warmth:

```css
/* In globals.css */
.grain-overlay {
  position: relative;
}

.grain-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.035;
  pointer-events: none;
  z-index: 1;
}
```

Add `className="grain-overlay"` to the hero section and any full-dark section.

## Spacing & Layout Rules
- Section vertical padding: `py-20` on desktop, `py-12` on mobile
- Max content width: `max-w-6xl mx-auto px-4 md:px-8`
- Card border radius: `rounded-2xl` for main cards, `rounded-xl` for inner elements
- Never use sharp corners (`rounded-none`) on customer-facing UI

## Dark Section Template
For sections with dark (`#111`) background:

```tsx
<section className="bg-[#111111] grain-overlay text-white py-20">
  <div className="max-w-6xl mx-auto px-4 md:px-8">
    {/* content — headings in white, accents in gold */}
  </div>
</section>
```

## Cream Section Template
For light sections:

```tsx
<section className="bg-[#FAF7F2] py-20">
  <div className="max-w-6xl mx-auto px-4 md:px-8">
    {/* content — headings in #1C1C1C, accents in red */}
  </div>
</section>
```
