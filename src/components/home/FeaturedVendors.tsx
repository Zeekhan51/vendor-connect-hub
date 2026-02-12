import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const FeaturedVendors = () => {
  const { data: vendors = [] } = useQuery({
    queryKey: ["featured-vendors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendors")
        .select("*, vendor_images(*)")
        .eq("status", "approved")
        .eq("is_featured", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (vendors.length === 0) return null;

  return (
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
          {vendors.map((v, i) => {
            const firstImage = v.vendor_images?.[0]?.image_url;
            return (
              <motion.div key={v.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card border-2 border-secondary/40 rounded-lg overflow-hidden group hover:shadow-lg hover:shadow-secondary/10 transition-all">
                {firstImage ? (
                  <img src={firstImage} alt={v.business_name} className="w-full h-48 object-cover" />
                ) : (
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="font-display text-4xl text-foreground/20">{v.business_name[0]}</span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-secondary text-secondary-foreground text-xs">⭐ Featured</Badge>
                    {v.category && <Badge variant="outline" className="text-xs">{v.category}</Badge>}
                  </div>
                  <h3 className="font-display text-2xl text-foreground">{v.business_name}</h3>
                  {v.description && <p className="text-muted-foreground text-sm mt-1">{v.description}</p>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedVendors;
