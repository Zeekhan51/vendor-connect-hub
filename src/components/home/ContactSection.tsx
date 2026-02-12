import { motion } from "framer-motion";
import { Phone, Mail, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ContactSection = () => (
  <section className="py-20 bg-foreground text-primary-foreground">
    <div className="container">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="font-display text-4xl md:text-5xl mb-4">
          LET'S <span className="text-primary">CONNECT</span>
        </h2>
        <p className="text-primary-foreground/70 mb-8">
          Ready to be a vendor, sponsor, or host your next event with us? Reach out!
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-8 text-left">
          <a href="tel:7045067253" className="flex items-center gap-3 bg-primary-foreground/5 rounded-lg p-4 hover:bg-primary-foreground/10 transition-colors">
            <Phone className="text-primary" size={24} />
            <div>
              <div className="text-sm text-primary-foreground/60">Call / Text</div>
              <div className="font-semibold">(704) 506-7253</div>
            </div>
          </a>
          <a href="mailto:triplecccevents1@gmail.com" className="flex items-center gap-3 bg-primary-foreground/5 rounded-lg p-4 hover:bg-primary-foreground/10 transition-colors">
            <Mail className="text-primary" size={24} />
            <div>
              <div className="text-sm text-primary-foreground/60">Email</div>
              <div className="font-semibold">triplecccevents1@gmail.com</div>
            </div>
          </a>
          <a href="https://instagram.com/triplecccevents_" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-primary-foreground/5 rounded-lg p-4 hover:bg-primary-foreground/10 transition-colors">
            <Instagram className="text-primary" size={24} />
            <div>
              <div className="text-sm text-primary-foreground/60">Instagram</div>
              <div className="font-semibold">@triplecccevents_</div>
            </div>
          </a>
          <a href="https://facebook.com/TripleCha-nel" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-primary-foreground/5 rounded-lg p-4 hover:bg-primary-foreground/10 transition-colors">
            <Facebook className="text-primary" size={24} />
            <div>
              <div className="text-sm text-primary-foreground/60">Facebook</div>
              <div className="font-semibold">Triple Cha-nel</div>
            </div>
          </a>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="font-display text-lg tracking-wider">
            <Link to="/vendors#register">Become a Vendor</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-display text-lg tracking-wider border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/sponsors">Become a Sponsor</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default ContactSection;
