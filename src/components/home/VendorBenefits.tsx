import { motion } from "framer-motion";
import { Users, TrendingUp, Ticket, Handshake, Eye, Megaphone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, any> = { Users, TrendingUp, Ticket, Handshake, Eye, Megaphone };
const defaultIcons = [Users, Eye, Ticket, Handshake, TrendingUp, Megaphone];

const fallbackBenefits = [
  { title: "Massive Foot Traffic", desc: "Get your products in front of hundreds of local shoppers eager to discover new brands." },
  { title: "Brand Exposure", desc: "Your business featured across our social media, event promotions, and on-site signage." },
  { title: "Raffle Engagement", desc: "Every customer purchase earns raffle tickets — driving more traffic to your booth." },
  { title: "Networking", desc: "Connect with fellow entrepreneurs, potential partners, and a thriving small business community." },
  { title: "Grow Your Sales", desc: "A curated market atmosphere designed to maximize vendor sales and customer satisfaction." },
  { title: "Featured Promotion", desc: "Pay to be a Featured Vendor and get premium placement, extra social media shoutouts, and more." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const VendorBenefits = () => {
  const { data: siteContent } = useQuery({
    queryKey: ["site-content", "vendor_benefits"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("*").eq("section_key", "vendor_benefits").single();
      if (error) throw error;
      return data;
    },
  });

  const content = siteContent?.content as any;
  const benefits = content?.benefits?.length
    ? content.benefits.map((b: any, i: number) => ({ ...b, icon: defaultIcons[i % defaultIcons.length] }))
    : fallbackBenefits.map((b, i) => ({ ...b, icon: defaultIcons[i] }));

  const title = siteContent?.title || "WHY JOIN AS A VENDOR?";
  const subtitle = siteContent?.subtitle || "Triple C Events gives small businesses the spotlight they deserve. Here's what you get:";

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl text-foreground">{title.includes(" ") ? title : <>WHY JOIN AS A <span className="text-primary">VENDOR?</span></>}</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">{subtitle}</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b: any, i: number) => {
            const Icon = b.icon || defaultIcons[i % defaultIcons.length];
            return (
              <motion.div key={b.title || i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-card rounded-lg p-6 border border-border hover:border-primary/40 transition-colors group">
                <Icon className="text-primary mb-3 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="font-display text-xl text-foreground mb-1">{b.title}</h3>
                <p className="text-muted-foreground text-sm">{b.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VendorBenefits;
