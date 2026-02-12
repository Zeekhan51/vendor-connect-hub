import { motion } from "framer-motion";
import { Crown, Award, Medal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fallbackTiers = [
  { name: "Gold", icon: Crown, color: "text-gold border-gold/40 bg-gold/5", perks: ["Premium logo on ALL event materials", "VIP booth placement at every event", "Free vendor table at all events", "Weekly social media spotlight posts", "Homepage featured section with large logo", "MC shoutouts throughout every event", "VIP event tickets for sponsor team", "Exclusive \"Presented by\" branding", "Newsletter feature to all subscribers"] },
  { name: "Silver", icon: Award, color: "text-silver border-silver/40 bg-silver/5", perks: ["Logo on event banners and flyers", "Priority booth placement", "Bi-weekly social media posts", "Website sponsors page with logo", "MC shoutouts during events", "Discounted vendor table fees", "Event tickets for sponsor team"] },
  { name: "Bronze", icon: Medal, color: "text-bronze border-bronze/40 bg-bronze/5", perks: ["Logo on event programs and flyers", "Monthly social media mention", "Website sponsors page listing", "MC acknowledgment during events"] },
];

const iconMap: Record<string, any> = { Gold: Crown, Silver: Award, Bronze: Medal };
const colorMap: Record<string, string> = { Gold: "text-gold border-gold/40 bg-gold/5", Silver: "text-silver border-silver/40 bg-silver/5", Bronze: "text-bronze border-bronze/40 bg-bronze/5" };

const SponsorBenefits = () => {
  const { data: siteContent } = useQuery({
    queryKey: ["site-content", "sponsor_benefits"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("*").eq("section_key", "sponsor_benefits").single();
      if (error) throw error;
      return data;
    },
  });

  const content = siteContent?.content as any;
  const tiers = content?.gold
    ? [
        { name: "Gold", icon: Crown, color: colorMap.Gold, perks: content.gold },
        { name: "Silver", icon: Award, color: colorMap.Silver, perks: content.silver || [] },
        { name: "Bronze", icon: Medal, color: colorMap.Bronze, perks: content.bronze || [] },
      ]
    : fallbackTiers;

  const title = siteContent?.title || "SPONSORSHIP TIERS";
  const subtitle = siteContent?.subtitle || "Put your brand in front of hundreds of attendees. Choose the visibility level that fits your goals.";

  return (
    <section className="py-20 bg-card">
      <div className="container">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl text-foreground">{title.includes("TIER") ? <>SPONSORSHIP <span className="text-primary">TIERS</span></> : title}</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">{subtitle}</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className={`rounded-lg border-2 p-6 ${t.color}`}>
              <t.icon size={36} className="mb-3" />
              <h3 className="font-display text-3xl mb-4">{t.name} Sponsor</h3>
              <ul className="space-y-2">
                {t.perks.map((p: string) => (
                  <li key={p} className="text-sm text-foreground/80 flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span> {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorBenefits;
