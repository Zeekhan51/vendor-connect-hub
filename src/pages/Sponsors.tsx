import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Crown, Award, Medal, Send } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const sponsorSchema = z.object({
  companyName: z.string().trim().min(2, "Company name is required").max(100),
  contactPerson: z.string().trim().min(2, "Contact name is required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().min(10, "Valid phone number required").max(20),
  tier: z.string().min(1, "Please select a tier"),
  message: z.string().trim().max(1000).optional(),
});

type SponsorForm = z.infer<typeof sponsorSchema>;

const tiers = [
  {
    name: "Gold",
    icon: Crown,
    color: "text-secondary",
    bg: "bg-secondary/10 border-secondary/30",
    benefits: ["Premium logo placement on all materials", "VIP booth at every event", "Social media spotlight (weekly)", "Featured on website homepage", "Free vendor table at all events"],
  },
  {
    name: "Silver",
    icon: Award,
    color: "text-muted-foreground",
    bg: "bg-muted border-muted-foreground/20",
    benefits: ["Logo on event banners & flyers", "Social media shoutouts (bi-weekly)", "Listed on website sponsors page", "Discounted vendor table at events"],
  },
  {
    name: "Bronze",
    icon: Medal,
    color: "text-primary",
    bg: "bg-primary/10 border-primary/30",
    benefits: ["Logo on event programs", "Social media mention (monthly)", "Listed on website sponsors page"],
  },
];

const Sponsors = () => {
  const form = useForm<SponsorForm>({
    resolver: zodResolver(sponsorSchema),
    defaultValues: { companyName: "", contactPerson: "", email: "", phone: "", tier: "", message: "" },
  });

  const onSubmit = (data: SponsorForm) => {
    const body = Object.entries(data)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    window.location.href = `mailto:info@zeedigitalsolutions.com?subject=${encodeURIComponent("Sponsorship Inquiry: " + data.companyName)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Layout>
      <section className="py-16 bg-foreground text-primary-foreground">
        <div className="container text-center">
          <h1 className="font-display text-5xl md:text-6xl mb-4">BECOME A <span className="text-primary">SPONSOR</span></h1>
          <p className="font-body text-primary-foreground/70 max-w-xl mx-auto">Partner with Triple C Events and get your brand in front of hundreds of engaged shoppers!</p>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-16 bg-card">
        <div className="container">
          <h2 className="font-display text-3xl text-center mb-10">SPONSORSHIP <span className="text-primary">TIERS</span></h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tiers.map((tier, i) => (
              <motion.div key={tier.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`rounded-xl border-2 p-6 ${tier.bg}`}>
                <div className="flex items-center gap-2 mb-4">
                  <tier.icon className={tier.color} size={28} />
                  <h3 className="font-display text-3xl text-foreground">{tier.name}</h3>
                </div>
                <ul className="space-y-2">
                  {tier.benefits.map((b) => (
                    <li key={b} className="text-sm font-body text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span> {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-20 bg-background">
        <div className="container max-w-2xl">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="font-display text-4xl text-center mb-2">SPONSORSHIP <span className="text-primary">INQUIRY</span></h2>
            <p className="text-center text-muted-foreground mb-8">Interested in sponsoring? Fill out the form and we'll reach out with details!</p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="companyName" render={({ field }) => (
                    <FormItem><FormLabel>Company Name *</FormLabel><FormControl><Input placeholder="Your Company" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="contactPerson" render={({ field }) => (
                    <FormItem><FormLabel>Contact Person *</FormLabel><FormControl><Input placeholder="Your Name" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email *</FormLabel><FormControl><Input type="email" placeholder="you@company.com" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone *</FormLabel><FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="tier" render={({ field }) => (
                  <FormItem><FormLabel>Desired Sponsorship Tier *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a tier" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Gold">🥇 Gold</SelectItem>
                        <SelectItem value="Silver">🥈 Silver</SelectItem>
                        <SelectItem value="Bronze">🥉 Bronze</SelectItem>
                      </SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem><FormLabel>Message (Optional)</FormLabel><FormControl><Textarea placeholder="Any questions or notes..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" size="lg" className="w-full font-display text-lg tracking-wider">
                  <Send size={18} className="mr-2" /> Submit Inquiry
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Sponsors;
