import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import CountdownTimer from "@/components/home/CountdownTimer";
import eventSchedule1 from "@/assets/event-schedule-1.jpg";
import eventSchedule2 from "@/assets/event-schedule-2.jpg";
import eventBooks from "@/assets/event-books-market.jpg";
import eventCoffee from "@/assets/event-coffee-market.jpg";

const events = [
  { title: "Artisan Market", date: "2026-03-01", description: "Discover unique handmade crafts, artisan goods, and one-of-a-kind creations from talented local artisans.", image: eventSchedule1 },
  { title: "Books & More Market", date: "2026-03-08", description: "A paradise for book lovers! Find rare books, journals, stationery, and literary treasures.", image: eventBooks },
  { title: "Everything Coffee", date: "2026-03-15", description: "For coffee enthusiasts! Sample specialty blends, coffee accessories, baked goods, and more.", image: eventCoffee },
  { title: "It's a Dog World", date: "2026-03-22", description: "All things pets! Treats, accessories, grooming products, and fun for your furry friends.", image: eventSchedule2 },
  { title: "The Edible Experience", date: "2026-03-29", description: "A foodie's dream! Taste gourmet snacks, sauces, spices, and homemade delicacies.", image: eventSchedule2 },
  { title: "Fashion Frenzy", date: "2026-04-01", description: "Trendy fashion, accessories, jewelry, and style finds from local designers and boutiques.", image: eventSchedule2 },
];

const VENUE = "The MilliUp Event Center";
const ADDRESS = "210 E. Trade Street # C-244 (Second Floor), Charlotte NC 28202";
const TICKET_LINK = "https://www.eventbrite.com/e/1982077288526?aff=oddtdtcreator";

function getNextEvent() {
  const now = new Date();
  return events.find((e) => new Date(e.date + "T15:00:00") > now) || events[events.length - 1];
}

const Events = () => {
  const nextEvent = getNextEvent();

  return (
    <Layout>
      <section className="py-16 bg-foreground text-primary-foreground">
        <div className="container text-center">
          <h1 className="font-display text-5xl md:text-6xl mb-4">HOP INTO SPRING <span className="text-primary">VENDOR MALL</span></h1>
          <p className="font-body text-primary-foreground/70 max-w-xl mx-auto mb-2">Every Sunday • 9 AM - 3 PM</p>
          <p className="font-body text-primary-foreground/50 text-sm">{VENUE} • {ADDRESS}</p>
        </div>
      </section>

      {/* Countdown */}
      <section className="py-12 bg-card">
        <div className="container max-w-xl">
          <CountdownTimer targetDate={new Date(nextEvent.date + "T09:00:00")} eventName={nextEvent.title} />
        </div>
      </section>

      {/* Events List */}
      <section className="py-16 bg-background">
        <div className="container max-w-4xl">
          <h2 className="font-display text-3xl text-center mb-10">MARCH - APRIL <span className="text-primary">SCHEDULE</span></h2>
          <div className="space-y-8">
            {events.map((event, i) => {
              const eventDate = new Date(event.date);
              const isPast = eventDate < new Date();
              return (
                <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  className={`flex flex-col md:flex-row gap-6 bg-card border border-border rounded-xl overflow-hidden ${isPast ? "opacity-60" : ""}`}>
                  <img src={event.image} alt={event.title} className="w-full md:w-48 h-48 md:h-auto object-cover" />
                  <div className="flex-1 p-6">
                    <h3 className="font-display text-2xl text-foreground mb-2">{event.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1"><Calendar size={14} /> {eventDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> 9 AM - 3 PM</span>
                      <span className="flex items-center gap-1"><MapPin size={14} /> {VENUE}</span>
                    </div>
                    <p className="text-muted-foreground font-body text-sm mb-4">{event.description}</p>
                    {!isPast && (
                      <Button asChild size="sm" className="font-display tracking-wider">
                        <a href={TICKET_LINK} target="_blank" rel="noopener noreferrer"><ExternalLink size={14} className="mr-1" /> Get Tickets</a>
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

      {/* CTA */}
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
