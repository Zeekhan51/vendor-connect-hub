
# Complete Bug Fix: Admin Panel, Events Navigation, Gallery & Owner Image

## Issues Identified

1. **Admin panel tabs stuck on "Loading..."** -- The admin queries for events, vendors, sponsors, site content, and gallery ALL work correctly (RLS policies are fine, data exists in DB). The "Loading..." issue is caused by the **useAdmin hook's 5-second delay** before resolving. During this time, the page shows a spinner. After the timeout, if Lovable's preview auth is detected (non-admin user), it shows "ACCESS DENIED" instead of the login form. The actual user likely sees either a stuck spinner or the login form but then after login, the admin queries work fine. However, the `isLoading` state in each manager component shows "Loading vendors/sponsors/events..." text indefinitely if there's a query error or slow connection with no timeout.

2. **Events/Gallery hash links don't scroll** -- React Router's `<Link to="/#events">` does NOT handle hash-based scrolling. It changes the URL but doesn't scroll to the element. Need to implement actual scroll-to-anchor behavior.

3. **Gallery upload stuck on "Uploading..."** -- The storage policies are correct. The upload mutation calls `setUploading(true)` but if there's an error, it might not reset properly. Also the `onSuccess` resets uploading but there could be silent failures. Need better error handling and upload feedback.

4. **Gallery images not showing on homepage** -- The GallerySection component correctly queries `gallery_images` and falls back to hardcoded images if none exist. There IS 1 image in the DB but if it failed to upload to storage, the URL would be broken. Need to verify and ensure proper fallback.

5. **Owner image needs replacing** -- The uploaded `christi.jpg` needs to replace the current `christina-owner.jpg` in the About section.

6. **No events showing on homepage** -- Events ARE in the database (6 records). The homepage query returns them successfully (verified via network logs). This should be working now. If it wasn't before, it was because the events were just inserted.

---

## Fixes

### 1. Hash Scroll Navigation (Header.tsx)
- Replace `<Link>` with `<a>` tags for hash links (`/#events`, `/#gallery`)  
- OR add a `useEffect` in App.tsx that listens for hash changes and scrolls to the element
- Implement smooth scroll behavior when clicking Events/Gallery nav links

### 2. Owner Image Replacement (AboutSection.tsx)
- Copy `user-uploads://christi.jpg` to `src/assets/christi.jpg`
- Update the import in AboutSection.tsx from `christina-owner.jpg` to `christi.jpg`

### 3. Admin Panel Reliability (useAdmin.ts)
- Reduce the safety timeout from 5 seconds to 2 seconds
- Fix the stale closure bug where `loading` in setTimeout always reads `true`
- Ensure login form appears immediately when no session exists

### 4. Gallery Upload Error Handling (GalleryManager.tsx)
- Add explicit try/catch around each upload step
- Show specific error messages for storage upload failures
- Ensure uploading state resets on ALL error paths
- Add file size validation before upload

### 5. Smooth Scroll Component (App.tsx or new utility)
- Add a `ScrollToHash` component inside BrowserRouter that handles `/#events` and `/#gallery` navigation
- Implements `useEffect` + `useLocation` to detect hash changes and scroll to elements

---

## Technical Details

### Header.tsx
- For hash links, use `onClick` handlers that manually scroll to elements instead of relying on react-router Link:
```tsx
// For /#events and /#gallery links
onClick={(e) => {
  if (window.location.pathname === '/') {
    e.preventDefault();
    document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
  }
}}
```

### useAdmin.ts
- Fix timeout to use a ref or direct check instead of stale closure
- Reduce timeout to 2 seconds for faster feedback

### GalleryManager.tsx  
- Wrap individual file uploads in try/catch
- Add toast notification for each failed upload with specific error
- Add 5MB max file size check before upload attempt

### AboutSection.tsx
- Update import to use new christi.jpg image

### App.tsx
- Add `ScrollToHash` component that uses `useLocation()` hook to detect hash changes and scroll to matching elements with smooth behavior

### No database or RLS changes needed -- all policies and data are correct.
