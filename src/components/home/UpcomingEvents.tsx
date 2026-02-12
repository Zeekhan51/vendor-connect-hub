import { motion } from "framer-motion";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockEvents = [
  {
    title: "Coffee Everything Market / Hop Into Spring Vendor Mall",
    date: "Coming Soon",
    venue: "The MilliUp Event Center",
    link: "https://www.eventbrite.com/e/1982077288526?aff=oddtdtcreator",
  },
];

const UpcomingEvents = () => (
  <section className="py-20 bg-card">
    <div className="container">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="font-display text-4xl md:text-5xl text-foreground">UPCOMING <span className="text-primary">EVENTS</span></h2>
      </motion.div>
      <div className="max-w-2xl mx-auto space-y-6">
        {mockEvents.map((e, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-background border border-border rounded-lg p-6 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="flex-1">
              <h3 className="font-display text-2xl text-foreground">{e.title}</h3>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar size={14} /> {e.date}</span>
                <span className="flex items-center gap-1"><MapPin size={14} /> {e.venue}</span>
              </div>
            </div>
            <Button asChild className="font-display tracking-wider shrink-0">
              <a href={e.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={16} className="mr-1" /> Get Tickets
              </a>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default UpcomingEvents;
