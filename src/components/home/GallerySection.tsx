import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import eventSchedule1 from "@/assets/event-schedule-1.jpg";
import eventSchedule2 from "@/assets/event-schedule-2.jpg";
import eventBooks from "@/assets/event-books-market.jpg";
import eventCoffee from "@/assets/event-coffee-market.jpg";

const images = [
  { src: eventSchedule1, alt: "Hop Into Spring Schedule - March" },
  { src: eventSchedule2, alt: "Hop Into Spring Schedule - April" },
  { src: eventBooks, alt: "Books & More Market" },
  { src: eventCoffee, alt: "Coffee Everything Market" },
];

const GallerySection = () => {
  const [selected, setSelected] = useState<number | null>(null);

  const navigate = useCallback(
    (dir: number) => {
      if (selected === null) return;
      setSelected((selected + dir + images.length) % images.length);
    },
    [selected]
  );

  useEffect(() => {
    if (selected === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, navigate]);

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl text-foreground">
            EVENT <span className="text-primary">GALLERY</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="cursor-pointer overflow-hidden rounded-lg group"
              onClick={() => setSelected(i)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full aspect-[3/4] object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <button
              className="absolute top-4 right-4 text-primary-foreground hover:text-primary"
              onClick={() => setSelected(null)}
            >
              <X size={32} />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-foreground hover:text-primary"
              onClick={(e) => { e.stopPropagation(); navigate(-1); }}
            >
              <ChevronLeft size={40} />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground hover:text-primary"
              onClick={(e) => { e.stopPropagation(); navigate(1); }}
            >
              <ChevronRight size={40} />
            </button>
            <motion.img
              key={selected}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={images[selected].src}
              alt={images[selected].alt}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
