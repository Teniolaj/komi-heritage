# KOMI HERITAGE
## Web Application — Product Requirements Document

| Field | Detail |
|-------|--------|
| **Project Name** | Komi Heritage Online Ordering Platform |
| **Version** | 1.1 — Updated |
| **Platform** | Web (Next.js — responsive desktop & mobile) |
| **Tech Stack** | Next.js 15, TypeScript, Supabase, Tailwind CSS, Paystack |
| **Author** | Teniola John Ogunyemi |
| **Date** | April 2025 |
| **Status** | Draft |

---

## 1. Executive Summary

Komi Heritage is an Accra-based kenkey brand operating out of Tantra Hills. The business currently takes orders via WhatsApp and phone, and markets heavily on TikTok (@komi_heritage2) with strong engagement (58.6K likes, videos reaching 120K+ views). This platform digitizes the full ordering experience — giving customers a sleek web presence to browse the menu, place orders for delivery or pickup, and track their order in real time, while giving the business an admin dashboard and staff portal to manage operations.

The platform is optimized for mobile-first usage (the majority of Komi Heritage's audience comes from mobile), uses Paystack for Ghana-native payments, and implements a Ken Burns image animation strategy on the homepage hero to create a cinematic, data-efficient advertising experience in place of heavy video autoplay.

---

## 2. Problem Statement

**Current Pain Points**
- Orders are placed manually via WhatsApp/phone — no order history, no tracking, prone to miscommunication.
- No online presence beyond TikTok — no owned channel to convert followers into repeat customers.
- Staff have no dedicated order management system — orders are relayed verbally or via chat.
- The business has no visibility into revenue analytics, peak order times, or customer data.
- Loyal customers have no way to reorder quickly or track delivery status.

**Opportunity**
A branded web app that handles the full order lifecycle — discovery → order → payment → tracking — converts TikTok followers into paying customers and gives the business its first real operational infrastructure.

---

## 3. Goals & Success Metrics

### Primary Goals
- Allow customers to browse the menu and place orders for delivery or pickup online.
- Accept payments via Paystack (mobile money + card).
- Show real-time order status to customers.
- Provide a staff portal for viewing and updating orders in real time.
- Provide an admin dashboard with customer list, order totals, and daily analytics.
- Deliver a cinematic homepage experience without heavy video data usage.
- Enable admin to broadcast marketing/promo emails to all registered customers.

### Success Metrics
- Customer completes an order end-to-end in under 3 minutes.
- Order appears on staff portal within 5 seconds of placement.
- Paystack payment confirmation reflected in system within 10 seconds via webhook.
- Homepage Lighthouse mobile score: 80+.
- Admin dashboard loads daily analytics within 3 seconds.

---

## 4. Project Scope

### In Scope
- Public homepage with hero section (Ken Burns image slideshow), menu preview, about section, and contact/location.
- Full menu page with all items, descriptions, prices, and add-to-cart.
- Cart and checkout — delivery address or pickup selection, Paystack payment.
- User authentication — email/password and Google OAuth via Supabase Auth.
- Authenticated user dashboard — order history, reorder, account settings.
- Real-time order tracking page for customers (status: Received → Preparing → Ready → Out for Delivery → Delivered).
- Staff portal — live order queue, status update controls, order detail view.
- Admin dashboard — total orders, all registered customers, daily analytics (orders by hour, revenue, top items).
- Broadcast email — admin can send promo/announcement emails to all registered customers (Brevo).
- Transactional email (order confirmation, status updates) — **deferred to v1.1**.

### Out of Scope (v1.0)
- Native iOS/Android app.
- Table reservation system.
- Subscription/recurring orders.
- POS hardware integration.
- Multi-location support.
- Loyalty/points system (planned v2.0).
- AI-powered recommendations (planned v2.0).

---

## 5. User Personas

### Persona 1 — The TikTok Convert
| | |
|--|--|
| **Name** | Ama, 22 — University student |
| **Behaviour** | Saw Komi Heritage on TikTok, wants to order but doesn't want to WhatsApp |
| **Pain Point** | Ordering via WhatsApp feels informal; she doesn't know if her order was received |
| **Goal** | Place an order quickly from her phone and track it like she would on Jumia |
| **Key Feature** | Menu page, mobile checkout, real-time order tracking |

### Persona 2 — The Loyal Regular
| | |
|--|--|
| **Name** | Kwame, 31 — Office worker |
| **Behaviour** | Orders Party Park every Friday for his team |
| **Pain Point** | Re-explains his order every time via WhatsApp |
| **Goal** | See his past orders and reorder in two taps |
| **Key Feature** | Order history, one-click reorder |

### Persona 3 — The Café Owner (Komi Staff)
| | |
|--|--|
| **Name** | Heritage team member |
| **Behaviour** | Manages incoming orders during the day |
| **Pain Point** | Orders come in on WhatsApp, phone, and in person simultaneously — chaos |
| **Goal** | See all online orders in one place with clear status controls |
| **Key Feature** | Staff portal with real-time order queue |

---

## 6. Feature Requirements

### 6.1 Homepage

**Hero Section (Cinematic Image Slideshow)**
- 4–5 high-quality food photos displayed in a full-viewport slideshow.
- Each image uses **Ken Burns effect**: slow CSS `transform: scale` and `translate` animation giving the illusion of a camera pan/zoom.
- Crossfade transition between slides (opacity fade, not slide-wipe).
- Overlay text: headline, tagline, and two CTAs ("Order Now" → menu, "See Menu" → menu with anchor).
- No autoplay video — zero video files served. Data-friendly.
- Optional cinemagraph touch: CSS animation on a decorative element (e.g., animated steam/sauce drip SVG overlay) for the "alive" feeling.

**Sections Below Hero**
- Menu Preview — 3 featured items with photo, name, price, and "Add to Cart" button.
- About — short brand story ("Rooted in Flavor, Wrapped in Heritage"), photo of the team/kitchen.
- How It Works — 3-step graphic: Choose → Pay → Receive.
- Delivery Info — coverage area, estimated delivery time, pickup option note.
- Contact & Location — Tantra Hills address, phone, WhatsApp link, social links (TikTok, Instagram).

### 6.2 Menu Page

- Category filter tabs (if multiple categories added in future; v1.0 shows all items).
- Item cards: photo, name, description, price, quantity selector, Add to Cart.
- Floating cart summary bar at bottom on mobile (item count + subtotal + "View Cart" button).
- Menu items pulled from Supabase `menu_items` table — admin can update without code changes.

**Menu Items (v1.0)**

| Name | Description | Price |
|------|-------------|-------|
| One Man Kenkey | Kenkey with fish and egg | GHC 30 |
| Golden Twist | 2 Kenkey, fish, 2 fried eggs | GHC 50 |
| Party Park | 2 Kenkey, 2 fried egg, fish and sausage | GHC 65 |
| Apagya | 2 Kenkey, shrimps, pork and sausage | GHC 80 |
| Classic Gold | 2 Kenkey, Fish, octopus, fried egg, shrimp/sausage | GHC 120 |
| Spicy Heat | 4 Kenkey, turkey, octopus, fish, shrimp, pork, egg | GHC 260 |

### 6.3 Cart & Checkout

- Cart drawer/page: item list, quantities, subtotal, remove item.
- Fulfillment selector: **Delivery** or **Pickup**.
- If Delivery: delivery address field, optional note to rider.
- If Pickup: confirmation of Tantra Hills location, estimated ready time.
- Order note field (optional): dietary needs, special instructions.
- Paystack payment button — opens Paystack hosted checkout (card + mobile money).
- On successful payment: order row created in Supabase, redirect to order tracking page.
- On failed payment: error state shown, cart preserved.

**Paystack Integration Notes**
- Initialize payment via Paystack Popup JS or redirect to hosted page.
- Webhook endpoint at `/api/paystack/webhook` verifies signature and creates order in DB.
- Race condition protection: order only created on `charge.success` webhook, not on frontend callback alone.

### 6.4 User Authentication & Account

- Sign up / Login: email + password, Google OAuth.
- Authenticated routes: `/account`, `/orders`, `/orders/[id]`.
- Account page: name, email, phone number (for delivery contact), saved delivery address.
- Order history: list of past orders with date, items, total, and status badge.
- One-click reorder: adds the same items back to cart.

### 6.5 Real-Time Order Tracking (Customer)

- Page at `/orders/[order_id]` accessible to the order owner.
- Status timeline UI: Received → Preparing → Ready → Out for Delivery → Delivered (or Ready for Pickup → Picked Up).
- Supabase Realtime subscription on the `orders` table — status updates pushed instantly without page refresh.
- Status changes are reflected live on the customer's tracking page only. Transactional email notifications are deferred to v1.1.

### 6.6 Staff Portal

- Protected route: `/staff` — accessible only to users where `profiles.role = 'staff'` or `'admin'`.
- Live order queue: all orders with status `received`, `preparing`, `ready`, `out_for_delivery`.
- Order card shows: order number, customer name, items summary, fulfillment type (delivery/pickup), time placed, current status.
- Staff can update order status with one click — change reflects on customer's tracking page in real time via Supabase Realtime.
- Order detail view: full item list, delivery address or pickup, customer phone, order note.
- Queue auto-refreshes via Supabase Realtime — no manual page reload needed.
- Audio ping option: browser notification sound when a new order arrives.

### 6.7 Admin Dashboard

- Protected route: `/admin` — accessible only to `profiles.role = 'admin'`.

**Sections:**
- **Overview Cards**: Total orders today, total revenue today, active orders (in progress), total registered customers.
- **Daily Analytics**: Orders by hour chart (bar chart), revenue by hour, top 3 items ordered today.
- **All Orders**: Filterable table — date range, status, fulfillment type. Click to view detail.
- **Customers**: Table of all registered users — name, email, phone, total orders, join date. Click to view customer order history.
- **Menu Manager**: Add, edit, toggle availability of menu items. No code change required.
- **Export**: Download daily orders as CSV.

---

## 7. Homepage — Video Alternative: Ken Burns Strategy

The Ken Burns effect is a CSS-only technique where still images appear to move through slow pan and zoom animations. It creates a cinematic feel identical to video at a fraction of the data cost.

**Implementation:**
```css
@keyframes kenburns {
  0%   { transform: scale(1.0) translate(0%, 0%); }
  100% { transform: scale(1.1) translate(-2%, -1%); }
}

.hero-slide img {
  animation: kenburns 8s ease-in-out forwards;
}
```

Each image loads once (optimized via Next.js `<Image>` with WebP + blur placeholder). The slideshow cycles with CSS opacity crossfades. Total data cost: ~3–5 images at ~80KB each = under 500KB. A typical 15-second autoplay video would be 3–8MB. **This approach uses 94% less data.**

Optional enhancement: SVG or Lottie animation overlay (animated pepper, steam, sauce swirl) that plays on top of the still image for the "living" effect — adds <10KB.

---

## 8. Email Strategy

### v1.0 — Broadcast / Marketing Emails Only — Brevo (Free: 300/day)

The v1.0 email scope is **admin-initiated broadcast only**. The admin can compose and send an email to all registered customers directly from the admin dashboard. No automated triggers in this version.

**Use cases:**
- New promo announcements ("Buy Classic Gold, get free Coke this weekend")
- New menu item launches
- Seasonal campaigns (Christmas, Valentine's — Komi Heritage already runs these on TikTok)
- Vital business information (change of hours, location update, closure notice)

**How it works:**
- Admin writes a subject + message body in the Admin Dashboard under "Email Customers".
- The system fetches all customer emails from `profiles` where `role = 'customer'` and `email_subscribed = true`.
- Sends via Brevo API in a batch call.
- A `broadcast_emails` table logs each campaign sent (subject, sent_at, sent_by, recipient_count).

**Brevo Free Tier:** 300 emails/day, unlimited contacts. Sufficient for early-stage operations.

### v1.1 — Transactional Emails (Deferred)
- Order confirmation on payment success
- Order status update notifications
- Account welcome email
- Tool: Resend (3,000 free/month, clean Next.js API integration)

---

## 9. Data Model

| Table | Key Columns | Purpose |
|-------|-------------|---------|
| `profiles` | user_id, name, email, phone, role, saved_address, email_subscribed | User accounts and roles |
| `menu_items` | id, name, description, price, image_url, is_available, category, sort_order | Menu catalogue |
| `orders` | id, user_id, status, fulfillment_type, total, delivery_address, note, created_at | Order lifecycle |
| `order_items` | id, order_id, menu_item_id, quantity, unit_price, snapshot_name | Line items per order |
| `payments` | id, order_id, paystack_reference, amount, status, paid_at | Payment records |
| `broadcast_emails` | id, subject, body, sent_by, sent_at, recipient_count | Admin broadcast email log |

**Order status enum:** `received` | `preparing` | `ready` | `out_for_delivery` | `delivered` | `picked_up` | `cancelled`

**Role enum:** `customer` | `staff` | `admin`

---

## 10. SQL — Table Definitions

Run the following in the Supabase SQL Editor. All tables use `uuid` primary keys, Supabase Auth integration on `profiles`, and Row Level Security (RLS) enabled.

```sql
-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE order_status AS ENUM (
  'received',
  'preparing',
  'ready',
  'out_for_delivery',
  'delivered',
  'picked_up',
  'cancelled'
);

CREATE TYPE fulfillment_type AS ENUM (
  'delivery',
  'pickup'
);

CREATE TYPE user_role AS ENUM (
  'customer',
  'staff',
  'admin'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'success',
  'failed'
);


-- ============================================================
-- PROFILES
-- Extends Supabase Auth users. Created via trigger on signup.
-- ============================================================

CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  email         TEXT UNIQUE NOT NULL,
  phone         TEXT,
  role          user_role NOT NULL DEFAULT 'customer',
  saved_address TEXT,
  email_subscribed BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile row on new auth user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- ============================================================
-- MENU ITEMS
-- ============================================================

CREATE TABLE menu_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  description  TEXT,
  price        NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url    TEXT,
  category     TEXT NOT NULL DEFAULT 'kenkey',
  is_available BOOLEAN NOT NULL DEFAULT true,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed v1.0 menu items
INSERT INTO menu_items (name, description, price, category, sort_order) VALUES
  ('One Man Kenkey', 'Kenkey with fish and egg', 30.00, 'kenkey', 1),
  ('Golden Twist', '2 Kenkey, fish, 2 fried eggs', 50.00, 'kenkey', 2),
  ('Party Park', '2 Kenkey, 2 fried egg, fish and sausage', 65.00, 'kenkey', 3),
  ('Apagya', '2 Kenkey, shrimps, pork and sausage', 80.00, 'kenkey', 4),
  ('Classic Gold', '2 Kenkey, Fish, octopus, fried egg, shrimp/sausage', 120.00, 'kenkey', 5),
  ('Spicy Heat', '4 Kenkey, turkey, octopus, fish, shrimp, pork, egg', 260.00, 'kenkey', 6);

-- RLS — public read, admin write
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read menu items"
  ON menu_items FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert menu items"
  ON menu_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update menu items"
  ON menu_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete menu items"
  ON menu_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- ============================================================
-- ORDERS
-- ============================================================

CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number     TEXT UNIQUE NOT NULL,  -- human-readable e.g. KH-0042
  user_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  status           order_status NOT NULL DEFAULT 'received',
  fulfillment_type fulfillment_type NOT NULL,
  delivery_address TEXT,                 -- required if fulfillment_type = 'delivery'
  note             TEXT,
  subtotal         NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee     NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
  total            NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-generate human-readable order number: KH-XXXX
CREATE SEQUENCE order_seq START 1;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'KH-' || LPAD(nextval('order_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Auto-update updated_at on status change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff and admins can view all orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Staff and admins can update order status"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );


-- ============================================================
-- ORDER ITEMS
-- Snapshot of item name + price at time of order.
-- ============================================================

CREATE TABLE order_items (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id       UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id   UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  snapshot_name  TEXT NOT NULL,           -- item name at time of order
  unit_price     NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  quantity       INTEGER NOT NULL CHECK (quantity > 0),
  line_total     NUMERIC(10, 2) GENERATED ALWAYS AS (unit_price * quantity) STORED
);

-- RLS
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own order items"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Staff and admins can view all order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );


-- ============================================================
-- PAYMENTS
-- One row per order. Created on Paystack charge.success webhook.
-- ============================================================

CREATE TABLE payments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  paystack_reference  TEXT UNIQUE NOT NULL,
  amount              NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  currency            TEXT NOT NULL DEFAULT 'GHS',
  status              payment_status NOT NULL DEFAULT 'pending',
  paid_at             TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = payments.order_id
        AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Service role (used by webhook API route) can insert/update payments
-- This is handled via the Supabase service role key in your Next.js API route,
-- which bypasses RLS entirely. No additional policy needed.


-- ============================================================
-- BROADCAST EMAILS
-- Log of all admin-sent broadcast email campaigns.
-- ============================================================

CREATE TABLE broadcast_emails (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject          TEXT NOT NULL,
  body             TEXT NOT NULL,
  sent_by          UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  recipient_count  INTEGER NOT NULL DEFAULT 0,
  sent_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE broadcast_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view broadcast log"
  ON broadcast_emails FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert broadcasts"
  ON broadcast_emails FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- ============================================================
-- USEFUL VIEWS FOR ADMIN DASHBOARD
-- ============================================================

-- Daily order summary (used by admin analytics)
CREATE OR REPLACE VIEW daily_order_summary AS
SELECT
  DATE(created_at AT TIME ZONE 'Africa/Accra') AS order_date,
  EXTRACT(HOUR FROM created_at AT TIME ZONE 'Africa/Accra') AS order_hour,
  COUNT(*) AS order_count,
  SUM(total) AS revenue
FROM orders
WHERE status != 'cancelled'
GROUP BY order_date, order_hour
ORDER BY order_date DESC, order_hour;

-- Top items (used by admin analytics)
CREATE OR REPLACE VIEW top_menu_items AS
SELECT
  oi.snapshot_name AS item_name,
  SUM(oi.quantity) AS total_quantity,
  SUM(oi.line_total) AS total_revenue
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
WHERE o.status != 'cancelled'
  AND DATE(o.created_at AT TIME ZONE 'Africa/Accra') = CURRENT_DATE
GROUP BY oi.snapshot_name
ORDER BY total_quantity DESC;


-- ============================================================
-- REALTIME — enable for live order updates
-- Run in Supabase Dashboard → Database → Replication
-- or via SQL:
-- ============================================================

-- Enable Realtime on orders table (staff portal + customer tracking)
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
```

---

## 11. Tech Stack

| Layer | Technology | Reason |
|-------|------------|--------|
| Frontend | Next.js 15 + TypeScript | App Router, SSR for SEO, image optimization |
| Styling | Tailwind CSS | Mobile-first responsive, fast development |
| Database | Supabase (PostgreSQL) | Managed DB, Auth, Realtime, RLS |
| Auth | Supabase Auth | Email + Google OAuth |
| Payments | Paystack | Ghana-native, supports mobile money + card |
| Email (Broadcast) | Brevo | 300/day free, bulk send API, campaign builder |
| Deployment | Vercel | Zero-config Next.js, edge network |
| Charts | Recharts | Admin analytics |
| Animations | CSS (Ken Burns) + optional Lottie | Data-efficient hero animations |

---

## 12. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | Menu page initial load < 2.5s on 3G. Images served as WebP with blur placeholders. |
| **Mobile First** | All pages designed for 375px+ first. Staff portal usable on a tablet. |
| **Security** | Supabase RLS on all tables. Admin/staff routes via Next.js middleware. Paystack webhook signature verification. |
| **Realtime** | Order status updates < 2 seconds end-to-end (customer tracking ↔ staff portal). |
| **Availability** | 99% uptime target via Supabase + Vercel managed infrastructure. |
| **Accessibility** | WCAG 2.1 AA. Keyboard navigable. ARIA labels on interactive elements. |
| **SEO** | Homepage and menu page server-rendered. Open Graph tags for social sharing. |

---

## 13. Delivery Phases

### Phase 1 — Foundation (Weeks 1–3)
- Next.js scaffold, Supabase setup, SQL tables applied, Tailwind config.
- Homepage (hero with Ken Burns, menu preview, about, contact).
- Menu page with all items.
- Cart and Paystack checkout (webhook handler).
- Order confirmation flow + redirect to tracking.
- Supabase Auth (email + Google).

### Phase 2 — Operations (Weeks 4–5)
- Real-time order tracking page (customer).
- Staff portal with live order queue and status controls (Supabase Realtime).
- Admin dashboard (overview cards, daily analytics via views, customer list).
- Brevo broadcast email integration in admin panel.

### Phase 3 — Polish (Week 6)
- Account dashboard (order history, reorder, saved address).
- Menu Manager in admin (add/edit/toggle items without code).
- Ken Burns hero animation refinement + optional Lottie overlay.
- Mobile audit across all pages.
- Lighthouse performance audit.
- Vercel deployment + custom domain.

### Phase 4 — v1.1 Enhancements (Future)
- Transactional emails: order confirmation, status update notifications (Resend).
- Loyalty/points system.
- AI-powered recommendations.

---

## 14. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Paystack webhook delayed — order created twice | Low | Idempotency key on webhook handler; check for existing order with same Paystack reference before insert. |
| Supabase Realtime drops connection on mobile | Medium | Implement reconnect logic with exponential backoff; fallback to polling every 15s. |
| Staff portal not usable on small phones | Medium | Design staff portal for tablet-first (minimum 768px); show banner recommending tablet on smaller screens. |
| Menu images too heavy on mobile data | Low | All images go through Next.js `<Image>` with WebP conversion, `sizes` attribute, and blur placeholder. |
| Brevo daily limit (300/day) hit on large customer list | Low | Batch sends across days; upgrade to paid tier when customer base exceeds 300 active emails. |

---

## 15. Open Questions

| # | Question | Decision Needed From |
|---|----------|----------------------|
| 1 | Is there a delivery radius limit or flat delivery fee, or does it vary by zone? | Business Owner |
| 2 | Should unauthenticated users be able to browse the menu and add to cart, with login only required at checkout? | Business Owner |
| 3 | Is there a fixed operating hours window that should block orders outside those hours? | Business Owner |
| 4 | Should the staff portal be a separate subdomain (staff.komiheritage.com) or a protected route (/staff)? | Business Owner / Dev |
| 5 | Do you want a WhatsApp fallback CTA on the menu page for customers who prefer that channel? | Business Owner |

---

*Komi Heritage Web App — PRD v1.1 | Prepared by Teniola John Ogunyemi | April 2025*
