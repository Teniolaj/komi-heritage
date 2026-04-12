```markdown
# Design System Document: The Living Archive
 
## 1. Overview & Creative North Star
This design system is built to honor the intersection of ancient heritage and modern Accra street culture. We are moving away from the "disposable" feel of fast-food apps and toward a "Street-Food Premium" editorial experience.
 
**Creative North Star: The Cultural Monolith.**
The UI should feel architectural, grounded, and heavy. We achieve this through **Organic Brutalism**: a combination of razor-sharp edges (0px border radius), massive high-contrast typography, and a "layered paper" approach to depth. By rejecting standard rounded containers and thin lines, we create a digital space that feels as authentic and substantial as the heritage it represents.
 
## 2. Colors
Our palette is rooted in the earth and the flame. It is high-contrast, designed to make food photography "pop" while maintaining a sophisticated, archival backdrop.
 
*   **Primary Roles:** The `primary` (#9d0518) and `primary_container` (#c0272d) represent the heat and vitality of the brand. Use these for high-action areas and key brand moments.
*   **Neutral Foundation:** The `surface` (#fcf9f4) and `background` (#fcf9f4) provide a warm, off-white "cream" base that feels more premium and less sterile than pure white.
*   **The "No-Line" Rule:** To maintain a high-end editorial feel, **1px solid borders are prohibited for sectioning.** Boundaries must be defined through background color shifts. For example, a card should be distinguished from the background by moving from `surface` to `surface-container-low`, not by a stroke.
*   **Surface Hierarchy & Nesting:** Treat the interface as physical layers. Use `surface-container-lowest` for floating elements on top of a `surface-container` section. This "tonal stepping" creates depth without clutter.
*   **Signature Textures:** Use subtle gradients transitioning from `primary` to `primary_container` on large CTAs to add "soul." For full-bleed image sections, apply a dark vignette using `on-surface` at 40% opacity to ensure text legibility and "premium grit."
 
## 3. Typography
We use typography as a brand element, not just a functional one. The contrast between a classic, weighted serif and a technical sans-serif mirrors the "Heritage vs. Street" vibe.
 
*   **Display & Headlines (Newsreader):** This is our "Editorial Voice." Use `display-lg` and `headline-lg` for storytelling and product titles. It should feel authoritative and timeless.
*   **Body & Labels (Manrope):** This is our "Functional Voice." Manrope provides a clean, modern counter-balance. Use `body-md` for descriptions and `label-md` for technical data (price, weight, ingredients).
*   **Hierarchy Note:** To break the "template" look, use intentional asymmetry. A `display-lg` headline should often be paired with a much smaller `label-md` "kicker" text above it to create a sophisticated, magazine-style layout.
 
## 4. Elevation & Depth
In this system, elevation is a product of light and layering, not structural shadows.
 
*   **The Layering Principle:** Depth is achieved by "stacking" the surface-container tiers. Place a `surface-container-lowest` card on a `surface-container-low` section to create a soft, natural lift.
*   **Ambient Shadows:** If a floating effect is required (e.g., a "Quick Add" button), use an extra-diffused shadow: `blur: 24px`, `opacity: 6%`, using a color derived from `on-surface` (charcoal) rather than pure black.
*   **The "Ghost Border" Fallback:** If a container needs more definition than a color shift provides, use the `outline_variant` at 15% opacity. Never use 100% opaque borders.
*   **Glassmorphism:** For top navigation bars or floating "cart" summaries, use `surface` at 80% opacity with a `backdrop-filter: blur(12px)`. This makes the layout feel integrated and premium.
 
## 5. Components
 
### Buttons
*   **Primary:** Sharp 0px corners. Background: `primary`. Text: `on_primary` (Manrope Bold, All Caps). 
*   **Secondary:** Sharp 0px corners. Background: `secondary` (Gold accent). Text: `on_secondary`. Use this for "Special Editions" or "Premium Upgrades."
*   **Tertiary:** No background. Underline using `primary` at 2px thickness.
 
### Cards & Food Modules
*   **Construction:** Zero rounded corners. Use full-bleed imagery at the top with a `surface-container` base.
*   **Separation:** No dividers. Separate content using 32px or 48px vertical white space.
*   **Image Style:** High-quality photography with a subtle `surface_tint` overlay in the shadows to warm the image.
 
### Input Fields
*   **Style:** Minimalist. No enclosing box. Use a bottom-only border (2px) using `outline_variant`. 
*   **Active State:** The bottom border shifts to `primary`. Labels should use `label-md` in `secondary` (Gold) to denote importance.
 
### Chips & Tags
*   **Selection:** Rectangular (0px radius). `surface-container-high` for unselected, `primary` for selected.
*   **Editorial Tags:** Small `label-sm` text in `secondary` (Gold) sitting above product titles to denote "Heritage Recipe" or "Street-Side Classic."
 
### Lists
*   **Style:** Clean typography. Use `surface-container-low` as a background hover state instead of a divider line. Leading elements (icons or small thumbnails) should always be hard-edged.
 
## 6. Do's and Don'ts
 
### Do:
*   **Use Full-Bleed Imagery:** Allow photography to touch the edges of the screen to create an immersive, high-end feel.
*   **Embrace Whitespace:** Use the "cream" (`surface`) background to let the red and gold accents breathe.
*   **Maintain Sharp Edges:** Every single element must have 0px roundedness. This is our visual signature.
 
### Don't:
*   **Don't use 1px black borders:** They look cheap and digital. Use background shifts instead.
*   **Don't use generic iconography:** Icons should be thin-stroke, high-contrast, and strictly geometric.
*   **Don't crowd the "Gold":** The `secondary` (Gold) color is an accent. If used too much, it loses its premium "stamp of quality" status.
*   **Don't use standard shadows:** Avoid the "floating box" look of 2014 material design. Stick to tonal layering.```