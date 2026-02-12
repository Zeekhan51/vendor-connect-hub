

# Fix: Admin White Page & Events Menu Link

## Problem 1: Admin White Page
The admin login page code is working correctly -- I tested it and successfully logged in. The "white page" was caused by the Vite development server restarting after code changes (console shows "server connection lost. Polling for restart..."). This happens temporarily when new code is deployed.

**Fix:** Add an error boundary wrapper around the Admin page to prevent white screens from unhandled errors. Also ensure that if any import fails, a proper fallback is shown instead of a blank page.

## Problem 2: Events Menu Button
Currently, clicking "Events" in the menu navigates to `/events` (a separate full page). You want it to scroll to the "Upcoming Events" section on the homepage instead.

**Fix:**
- Change the Events nav link from `/events` to `/#events`
- Add `id="events"` to the UpcomingEvents section so the anchor scroll works
- Keep the separate `/events` page accessible via the "View All Events" button inside the UpcomingEvents section

---

## Technical Details

### File: `src/components/layout/Header.tsx`
- Change `{ label: "Events", to: "/events" }` to `{ label: "Events", to: "/#events" }`

### File: `src/components/home/UpcomingEvents.tsx`
- Add `id="events"` to the section element (line 30)

### File: `src/pages/Admin.tsx`
- Wrap the component in an error boundary to catch any rendering crashes and show a proper message instead of a white page

### No database changes needed.
