# 👑 AURÉLIEN Admin & Boutique Manager Operations Manual
**ATELIER FINE CREATIONS / AURÉLIEN Haute Joaillerie & Horlogerie**

Welcome to the **AURÉLIEN Atelier Administrative Portal**. This manual assists boutique managers, master jewelers, and concierge executives with catalog maintenance, inventory controls, price updates, external purchase links, and private customer consultations.

---

## 1. Accessing the Portal

1. **URL**:
   - Production: `https://aurelien.gold/admin` (or `https://aurelien.gold/admin/login`)
   - Development: `http://localhost:5173/admin/login`
2. **Credentials**:
   - Default Administrator: `admin@aurelien.gold`
   - Initial Password: Set during initial deployment (`ADMIN_DEFAULT_PASSWORD`)
3. Click **Enter Atelier Suite**.
4. The system validates credentials, checks the user role (`ADMIN` or `SUPER_ADMIN`), and stores a secure session token.

---

## 2. Navigating the Dashboard

Upon logging in, the **Admin Dashboard** displays high-level boutique metrics:
- **Total Masterpiece Pieces**: Count of all active jewels and complications in the catalog.
- **Pending Client Consultations**: Inquiries requiring prompt concierge response.
- **Featured Collection Showcase**: Number of items highlighted on the primary storefront hero & carousel.
- **Live Gold Reference Rates**: Reference price per gram (24K, 22K, 18K) to assist quoting bespoke orders.

---

## 3. Product & Catalog Management (`/admin/products`)

### Adding a New Masterpiece (`/admin/products/new`)
1. Click **+ Add Masterpiece** in the top-right corner.
2. Fill out piece specifications:
   - **Name**: e.g. *Sovereign 24K Gold Celestial Tourbillon*.
   - **Category**: Select appropriate collection (Bespoke Watches, Designer Rings, Leather Straps, Bridal).
   - **Purity / Karatage**: Select `24K (999)`, `22K (916)`, `18K (750)`, or `Platinum 950`.
   - **Gross Weight (g)**: Exact weight measured on certified precision scales.
   - **Net Gold Weight (g)**: Weight of pure metal excluding encrusted diamonds or colored gemstones.
   - **Price**: Numeric price (e.g. `125000`) and currency (`USD`, `EUR`, `GBP`).
   - **External Purchase URL**: Direct checkout link (e.g. Stripe checkout, Shopify link, or private boutique payment portal).
   - **Publication Status**: Set to `Published` (visible to public), `Draft` (hidden), or `Archived`.
   - **BIS Hallmark Certification**: Toggle checkbox to confirm hallmarking assay seal.
   - **Featured on Flagship**: Check to feature item in homepage curated spotlight.
   - **Product Images**: Enter high-resolution asset URLs (e.g. `/images/products/...` or CDN URLs).
3. Click **Save to Catalog**.

### Editing an Existing Piece (`/admin/products/:id/edit`)
- Locate the item in the table.
- Click **Edit** to update weights, prices, photographs, or external purchase links.
- Click **Save Changes**.

### Deleting a Piece
- Click the **Delete** button next to any product.
- An accessible confirmation modal appears: *"Are you certain you wish to remove this masterpiece? This action cannot be undone."*
- Confirm deletion to remove the record.

---

## 4. External Purchase Link Configuration

For pieces available for direct acquisition:
1. In the product editor, locate the **External Purchase URL** field.
2. Enter the full secure HTTPS URL (e.g., `https://checkout.stripe.com/...`, `https://boutique.aurelien.gold/...`).
3. When customers view this piece in the public gallery, the **"Buy Now"** button appears and safely opens this link in a new tab with `rel="noopener noreferrer"`.
4. If this field is left blank, the card provides an **"Inquire"** action directing the client to private viewing scheduling.

---

## 5. Category Management (`/admin/categories`)

From the sidebar, select **Categories**:
- View all active collections with their associated product counts.
- Add new categories with custom slug identifiers and optional banner URLs.
- Update category display order to adjust storefront presentation.

---

## 6. Managing Client Inquiries & Consultations (`/admin/inquiries`)

From the sidebar, select **Inquiries**:

1. High-priority inquiries appear marked as `PENDING`.
2. Inspect inquiry details:
   - Client name, email, phone number.
   - Karat preference (e.g., `22K`, `24K`).
   - Consultation message and piece of interest.
3. Update Status:
   - `PENDING` -> Initial client submission.
   - `CONTACTED` -> Concierge reached out via phone or email.
   - `SCHEDULED` -> Private salon VIP suite reserved.
   - `CLOSED` -> Order completed or archived.
4. Add **Internal Concierge Notes**: Record client finger sizes, custom engraving requests, or private viewing timestamps.

---

## 7. Security Best Practices

- Always log out using the **Sign Out** button in the lower-left navigation bar after concluding management sessions.
- Do not share master credentials over unsecured channels.
- Use distinct logins for individual sales associates to maintain full auditability.
- Never disable rate limiting or use default passwords in production environments.
