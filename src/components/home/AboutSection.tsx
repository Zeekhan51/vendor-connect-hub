import { motion } from "framer-motion";
import { Facebook, Phone, Briefcase, Palette, Users, Megaphone, Calendar, BookOpen, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import christinaImg from "@/assets/christina-owner.jpg";

const services = [
  { icon: Briefcase, label: "1:1 Business Coaching Sessions" },
  { icon: BookOpen, label: "Customized Growth Strategies" },
  { icon: Palette, label: "Branding & Marketing Guidance" },
  { icon: Megaphone, label: "Social Media & Content Planning" },
  { icon: Users, label: "Door to Door Flyering" },
  { icon: PenTool, label: "Graphic Design (Flyers, Cards, etc.)" },
  { icon: Calendar, label: "Exclusive Workshops & Events" },
];

const AboutSection = () => (
  <section className="py-20 bg-background">
    <div className="container">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-4xl md:text-5xl text-foreground">
          MEET THE <span className="text-primary">OWNER</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="w-full max-w-sm aspect-[3/4] rounded-2xl shadow-xl overflow-hidden">
            <img
              src={christinaImg}
              alt="Christina - Owner of Triple C Events"
              className="w-full h-full object-cover object-[center_65%]"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="font-display text-3xl text-foreground mb-3">Christina</h3>
          <p className="text-muted-foreground font-body leading-relaxed mb-6">
            Founder of Triple C Events — passionate about bringing communities together through vibrant vendor malls and markets. 
            With expertise in event management, branding, and business coaching, Christina helps small businesses grow and thrive.
          </p>

          <h4 className="font-display text-xl text-foreground mb-3">Services Offered</h4>
          <ul className="space-y-2 mb-6">
            {services.map((s) => (
              <li key={s.label} className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                <s.icon size={16} className="text-primary shrink-0" />
                {s.label}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            <Button asChild className="font-display tracking-wider">
              <a href="tel:7045067253">
                <Phone size={16} className="mr-1" /> Book a Clarity Call
              </a>
            </Button>
            <Button asChild variant="outline" className="font-display tracking-wider border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <a href="https://www.facebook.com/share/17uYBbGuyE/" target="_blank" rel="noopener noreferrer">
                <Facebook size={16} className="mr-1" /> Follow on Facebook
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
