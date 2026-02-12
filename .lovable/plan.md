

# Triple C Events - Major Update Plan

## Overview
This update adds vendor/sponsor application forms, animated countdown timers, full event listings from social media, Christina's photo, a gallery section, admin login in footer, and uses the uploaded images + brand info from Facebook.

---

## 1. Add Uploaded Images to Project

Copy these images into `src/assets/`:
- `FB_IMG_1770873465786.jpg` -> `christina-owner.jpg` (Christina/owner photo for About section)
- `FB_IMG_1770873418005.jpg` -> `event-schedule-2.jpg` (Hop Into Spring schedule poster - Mar 22 to Apr 5)
- `FB_IMG_1770873415932.jpg` -> `event-schedule-1.jpg` (Hop Into Spring schedule poster - Mar 1 to Mar 15)
- `FB_IMG_1770871060584.jpg` -> `event-books-market.jpg` (Books & More Market poster)
- `FB_IMG_1770869442821.jpg` -> `event-coffee-market.jpg` (Coffee Everything Market poster)

The last uploaded image (M.Z Organic) appears to be a personal screenshot, not related to Triple C Events - will not be used.

---

## 2. Vendor Application Form Page (`/vendors`)

Create `src/pages/Vendors.tsx` with:
- Featured vendors section at top
- All vendors listing
- **Vendor Registration Form** with fields:
  - Business name, category, description
  - Contact: name, phone, email
  - Social media links (Instagram, Facebook, website)
  - Product image uploads (1-2 vertical images) - placeholder for now, actual upload needs storage
- Form submits via `mailto:info@zeedigitalsolutions.com` (using a mailto link that opens email client with form data)
- Zod validation on all fields

## 3. Sponsor Inquiry Form Page (`/sponsors`)

Create `src/pages/Sponsors.tsx` with:
- Sponsorship tiers display (Gold, Silver, Bronze) with benefits
- **Sponsor Inquiry Form** with fields:
  - Company name, contact person, email, phone
  - Desired tier selection (Gold/Silver/Bronze)
  - Message/notes
- Form submits via `mailto:info@zeedigitalsolutions.com`
- Zod validation

## 4. Animated Countdown Timer Component

Create `src/components/home/CountdownTimer.tsx`:
- Beautiful animated countdown to the next upcoming event
- Shows Days, Hours, Minutes, Seconds in flip-card or animated number style
- Uses framer-motion for smooth animations
- Placed prominently in the Upcoming Events section or Hero section
- Auto-calculates from the next event date

## 5. Full Events Page with All Events (`/events`)

Create `src/pages/Events.tsx` with all the events from social media:

**Hop Into Spring Vendor Mall - March/April Schedule:**
- March 1 - Artisan Market (9AM-3PM)
- March 8 - Books & More Market (9AM-3PM)
- March 15 - Everything Coffee (9AM-3PM)
- March 22 - It's a Dog World (9AM-3PM)
- March 29 - The Edible Experience (9AM-3PM)
- April 1 - Fashion Frenzy (9AM-3PM)

Each event shows:
- Event name, date, time, venue (The MilliUp Event Center)
- Description from the flyers
- Event image (vertical format option for admin later)
- Ticket link to Eventbrite
- Countdown timer for the next upcoming event

**Location info**: The MilliUp Event Center, 210 E. Trade Street # C-244 (Second Floor), Charlotte NC 28202

## 6. Update Homepage - Upcoming Events Section

Update `UpcomingEvents.tsx`:
- Replace single mock event with all the events from the schedule
- Add animated countdown timer to the next upcoming event
- Show event images from uploaded flyers
- "View All Events" button linking to `/events`

## 7. "Meet the Owner" / About Section on Homepage

Create `src/components/home/AboutSection.tsx`:
- Christina's photo (from uploaded image)
- Brief about Triple C Events
- Services offered (from the flyer):
  - 1:1 Business Coaching Sessions
  - Customized Growth Strategies
  - Branding & Marketing Guidance
  - Social Media & Content Planning
  - Door to Door Flyering
  - Graphic Design (Flyers, Business Cards, etc.)
  - Exclusive Workshops & Events
- "Book Your Free Clarity Call" CTA
- Facebook link: https://www.facebook.com/share/17uYBbGuyE/

## 8. Gallery Section on Homepage

Create `src/components/home/GallerySection.tsx`:
- Grid of event images from uploaded flyers
- Click to enlarge (lightbox modal)
- Left/right navigation to swipe between images
- Uses framer-motion for smooth transitions
- "View More" link if many images

## 9. Update Social Links

Update across the site:
- Instagram: @triplecccevents_
- Facebook: Triple Cha-nel (https://www.facebook.com/share/17uYBbGuyE/)
- Phone: (704) 506-7253
- Email: triplecccevents1@gmail.com

## 10. Admin Login Button in Footer

Update `Footer.tsx`:
- Add small "Admin Login" text button at the bottom
- Links to `/admin` route
- Simple password-based login page at `/admin`:
  - Email: info@zeedigitalsolutions.com
  - Password: Care@2019
  - For now, hardcoded check (will move to Supabase auth later)
- After login, shows admin dashboard placeholder

## 11. Update App Routes

Add routes in `App.tsx`:
- `/vendors` - Vendors page with registration form
- `/sponsors` - Sponsors page with inquiry form
- `/events` - Full events listing
- `/admin` - Admin login page

## 12. Homepage Section Order Update

Update `Index.tsx` section order:
1. HeroSection (with countdown to next event)
2. AboutSection (Meet Christina / About Triple C Events)
3. VendorBenefits
4. SponsorBenefits
5. FeaturedVendors
6. UpcomingEvents (with countdown timer, all events)
7. GallerySection (event photos lightbox)
8. RaffleSection
9. ContactSection

---

## Technical Details

- **Form submission**: Using `mailto:info@zeedigitalsolutions.com` with form data encoded in the email body. This opens the user's email client with pre-filled data.
- **Countdown timer**: Uses `setInterval` with 1-second updates, calculates difference from current time to next event date.
- **Gallery lightbox**: Custom modal with framer-motion AnimatePresence for enter/exit animations, keyboard navigation (arrow keys, Escape).
- **Admin auth**: Simple hardcoded check for now. Will be replaced with Supabase auth in the next phase.
- **Event images**: The uploaded flyer images will be used as event images. Each event entry supports a vertical image field.
- **No new dependencies needed** - everything uses existing framer-motion, lucide-react, react-router-dom, and shadcn/ui components.

