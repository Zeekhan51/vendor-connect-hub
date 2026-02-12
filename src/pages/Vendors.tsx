import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Star, Send, Instagram, Facebook, Globe, Phone, Mail } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const categories = [
  "Artisan / Handmade",
  "Food & Beverages",
  "Fashion & Accessories",
  "Books & Media",
  "Health & Beauty",
  "Pet Products",
  "Home & Décor",
  "Other",
];

const mockVendors = [
  { name: "Sweet Treats Bakery", category: "Food & Beverages", featured: true },
  { name: "Handmade Haven", category: "Artisan / Handmade", featured: true },
  { name: "Trendy Threads", category: "Fashion & Accessories", featured: false },
];

const Vendors = () => {
  const location = useLocation();
  const form = useForm<VendorForm>({
    resolver: zodResolver(vendorSchema),
    defaultValues: { businessName: "", category: "", description: "", contactName: "", phone: "", email: "", instagram: "", facebook: "", website: "" },
  });

  useEffect(() => {
    if (location.hash === "#register") {
      setTimeout(() => document.getElementById("register")?.scrollIntoView({ behavior: "smooth" }), 300);
    }
  }, [location]);

  const onSubmit = (data: VendorForm) => {
    const body = Object.entries(data)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    window.location.href = `mailto:info@zeedigitalsolutions.com?subject=${encodeURIComponent("Vendor Application: " + data.businessName)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 bg-foreground text-primary-foreground">
        <div className="container text-center">
          <h1 className="font-display text-5xl md:text-6xl mb-4">OUR <span className="text-primary">VENDORS</span></h1>
          <p className="font-body text-primary-foreground/70 max-w-xl mx-auto">Discover amazing local businesses at our events. Want to join? Apply below!</p>
        </div>
      </section>

      {/* Featured Vendors */}
      <section className="py-16 bg-card">
        <div className="container">
          <h2 className="font-display text-3xl text-center mb-8">FEATURED <span className="text-primary">VENDORS</span></h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {mockVendors.filter(v => v.featured).map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-background border border-border rounded-lg p-6 text-center relative">
                <Star className="absolute top-3 right-3 text-secondary" size={20} fill="currentColor" />
                <h3 className="font-display text-2xl text-foreground">{v.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{v.category}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Vendors */}
      <section className="py-12 bg-background">
        <div className="container">
          <h2 className="font-display text-3xl text-center mb-8">ALL <span className="text-primary">VENDORS</span></h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {mockVendors.map((v, i) => (
              <div key={i} className="border border-border rounded-lg p-4">
                <h3 className="font-display text-xl text-foreground">{v.name}</h3>
                <p className="text-sm text-muted-foreground">{v.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="register" className="py-20 bg-card">
        <div className="container max-w-2xl">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="font-display text-4xl text-center mb-2">BECOME A <span className="text-primary">VENDOR</span></h2>
            <p className="text-center text-muted-foreground mb-8">Fill out the form below to apply. We'll review your application and get back to you!</p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                <Button type="submit" size="lg" className="w-full font-display text-lg tracking-wider">
                  <Send size={18} className="mr-2" /> Submit Application
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
