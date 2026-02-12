
-- Fix: Restrict vendor inserts to only allow pending status
DROP POLICY "Anyone can insert vendor applications" ON public.vendors;
CREATE POLICY "Anyone can insert vendor applications" ON public.vendors
  FOR INSERT WITH CHECK (status = 'pending' AND is_featured = false);

-- Fix: Restrict sponsor inserts to only allow pending status
DROP POLICY "Anyone can insert sponsor inquiries" ON public.sponsors;
CREATE POLICY "Anyone can insert sponsor inquiries" ON public.sponsors
  FOR INSERT WITH CHECK (status = 'pending');
