
-- 1. Create enum types
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.vendor_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.sponsor_tier AS ENUM ('gold', 'silver', 'bronze');

-- 2. Create vendors table
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  contact_name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  instagram TEXT DEFAULT '',
  facebook TEXT DEFAULT '',
  website TEXT DEFAULT '',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  status public.vendor_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create vendor_images table
CREATE TABLE public.vendor_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Create sponsors table
CREATE TABLE public.sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_person TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  tier public.sponsor_tier NOT NULL DEFAULT 'bronze',
  message TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  status public.vendor_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time_start TEXT DEFAULT '9:00 AM',
  time_end TEXT DEFAULT '3:00 PM',
  venue TEXT DEFAULT 'The MilliUp Event Center',
  address TEXT DEFAULT '210 E. Trade Street # C-244 (Second Floor), Charlotte NC 28202',
  description TEXT DEFAULT '',
  ticket_link TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  is_past BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Create gallery_images table
CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Create site_content table
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  title TEXT DEFAULT '',
  subtitle TEXT DEFAULT '',
  content JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- 9. Enable RLS on all tables
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 10. Create has_role security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 11. RLS Policies - Vendors
CREATE POLICY "Public can view approved vendors" ON public.vendors
  FOR SELECT USING (status = 'approved');
CREATE POLICY "Anyone can insert vendor applications" ON public.vendors
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all vendors" ON public.vendors
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update vendors" ON public.vendors
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete vendors" ON public.vendors
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 12. RLS Policies - Vendor Images
CREATE POLICY "Public can view vendor images" ON public.vendor_images
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage vendor images" ON public.vendor_images
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 13. RLS Policies - Sponsors
CREATE POLICY "Public can view approved sponsors" ON public.sponsors
  FOR SELECT USING (status = 'approved');
CREATE POLICY "Anyone can insert sponsor inquiries" ON public.sponsors
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all sponsors" ON public.sponsors
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update sponsors" ON public.sponsors
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete sponsors" ON public.sponsors
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 14. RLS Policies - Events
CREATE POLICY "Public can view events" ON public.events
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage events" ON public.events
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 15. RLS Policies - Gallery
CREATE POLICY "Public can view gallery" ON public.gallery_images
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage gallery" ON public.gallery_images
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 16. RLS Policies - Site Content
CREATE POLICY "Public can view site content" ON public.site_content
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage site content" ON public.site_content
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 17. RLS Policies - User Roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 18. Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('vendor-images', 'vendor-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('sponsor-logos', 'sponsor-logos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);

-- 19. Storage Policies
CREATE POLICY "Public read vendor images" ON storage.objects FOR SELECT USING (bucket_id = 'vendor-images');
CREATE POLICY "Admin upload vendor images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'vendor-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete vendor images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'vendor-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read sponsor logos" ON storage.objects FOR SELECT USING (bucket_id = 'sponsor-logos');
CREATE POLICY "Admin upload sponsor logos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'sponsor-logos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete sponsor logos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'sponsor-logos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read event images" ON storage.objects FOR SELECT USING (bucket_id = 'event-images');
CREATE POLICY "Admin upload event images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'event-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete event images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'event-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Admin upload gallery" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete gallery" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));

-- 20. Seed site content
INSERT INTO public.site_content (section_key, title, subtitle, content) VALUES
('hero', 'TRIPLE C EVENTS', 'Charlotte''s Premier Vendor Mall & Market Events', '{"cta_text": "Become a Vendor", "cta_link": "/vendors"}'),
('vendor_benefits', 'WHY BECOME A VENDOR?', 'Join Charlotte''s fastest-growing vendor community', '{"benefits": [{"title": "Prime Location", "desc": "High-traffic venue in the heart of Charlotte"}, {"title": "Marketing Support", "desc": "Social media promotion & event flyers"}, {"title": "Growing Audience", "desc": "Hundreds of attendees every Sunday"}, {"title": "Community", "desc": "Network with fellow entrepreneurs"}]}'),
('sponsor_benefits', 'SPONSORSHIP TIERS', 'Put your brand in front of hundreds of attendees', '{"gold": ["Premium logo on ALL event materials", "VIP booth placement at every event", "Free vendor table at all events", "Weekly social media spotlight posts", "Homepage featured section with large logo", "MC shoutouts throughout every event", "VIP event tickets for sponsor team", "Exclusive Presented by branding", "Newsletter feature to all subscribers"], "silver": ["Logo on event banners and flyers", "Priority booth placement", "Bi-weekly social media posts", "Website sponsors page with logo", "MC shoutouts during events", "Discounted vendor table fees", "Event tickets for sponsor team"], "bronze": ["Logo on event programs and flyers", "Monthly social media mention", "Website sponsors page listing", "MC acknowledgment during events"]}'),
('featured_vendor_benefits', 'FEATURED VENDOR BENEFITS', 'Get premium promotion for your business', '{"benefits": ["Star badge and highlighted card on homepage", "Top placement on vendors page", "Social media spotlight posts", "Featured in event newsletters", "Premium booth location at events", "Larger display space on website", "Featured Vendor announcement by MC at events"]}'),
('raffle', 'CUSTOMER APPRECIATION RAFFLE', 'Win a CASH PRIZE every month!', '{"description": "When you make a purchase from a vendor, you will receive raffle tickets for entry into our monthly raffle to win a CASH PRIZE!"}'),
('contact', 'GET IN TOUCH', 'We''d love to hear from you', '{"email": "triplecccevents1@gmail.com", "phone": "(704) 506-7253", "instagram": "triplecccevents_", "facebook": "https://www.facebook.com/share/17uYBbGuyE/"}');

-- 21. Update timestamp trigger for site_content
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
