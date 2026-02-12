

# Fix: Admin Login Access and Gallery Menu Link

## Problem 1: Admin Login Not Accessible
The admin page exists at `/admin` but there is no way to reach it from the website navigation. The login form code is working correctly -- it's just not linked anywhere in the menu.

**Fix:** Add a small, subtle "Admin" link in the **Footer** (not the main nav -- admin access should not be prominent to regular visitors). This is standard practice for admin panels.

## Problem 2: Gallery Not in Menu
The Gallery section exists on the homepage but there is no dedicated menu link. 

**Fix:** Add "Gallery" to the navigation menu in the Header. Since the gallery is a section on the homepage, clicking it will scroll to that section.

---

## Technical Details

### File: `src/components/layout/Header.tsx`
- Add `{ label: "Gallery", to: "/#gallery" }` to the `navLinks` array
- This requires adding an `id="gallery"` anchor to the `GallerySection` component so the link scrolls to it

### File: `src/components/home/GallerySection.tsx`
- Add `id="gallery"` to the outermost section element so the nav link can scroll to it

### File: `src/components/layout/Footer.tsx`
- Add a small "Admin Login" link at the bottom of the footer pointing to `/admin`
- Styled subtly so it doesn't distract regular visitors

### No database changes needed.
