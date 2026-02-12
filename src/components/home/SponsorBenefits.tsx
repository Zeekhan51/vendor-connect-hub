import { motion } from "framer-motion";
import { Crown, Award, Medal } from "lucide-react";

const tiers = [
  {
    name: "Gold",
    icon: Crown,
    color: "text-gold border-gold/40 bg-gold/5",
    perks: ["Logo on all event banners & flyers", "Premium booth placement", "Social media feature (3+ posts)", "MC shoutouts during event", "Website homepage feature"],
  },
  {
    name: "Silver",
    icon: Award,
    color: "text-silver border-silver/40 bg-silver/5",
    perks: ["Logo on event flyers", "Social media feature (2 posts)", "MC shoutout during event", "Website sponsors page feature"],
  },
  {
    name: "Bronze",
    icon: Medal,
    color: "text-bronze border-bronze/40 bg-bronze/5",
    perks: ["Logo on event flyers", "Social media mention (1 post)", "Website sponsors page listing"],
  },
];

const SponsorBenefits = () => (
  <section className="py-20 bg-card">
    <div className="container">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="font-display text-4xl md:text-5xl text-foreground">SPONSORSHIP <span className="text-primary">TIERS</span></h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Put your brand in front of hundreds of attendees. Choose the visibility level that fits your goals.</p>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className={`rounded-lg border-2 p-6 ${t.color}`}
          >
            <t.icon size={36} className="mb-3" />
            <h3 className="font-display text-3xl mb-4">{t.name} Sponsor</h3>
            <ul className="space-y-2">
              {t.perks.map((p) => (
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

export default SponsorBenefits;
