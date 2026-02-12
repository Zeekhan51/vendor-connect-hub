import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import CountdownTimer from "./CountdownTimer";

const UpcomingEvents = () => {
  const { data: events = [] } = useQuery({
    queryKey: ["public-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_past", false)
        .order("date", { ascending: true })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  const now = new Date();
  const nextEvent = events.find((e) => new Date(e.date + "T23:59:59") > now) || events[0];

  if (events.length === 0) return null;

  return (
    <section className="py-20 bg-card">
      <div className="container">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
          <h2 className="font-display text-4xl md:text-5xl text-foreground">UPCOMING <span className="text-primary">EVENTS</span></h2>
          <p className="text-muted-foreground mt-2 font-body">Every Sunday at The MilliUp Event Center</p>
        </motion.div>

        {nextEvent && (
          <div className="max-w-xl mx-auto mb-12">
            <CountdownTimer targetDate={new Date(nextEvent.date + "T09:00:00")} eventName={nextEvent.title} />
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {events.map((e, i) => {
            const eventDate = new Date(e.date);
            const isPast = eventDate < now;
            return (
              <motion.div key={e.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className={`bg-background border border-border rounded-lg overflow-hidden ${isPast ? "opacity-50" : ""}`}>
                {e.image_url && <img src={e.image_url} alt={e.title} className="w-full h-40 object-cover" />}
                {!e.image_url && <div className="w-full h-40 bg-muted flex items-center justify-center"><Calendar size={32} className="text-muted-foreground" /></div>}
                <div className="p-4">
                  <h3 className="font-display text-xl text-foreground">{e.title}</h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {eventDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {e.time_start || "9AM"}-{e.time_end || "3PM"}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {e.venue || "The MilliUp Event Center"}</span>
                  </div>
                  {!isPast && e.ticket_link && (
                    <Button asChild size="sm" className="mt-3 w-full font-display tracking-wider text-sm">
                      <a href={e.ticket_link} target="_blank" rel="noopener noreferrer"><ExternalLink size={12} className="mr-1" /> Get Tickets</a>
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Button asChild variant="outline" size="lg" className="font-display tracking-wider border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/events">View All Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
