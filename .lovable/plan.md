

# Fix: Gallery Issues, Events Section & Admin Stability

## Issues Found

### 1. Gallery Delete Not Working on Mobile
The delete button on gallery images uses `group-hover:opacity-100` which only works with mouse hover -- on mobile/touch devices, this button is invisible and untouchable. This is why you can't delete images.

### 2. Gallery Upload Error Handling
The upload mutation doesn't show clear errors when something goes wrong. If there's a storage size limit or network issue, you get no feedback.

### 3. Events Table is Empty
The events database table has **zero events** in it. When the code was switched from hardcoded data to database-driven, the old hardcoded events were removed but no events were inserted into the database. That's why:
- The "Events" menu button scrolls to nothing (the section hides itself when empty)
- The admin panel Events tab correctly shows "No events yet"

### 4. Events Section Hides When Empty
The UpcomingEvents component returns `null` when there are no events, so the `#events` anchor doesn't exist and the menu link has nowhere to scroll to.

---

## Fixes

### File: `src/components/admin/GalleryManager.tsx`
- Make the delete button **always visible** (not hidden behind hover) so it works on mobile/touch devices
- Add better error toast messages for upload failures

### File: `src/components/home/UpcomingEvents.tsx`
- Always render the section with the `id="events"` anchor, even when events list is empty
- Show a message like "No upcoming events -- check back soon!" when the database has no events
- This ensures the menu "Events" link always has a target to scroll to

### Pre-populate Events Database
- Insert the recurring Sunday market events (March-April schedule) into the events table so they show up immediately on the homepage and in the admin panel for editing

### File: `src/pages/Admin.tsx`
- No changes needed -- admin login is working correctly (verified by testing). The white page was a temporary Vite server restart issue that has been resolved with the error boundary already in place.

---

## Technical Details

### GalleryManager.tsx Changes
- Remove `opacity-0 group-hover:opacity-100` from the delete button
- Replace with always-visible styling with a semi-transparent background
- Add `onError` handler to `deleteMutation` for error feedback

### UpcomingEvents.tsx Changes  
- Remove the `if (events.length === 0) return null;` line
- Add an empty-state message inside the section so the anchor point always exists

### Database: Insert Events
Use the data insertion tool to add events like:
- "Hop Into Spring Vendor Mall" for each upcoming Sunday
- With venue "The MilliUp Event Center", time 9AM-3PM
- Include Eventbrite ticket links if available

### No schema changes needed.

