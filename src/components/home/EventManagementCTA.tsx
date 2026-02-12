import { motion } from "framer-motion";
import { Briefcase, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const EventManagementCTA = () => (
  <section className="py-20 bg-gradient-to-br from-foreground via-foreground/95 to-foreground">
    <div className="container">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto text-center">
        <Briefcase className="mx-auto text-primary mb-4" size={48} />
        <h2 className="font-display text-4xl md:text-5xl text-primary-foreground mb-4">
          NEED PROFESSIONAL <span className="text-primary">EVENT MANAGEMENT?</span>
        </h2>
        <p className="text-primary-foreground/70 text-lg leading-relaxed mb-8 font-body">
          Want us to manage your event professionally? From vendor malls to corporate gatherings, our team handles everything — planning, marketing, vendor coordination, and day-of execution. Let us bring your vision to life!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="font-display tracking-wider text-lg px-8">
            <a href="https://wa.me/923188281135" target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} className="mr-2" /> Book a Consultation
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-display tracking-wider text-lg px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <a href="tel:7045067253">
              <Phone size={18} className="mr-2" /> Contact Us
            </a>
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default EventManagementCTA;
