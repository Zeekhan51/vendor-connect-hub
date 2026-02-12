import { Link } from "react-router-dom";
import { Instagram, Facebook, Phone, Mail, Lock } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground/80 py-12">
    <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="font-display text-3xl text-primary mb-3">TRIPLE C EVENTS</h3>
        <p className="text-sm leading-relaxed">
          Organizing vendor malls & markets that bring communities together. Shop small, support local!
        </p>
      </div>

      <div>
        <h4 className="font-display text-xl text-primary-foreground mb-3">Quick Links</h4>
        <div className="flex flex-col gap-2 text-sm">
          <Link to="/vendors" className="hover:text-primary transition-colors">Vendors</Link>
          <Link to="/sponsors" className="hover:text-primary transition-colors">Sponsors</Link>
          <Link to="/events" className="hover:text-primary transition-colors">Events</Link>
        </div>
      </div>

      <div>
        <h4 className="font-display text-xl text-primary-foreground mb-3">Contact Us</h4>
        <div className="flex flex-col gap-2 text-sm">
          <a href="tel:7045067253" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Phone size={16} /> (704) 506-7253
          </a>
          <a href="mailto:triplecccevents1@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Mail size={16} /> triplecccevents1@gmail.com
          </a>
          <a href="https://instagram.com/triplecccevents_" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Instagram size={16} /> @triplecccevents_
          </a>
          <a href="https://www.facebook.com/share/17uYBbGuyE/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Facebook size={16} /> Triple Cha-nel
          </a>
        </div>
      </div>
    </div>
    <div className="container mt-8 pt-6 border-t border-primary-foreground/10 text-xs text-primary-foreground/40">
      <div className="flex items-center justify-between mb-4">
        <span>© {new Date().getFullYear()} Triple C Events. All rights reserved.</span>
        <Link to="/admin" className="flex items-center gap-1 hover:text-primary transition-colors">
          <Lock size={12} /> Admin
        </Link>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 text-primary-foreground/30 text-[11px]">
        <span>Built by <strong className="text-primary-foreground/50">Zee Digital Solutions</strong></span>
        <a href="mailto:info@zeedigitalsolutions.com" className="flex items-center gap-1 hover:text-primary transition-colors">
          <Mail size={10} /> info@zeedigitalsolutions.com
        </a>
        <a href="https://wa.me/923188281135" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
          <Phone size={10} /> +92-318-828-1135
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
