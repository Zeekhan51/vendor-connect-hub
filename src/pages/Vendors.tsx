import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Star, Send, Instagram, Facebook, Globe } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const vendorSchema = z.object({
  businessName: z.string().trim().min(2, "Business name is required").max(100),
  category: z.string().min(1, "Please select a category"),
  description: z.string().trim().min(10, "Please describe your business").max(500),
  contactName: z.string().trim().min(2, "Contact name is required").max(100),
  phone: z.string().trim().min(10, "Valid phone number required").max(20),
  email: z.string().trim().email("Valid email required").max(255),
  instagram: z.string().max(100).optional(),
  facebook: z.string().max(200).optional(),
  website: z.string().max(200).optional(),
});

type VendorForm = z.infer<typeof vendorSchema>;

const categories = ["Artisan / Handmade", "Food & Beverages", "Fashion & Accessories", "Books & Media", "Health & Beauty", "Pet Products", "Home & Décor", "Other"];

const Vendors = () => {
  const location = useLocation();
  const form = useForm<VendorForm>({
    resolver: zodResolver(vendorSchema),
    defaultValues: { businessName: "", category: "", description: "", contactName: "", phone: "", email: "", instagram: "", facebook: "", website: "" },
  });

  const { data: approvedVendors = [] } = useQuery({
    queryKey: ["public-vendors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("vendors").select("*").eq("status", "approved").order("is_featured", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: vendorImages = [] } = useQuery({
    queryKey: ["public-vendor-images"],
    queryFn: async () => {
      const { data, error } = await supabase.from("vendor_images").select("*");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (location.hash === "#register") {
      setTimeout(() => document.getElementById("register")?.scrollIntoView({ behavior: "smooth" }), 300);
    }
  }, [location]);

  const submitMutation = useMutation({
    mutationFn: async (data: VendorForm) => {
      const { error } = await supabase.from("vendors").insert({
        business_name: data.businessName,
        category: data.category,
        description: data.description,
        contact_name: data.contactName,
        phone: data.phone,
        email: data.email,
        instagram: data.instagram || "",
        facebook: data.facebook || "",
        website: data.website || "",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Application Submitted!", description: "We'll review your application and get back to you soon." });
      form.reset();
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const featuredVendors = approvedVendors.filter((v) => v.is_featured);
  const regularVendors = approvedVendors.filter((v) => !v.is_featured);

  return (
    <Layout>
      <section className="py-16 bg-foreground text-primary-foreground">
        <div className="container text-center">
          <h1 className="font-display text-5xl md:text-6xl mb-4">OUR <span className="text-primary">VENDORS</span></h1>
          <p className="font-body text-primary-foreground/70 max-w-xl mx-auto">Discover amazing local businesses at our events. Want to join? Apply below!</p>
        </div>
      </section>

      {/* Featured Vendors */}
      {featuredVendors.length > 0 && (
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="font-display text-3xl text-center mb-8">FEATURED <span className="text-primary">VENDORS</span></h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {featuredVendors.map((v) => {
                const images = vendorImages.filter((vi) => vi.vendor_id === v.id);
                return (
                  <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="bg-background border-2 border-secondary/40 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-secondary/10 transition-all">
                    {images.length > 0 ? (
                      <img src={images[0].image_url} alt={v.business_name} className="w-full h-48 object-cover" />
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <span className="font-display text-4xl text-foreground/20">{v.business_name[0]}</span>
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Star size={16} className="text-secondary fill-secondary" />
                        <span className="text-xs font-display text-secondary">FEATURED</span>
                      </div>
                      <h3 className="font-display text-2xl text-foreground">{v.business_name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{v.category}</p>
                      {v.description && <p className="text-sm text-muted-foreground mt-2">{v.description}</p>}
                      <div className="flex gap-2 mt-3">
                        {v.instagram && <a href={`https://instagram.com/${v.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer"><Instagram size={16} className="text-primary" /></a>}
                        {v.facebook && <a href={v.facebook} target="_blank" rel="noopener noreferrer"><Facebook size={16} className="text-primary" /></a>}
                        {v.website && <a href={v.website} target="_blank" rel="noopener noreferrer"><Globe size={16} className="text-primary" /></a>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* All Vendors */}
      {regularVendors.length > 0 && (
        <section className="py-12 bg-background">
          <div className="container">
            <h2 className="font-display text-3xl text-center mb-8">ALL <span className="text-primary">VENDORS</span></h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {regularVendors.map((v) => (
                <div key={v.id} className="border border-border rounded-lg p-4">
                  <h3 className="font-display text-xl text-foreground">{v.business_name}</h3>
                  <p className="text-sm text-muted-foreground">{v.category}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Registration Form */}
      <section id="register" className="py-20 bg-card">
        <div className="container max-w-2xl">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="font-display text-4xl text-center mb-2">BECOME A <span className="text-primary">VENDOR</span></h2>
            <p className="text-center text-muted-foreground mb-8">Fill out the form below to apply. We'll review your application and get back to you!</p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit((d) => submitMutation.mutate(d))} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="businessName" render={({ field }) => (
                    <FormItem><FormLabel>Business Name *</FormLabel><FormControl><Input placeholder="Your Business" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem><FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger></FormControl>
                        <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select><FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Business Description *</FormLabel><FormControl><Textarea placeholder="Tell us about your products/services..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="contactName" render={({ field }) => (
                    <FormItem><FormLabel>Contact Name *</FormLabel><FormControl><Input placeholder="Your Name" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone *</FormLabel><FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email *</FormLabel><FormControl><Input type="email" placeholder="you@email.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <h3 className="font-display text-xl text-foreground pt-2">Social Media (Optional)</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <FormField control={form.control} name="instagram" render={({ field }) => (
                    <FormItem><FormLabel className="flex items-center gap-1"><Instagram size={14} /> Instagram</FormLabel><FormControl><Input placeholder="@handle" {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="facebook" render={({ field }) => (
                    <FormItem><FormLabel className="flex items-center gap-1"><Facebook size={14} /> Facebook</FormLabel><FormControl><Input placeholder="Page URL" {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="website" render={({ field }) => (
                    <FormItem><FormLabel className="flex items-center gap-1"><Globe size={14} /> Website</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl></FormItem>
                  )} />
                </div>
                <Button type="submit" size="lg" className="w-full font-display text-lg tracking-wider" disabled={submitMutation.isPending}>
                  <Send size={18} className="mr-2" /> {submitMutation.isPending ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Vendors;
