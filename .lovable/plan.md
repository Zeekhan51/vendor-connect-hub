

# Fixes & Improvements Plan

## Issues Identified

1. **Events page is hardcoded** -- Events.tsx and UpcomingEvents.tsx use static arrays instead of reading from the database. The admin panel's EventManager actually works for CRUD, but the public pages ignore the DB.

2. **SponsorBenefits and VendorBenefits are hardcoded** -- They don't read from the `site_content` table even though data is already seeded there.

3. **SiteContentEditor uses raw JSON editing** -- Not user-friendly. Needs structured fields (text inputs for each benefit, etc.).

4. **Footer missing Zee Digital Solutions info** -- Need to add clickable email and WhatsApp link.

5. **No "Event Management Services" CTA section** -- Need a new promotional section.

6. **Christina's image shows "Promotional Materials" text** -- CSS `object-position` needs more aggressive cropping to hide the overlay text.

7. **Featured Vendors RLS error** -- The admin adding vendors with `is_featured=true` likely fails because the INSERT policy requires `is_featured = false`. Admin needs a separate INSERT policy.

---

## Changes

### 1. Fix Featured Vendors RLS Error
Add a new RLS policy allowing admins to insert vendors without the `is_featured = false` restriction. Currently only one INSERT policy exists that forces `is_featured = false`, which blocks admin too.

**SQL Migration:**
- Add `INSERT` policy for admins: `USING (has_role(auth.uid(), 'admin'))`

### 2. Events Page -- Read from Database
**Modify `src/pages/Events.tsx`:**
- Remove hardcoded events array
- Fetch events from `events` table using react-query
- Show DB events with their uploaded images, descriptions, ticket links
- Keep countdown timer for next upcoming event

**Modify `src/components/home/UpcomingEvents.tsx`:**
- Same approach -- fetch from DB, show up to 6 upcoming events
- Fallback message if no events in DB yet

### 3. Make Homepage Sections Dynamic (from DB)
**Modify `src/components/home/VendorBenefits.tsx`:**
- Fetch `vendor_benefits` from `site_content` table
- Parse JSON content to get benefits list
- Fall back to current hardcoded data if DB empty

**Modify `src/components/home/SponsorBenefits.tsx`:**
- Fetch `sponsor_benefits` from `site_content` table
- Parse JSON to get gold/silver/bronze perks arrays
- Fall back to hardcoded data if DB empty

**Modify `src/components/home/FeaturedVendors.tsx`:**
- Fetch approved + featured vendors from `vendors` table
- Show their images from `vendor_images` table
- Fall back to placeholder if none exist

**Modify `src/components/home/GallerySection.tsx`:**
- Fetch images from `gallery_images` table
- Fall back to static images if DB empty

### 4. User-Friendly Site Content Editor
**Rewrite `src/components/admin/SiteContentEditor.tsx`:**
- Instead of raw JSON textarea, show structured fields:
  - **Hero**: Title input, Subtitle input, CTA text, CTA link
  - **Vendor Benefits**: List of benefit items, each with Title + Description fields, with Add/Remove buttons
  - **Sponsor Benefits**: Three sections (Gold/Silver/Bronze), each with a list of perk text fields, Add/Remove
  - **Featured Vendor Benefits**: List of benefit text fields
  - **Raffle**: Title, Subtitle, Description text area
  - **Contact**: Phone, Email, Instagram, Facebook fields

### 5. Footer -- Add Zee Digital Solutions
**Modify `src/components/layout/Footer.tsx`:**
- Add a "Built by" section at the bottom:
  - "Zee Digital Solutions"
  - Email: info@zeedigitalsolutions.com (mailto link)
  - WhatsApp: +92-318-828-1135 (wa.me link)

### 6. Event Management Promotion Section
**Create `src/components/home/EventManagementCTA.tsx`:**
- New section: "Want us to manage your event professionally?"
- Brief description of event management services
- CTA buttons: "Contact Us" (links to contact section) and "Book a Consultation" (WhatsApp or phone link)

**Add to `src/pages/Index.tsx`** after ContactSection.

### 7. Fix Christina's Image
**Modify `src/components/home/AboutSection.tsx`:**
- Adjust `object-position` to crop lower/center to hide the "Promotional Materials" text at top
- Change from `object-[center_35%]` to something like `object-[center_60%]` to push the visible area down away from the text overlay

---

## Technical Details

### File Changes

| File | Action |
|------|--------|
| `src/pages/Events.tsx` | Rewrite to fetch from DB |
| `src/components/home/UpcomingEvents.tsx` | Rewrite to fetch from DB |
| `src/components/home/VendorBenefits.tsx` | Add DB fetch with fallback |
| `src/components/home/SponsorBenefits.tsx` | Add DB fetch with fallback |
| `src/components/home/FeaturedVendors.tsx` | Fetch real vendors from DB |
| `src/components/home/GallerySection.tsx` | Fetch from gallery_images table |
| `src/components/admin/SiteContentEditor.tsx` | Rewrite with structured fields |
| `src/components/layout/Footer.tsx` | Add Zee Digital Solutions info |
| `src/components/home/AboutSection.tsx` | Fix image crop position |
| `src/components/home/EventManagementCTA.tsx` | New file -- promotion section |
| `src/pages/Index.tsx` | Add EventManagementCTA component |
| SQL Migration | Fix admin INSERT policy on vendors table |

### Database Migration
- Drop existing restrictive INSERT policy on `vendors` that blocks admin
- Add admin INSERT policy (ALL policy already covers this, but the restrictive INSERT policy overrides it for inserts -- need to verify and fix)

