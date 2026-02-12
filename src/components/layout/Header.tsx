import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const pageLinks = [
  { label: "Home", to: "/" },
  { label: "Vendors", to: "/vendors" },
  { label: "Sponsors", to: "/sponsors" },
];

const hashLinks = [
  { label: "Events", hash: "events" },
  { label: "Gallery", hash: "gallery" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToHash = (hash: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-foreground/95 backdrop-blur supports-[backdrop-filter]:bg-foreground/80 border-b border-primary/20">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-3xl tracking-wide text-primary">TRIPLE C</span>
          <span className="font-display text-3xl tracking-wide text-primary-foreground">EVENTS</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {pageLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-display text-lg text-primary-foreground/80 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {hashLinks.map((link) => (
            <button
              key={link.hash}
              onClick={() => scrollToHash(link.hash)}
              className="font-display text-lg text-primary-foreground/80 hover:text-primary transition-colors"
            >
              {link.label}
            </button>
          ))}
          <Button asChild size="sm" className="font-display text-base tracking-wider">
            <Link to="/vendors#register">Become a Vendor</Link>
          </Button>
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden text-primary-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="md:hidden bg-foreground border-t border-primary/20 pb-4">
          {pageLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block px-6 py-3 font-display text-lg text-primary-foreground/80 hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {hashLinks.map((link) => (
            <button
              key={link.hash}
              onClick={() => { scrollToHash(link.hash); setOpen(false); }}
              className="block w-full text-left px-6 py-3 font-display text-lg text-primary-foreground/80 hover:text-primary transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="px-6 pt-2">
            <Button asChild size="sm" className="w-full font-display text-base tracking-wider">
              <Link to="/vendors#register" onClick={() => setOpen(false)}>Become a Vendor</Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
