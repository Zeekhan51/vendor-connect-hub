import { motion } from "framer-motion";
import { Gift, DollarSign } from "lucide-react";

const RaffleSection = () => (
  <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center"
      >
        <Gift className="mx-auto text-primary mb-4" size={48} />
        <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
          SHOP & <span className="text-primary">WIN CASH!</span>
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
          When you make a purchase from any vendor, you'll receive raffle tickets for entry into our
          monthly raffle to win a <strong className="text-foreground">CASH PRIZE!</strong> The more you shop, the more chances to win.
        </p>
        <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-full font-display text-xl">
          <DollarSign size={24} /> SHOP SMALL. WIN BIG.
        </div>
      </motion.div>
    </div>
  </section>
);

export default RaffleSection;
