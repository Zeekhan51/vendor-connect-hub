import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockFeatured = [
  { name: "Brew & Beyond", desc: "Artisan coffee & cold brews", category: "Coffee" },
  { name: "Sweet Tooth Bakery", desc: "Homemade pastries & cakes", category: "Food" },
  { name: "Glow Up Candles", desc: "Hand-poured soy candles", category: "Home" },
];

const FeaturedVendors = () => (
  <section className="py-20 bg-background">
    <div className="container">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="font-display text-4xl md:text-5xl text-foreground">
          <Star className="inline text-secondary mb-2 mr-2" size={36} />
          FEATURED <span className="text-primary">VENDORS</span>
        </h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">These amazing businesses paid for premium promotion. Check them out!</p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockFeatured.map((v, i) => (
          <motion.div
            key={v.name}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border-2 border-secondary/40 rounded-lg overflow-hidden group hover:shadow-lg hover:shadow-secondary/10 transition-all"
          >
            <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="font-display text-4xl text-foreground/20">{v.name[0]}</span>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-secondary text-secondary-foreground text-xs">⭐ Featured</Badge>
                <Badge variant="outline" className="text-xs">{v.category}</Badge>
              </div>
              <h3 className="font-display text-2xl text-foreground">{v.name}</h3>
              <p className="text-muted-foreground text-sm mt-1">{v.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedVendors;
