import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section className="relative min-h-[85vh] flex items-center overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    />
    <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />

    <div className="container relative z-10 py-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-2xl"
      >
        <span className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded-full font-body text-sm font-semibold mb-4">
          🎉 Next Event Coming Soon!
        </span>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-primary-foreground leading-none mb-4">
          COFFEE EVERYTHING MARKET
        </h1>
        <p className="text-primary-foreground/80 text-lg md:text-xl mb-8 font-body leading-relaxed">
          Hop Into Spring Vendor Mall at The MilliUp Event Center! Shop small, support local, and win cash prizes!
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="font-display text-lg tracking-wider px-8">
            <Link to="/vendors#register">Become a Vendor</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-display text-lg tracking-wider px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/sponsors">Become a Sponsor</Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="font-display text-lg tracking-wider px-8">
            <a href="https://www.eventbrite.com/e/1982077288526?aff=oddtdtcreator" target="_blank" rel="noopener noreferrer">
              Get Tickets
            </a>
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
