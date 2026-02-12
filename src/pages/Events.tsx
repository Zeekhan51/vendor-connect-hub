import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import CountdownTimer from "@/components/home/CountdownTimer";

const FALLBACK_VENUE = "The MilliUp Event Center";
const FALLBACK_ADDRESS = "210 E. Trade Street # C-244 (Second Floor), Charlotte NC 28202";

const Events = () => {
  const { data: events = [] } = useQuery({
    queryKey: ["public-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const now = new Date();
  const nextEvent = events.find((e) => new Date(e.date + "T23:59:59") > now) || events[events.length - 1];

  return (
    <Layout>
      <section className="py-16 bg-foreground text-primary-foreground">
        <div className="container text-center">
          <h1 className="font-display text-5xl md:text-6xl mb-4">HOP INTO SPRING <span className="text-primary">VENDOR MALL</span></h1>
          <p className="font-body text-primary-foreground/70 max-w-xl mx-auto mb-2">Every Sunday • 9 AM - 3 PM</p>
          <p className="font-body text-primary-foreground/50 text-sm">{FALLBACK_VENUE} • {FALLBACK_ADDRESS}</p>
        </div>
      </section>

      {nextEvent && (
        <section className="py-12 bg-card">
          <div className="container max-w-xl">
            <CountdownTimer targetDate={new Date(nextEvent.date + "T09:00:00")} eventName={nextEvent.title} />
          </div>
        </section>
      )}

      <section className="py-16 bg-background">
        <div className="container max-w-4xl">
          <h2 className="font-display text-3xl text-center mb-10">EVENT <span className="text-primary">SCHEDULE</span></h2>
          {events.length === 0 && (
            <p className="text-center text-muted-foreground">No events scheduled yet. Check back soon!</p>
          )}
          <div className="space-y-8">
            {events.map((event, i) => {
              const eventDate = new Date(event.date);
              const isPast = event.is_past || eventDate < now;
              return (
                <motion.div key={event.id} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  className={`flex flex-col md:flex-row gap-6 bg-card border border-border rounded-xl overflow-hidden ${isPast ? "opacity-60" : ""}`}>
                  {event.image_url && <img src={event.image_url} alt={event.title} className="w-full md:w-48 h-48 md:h-auto object-cover" />}
                  <div className="flex-1 p-6">
                    <h3 className="font-display text-2xl text-foreground mb-2">{event.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1"><Calendar size={14} /> {eventDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {event.time_start || "9 AM"} - {event.time_end || "3 PM"}</span>
                      <span className="flex items-center gap-1"><MapPin size={14} /> {event.venue || FALLBACK_VENUE}</span>
                    </div>
                    {event.description && <p className="text-muted-foreground font-body text-sm mb-4">{event.description}</p>}
                    {!isPast && event.ticket_link && (
                      <Button asChild size="sm" className="font-display tracking-wider">
                        <a href={event.ticket_link} target="_blank" rel="noopener noreferrer"><ExternalLink size={14} className="mr-1" /> Get Tickets</a>
                      </Button>
                    )}
                    {isPast && <span className="text-xs text-muted-foreground font-display">EVENT COMPLETED</span>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground text-center">
        <div className="container">
          <h2 className="font-display text-4xl mb-4">WANT TO BE PART OF THE ACTION?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="font-display tracking-wider">
              <a href="/vendors#register">Apply as Vendor</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-display tracking-wider border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <a href="/sponsors">Become a Sponsor</a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Events;
