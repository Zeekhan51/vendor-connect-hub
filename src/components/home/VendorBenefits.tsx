import { motion } from "framer-motion";
import { Users, TrendingUp, Ticket, Handshake, Eye, Megaphone } from "lucide-react";

const benefits = [
  { icon: Users, title: "Massive Foot Traffic", desc: "Get your products in front of hundreds of local shoppers eager to discover new brands." },
  { icon: Eye, title: "Brand Exposure", desc: "Your business featured across our social media, event promotions, and on-site signage." },
  { icon: Ticket, title: "Raffle Engagement", desc: "Every customer purchase earns raffle tickets — driving more traffic to your booth." },
  { icon: Handshake, title: "Networking", desc: "Connect with fellow entrepreneurs, potential partners, and a thriving small business community." },
  { icon: TrendingUp, title: "Grow Your Sales", desc: "A curated market atmosphere designed to maximize vendor sales and customer satisfaction." },
  { icon: Megaphone, title: "Featured Promotion", desc: "Pay to be a Featured Vendor and get premium placement, extra social media shoutouts, and more." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const VendorBenefits = () => (
  <section className="py-20 bg-background">
    <div className="container">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="font-display text-4xl md:text-5xl text-foreground">WHY JOIN AS A <span className="text-primary">VENDOR?</span></h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Triple C Events gives small businesses the spotlight they deserve. Here's what you get:</p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-card rounded-lg p-6 border border-border hover:border-primary/40 transition-colors group"
          >
            <b.icon className="text-primary mb-3 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-display text-xl text-foreground mb-1">{b.title}</h3>
            <p className="text-muted-foreground text-sm">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default VendorBenefits;
