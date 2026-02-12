import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CountdownTimer from "./CountdownTimer";
import eventSchedule1 from "@/assets/event-schedule-1.jpg";
import eventBooks from "@/assets/event-books-market.jpg";
import eventCoffee from "@/assets/event-coffee-market.jpg";
import eventSchedule2 from "@/assets/event-schedule-2.jpg";

const events = [
  { title: "Artisan Market", date: "2026-03-01", image: eventSchedule1 },
  { title: "Books & More Market", date: "2026-03-08", image: eventBooks },
  { title: "Everything Coffee", date: "2026-03-15", image: eventCoffee },
  { title: "It's a Dog World", date: "2026-03-22", image: eventSchedule2 },
  { title: "The Edible Experience", date: "2026-03-29", image: eventSchedule2 },
  { title: "Fashion Frenzy", date: "2026-04-01", image: eventSchedule2 },
];

const VENUE = "The MilliUp Event Center";
const TICKET_LINK = "https://www.eventbrite.com/e/1982077288526?aff=oddtdtcreator";

function getNextEvent() {
  const now = new Date();
  return events.find((e) => new Date(e.date + "T15:00:00") > now) || events[events.length - 1];
}

const UpcomingEvents = () => {
  const nextEvent = getNextEvent();

  return (
    <section className="py-20 bg-card">
      <div className="container">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
          <h2 className="font-display text-4xl md:text-5xl text-foreground">UPCOMING <span className="text-primary">EVENTS</span></h2>
          <p className="text-muted-foreground mt-2 font-body">Hop Into Spring Vendor Mall • Every Sunday</p>
        </motion.div>

        {/* Countdown */}
        <div className="max-w-xl mx-auto mb-12">
          <CountdownTimer targetDate={new Date(nextEvent.date + "T09:00:00")} eventName={nextEvent.title} />
        </div>

        {/* Events Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {events.map((e, i) => {
            const eventDate = new Date(e.date);
            const isPast = eventDate < new Date();
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className={`bg-background border border-border rounded-lg overflow-hidden ${isPast ? "opacity-50" : ""}`}>
                <img src={e.image} alt={e.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-display text-xl text-foreground">{e.title}</h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {eventDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> 9AM-3PM</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {VENUE}</span>
                  </div>
                  {!isPast && (
                    <Button asChild size="sm" className="mt-3 w-full font-display tracking-wider text-sm">
                      <a href={TICKET_LINK} target="_blank" rel="noopener noreferrer"><ExternalLink size={12} className="mr-1" /> Get Tickets</a>
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
