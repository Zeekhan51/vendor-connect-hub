

# Admin Panel & Database Setup — Full Implementation Plan

## Overview
This update will set up **Lovable Cloud (Supabase)** as the backend and build a fully functional admin dashboard where the admin can manage vendors, sponsors, events, gallery images, and all homepage content. It also fixes Christina's image (crop to show only her face) and enhances sponsor/vendor benefits.

---

## Phase 1: Enable Lovable Cloud & Database Setup

### Database Tables

**vendors**
- id, business_name, category, description, contact_name, phone, email, instagram, facebook, website, is_featured, is_approved, status (pending/approved/rejected), created_at

**sponsors**
- id, company_name, contact_person, email, phone, tier (gold/silver/bronze), message, logo_url, is_approved, status (pending/approved/rejected), created_at

**events**
- id, title, date, time_start, time_end, venue, address, description, ticket_link, image_url, is_past, created_at

**gallery_images**
- id, image_url, alt_text, display_order, created_at

**site_content**
- id, section_key (unique), title, subtitle, content (JSON), updated_at
- For storing editable homepage text: hero title, vendor benefits, sponsor benefits/pricing, raffle info, contact info, etc.

**vendor_images**
- id, vendor_id (FK to vendors), image_url, display_order, created_at

### Storage Buckets
- **vendor-images** — Product photos (1-2 vertical images per vendor)
- **sponsor-logos** — Sponsor company logos
- **event-images** — Event flyer/poster images
- **gallery** — Gallery section images

### Authentication & Roles
- Use Supabase Auth for admin login (replacing hardcoded credentials)
- Create `user_roles` table with `app_role` enum (admin, user)
- RLS policies: Admin can CRUD everything; public can read approved vendors, sponsors, events, gallery
- Security definer function `has_role()` to check admin status

### RLS Policies
- Vendors table: Public SELECT where is_approved = true; Admin full access
- Sponsors table: Public SELECT where is_approved = true; Admin full access
- Events table: Public SELECT all; Admin full access
- Gallery: Public SELECT; Admin INSERT/UPDATE/DELETE
- Site content: Public SELECT; Admin UPDATE
- Storage buckets: Public read on all; Admin upload/delete

---

## Phase 2: Admin Dashboard (Full CRUD)

Replace the empty admin dashboard with a tabbed interface containing:

### Tab 1: Dashboard Overview
- Stats cards: Total vendors (pending/approved), Total sponsors, Upcoming events, Gallery images count
- Recent vendor/sponsor applications list

### Tab 2: Manage Vendors
- Table listing all vendors with columns: Name, Category, Status, Featured, Actions
- **Add Vendor** button — Form to manually add a vendor (name, category, description, contact info, social links, upload 1-2 product images)
- **Edit Vendor** — Edit any vendor details, upload/replace images
- **Approve/Reject** — For vendor applications submitted from the public form
- **Mark as Featured** toggle — Featured vendors get special promotion
- **Delete** vendor

### Tab 3: Manage Sponsors
- Table listing all sponsors with columns: Company, Tier, Status, Actions
- **Add Sponsor** — Manually add with logo upload
- **Edit Sponsor** — Edit details, change tier, replace logo
- **Approve/Reject** — For sponsor inquiries
- **Delete** sponsor

### Tab 4: Manage Events
- List of all events (upcoming and past)
- **Add Event** — Title, date, time, venue, description, ticket link, image upload (vertical format)
- **Edit Event** — Update any field, replace image
- **Mark as Past** — Move to past events section
- **Delete** event

### Tab 5: Gallery
- Grid view of all gallery images
- **Add Images** — Upload multiple images
- **Delete Image** — Remove from gallery
- **Reorder** — Drag or number-based ordering

### Tab 6: Site Content
- Editable sections for homepage content:
  - Hero section text (title, subtitle)
  - Vendor benefits (list of benefit title + description pairs)
  - Sponsor benefits & pricing per tier (Gold/Silver/Bronze benefits list)
  - Featured vendor benefits description
  - Raffle section text
  - Contact information

---

## Phase 3: Enhanced Sponsor Benefits

Update sponsor tiers with richer benefits:

**Gold Sponsor:**
- Premium logo on ALL event materials (banners, flyers, tickets)
- VIP booth placement at every event (best location)
- Free vendor table at all events
- Weekly social media spotlight posts
- Homepage featured section with large logo
- MC shoutouts throughout every event
- VIP event tickets for sponsor team
- Exclusive "Presented by" branding
- Newsletter feature to all subscribers

**Silver Sponsor:**
- Logo on event banners and flyers
- Priority booth placement
- Bi-weekly social media posts
- Website sponsors page with logo
- MC shoutouts during events
- Discounted vendor table fees
- Event tickets for sponsor team

**Bronze Sponsor:**
- Logo on event programs and flyers
- Monthly social media mention
- Website sponsors page listing
- MC acknowledgment during events

---

## Phase 4: Enhanced Featured Vendor Benefits

Featured vendors (paid promotion) get:
- Star badge and highlighted card on homepage
- Top placement on vendors page
- Social media spotlight posts
- Featured in event newsletters
- Premium booth location at events
- Larger display space on website (product images prominently shown)
- "Featured Vendor" announcement by MC at events

---

## Phase 5: Update Public Pages

### Vendor Registration Form
- Update to save directly to Supabase (status: pending) instead of mailto
- Admin gets notified of new applications

### Sponsor Inquiry Form
- Update to save directly to Supabase (status: pending) instead of mailto

### Homepage Sections
- All sections (VendorBenefits, SponsorBenefits, FeaturedVendors, UpcomingEvents, Gallery, Raffle) read data from Supabase
- Featured vendors show real data with product images and social links
- Gallery shows images from Supabase storage with lightbox

### Events Page
- Read events from database
- Admin-added events show with uploaded images

---

## Phase 6: Christina's Image Fix

- Crop the owner image (`christina-owner.jpg`) to show only Christina's face clearly, removing the promotional text/overlay from the top of the image
- Use CSS `object-position` and `object-fit` to focus on her face area

---

## Technical Details

### File Changes Summary

**New Files:**
- `src/integrations/supabase/` — Auto-generated client and types
- `src/components/admin/AdminDashboard.tsx` — Main admin layout with tabs
- `src/components/admin/VendorManager.tsx` — Vendor CRUD with image uploads
- `src/components/admin/SponsorManager.tsx` — Sponsor CRUD with logo upload
- `src/components/admin/EventManager.tsx` — Event CRUD with image upload
- `src/components/admin/GalleryManager.tsx` — Gallery image management
- `src/components/admin/SiteContentEditor.tsx` — Homepage content editor
- `src/hooks/useAdmin.ts` — Admin auth hook
- `src/hooks/useVendors.ts` — Vendor data queries
- `src/hooks/useSponsors.ts` — Sponsor data queries
- `src/hooks/useEvents.ts` — Event data queries
- `src/hooks/useGallery.ts` — Gallery data queries
- `src/hooks/useSiteContent.ts` — Site content queries

**Modified Files:**
- `src/pages/Admin.tsx` — Replace with Supabase auth + full dashboard
- `src/pages/Vendors.tsx` — Form saves to DB, reads vendors from DB
- `src/pages/Sponsors.tsx` — Form saves to DB, reads sponsors from DB
- `src/pages/Events.tsx` — Reads events from DB
- `src/components/home/FeaturedVendors.tsx` — Reads from DB
- `src/components/home/UpcomingEvents.tsx` — Reads from DB
- `src/components/home/GallerySection.tsx` — Reads from DB
- `src/components/home/VendorBenefits.tsx` — Reads editable content from DB
- `src/components/home/SponsorBenefits.tsx` — Reads editable content from DB, enhanced benefits
- `src/components/home/AboutSection.tsx` — Fix Christina image crop

### Dependencies
- No new npm packages needed (Supabase client auto-configured by Lovable Cloud)

### Migration Sequence
1. Create enum types (app_role)
2. Create base tables (vendors, sponsors, events, gallery_images, site_content, vendor_images)
3. Create user_roles table
4. Create has_role() security definer function
5. Create storage buckets
6. Set up RLS policies on all tables and storage
7. Seed initial site_content data (current hardcoded values)
8. Create admin user account

