
-- Fix: Allow admins to INSERT vendors with any status/featured flag
CREATE POLICY "Admins can insert vendors"
ON public.vendors
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
