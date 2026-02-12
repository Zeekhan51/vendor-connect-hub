import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownTimerProps {
  targetDate: Date;
  eventName: string;
}

const CountdownTimer = ({ targetDate, eventName }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  if (timeLeft.total <= 0) {
    return (
      <div className="text-center py-6">
        <p className="font-display text-3xl text-primary">🎉 Event is Live!</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="font-body text-sm text-muted-foreground mb-2 uppercase tracking-wider">
        Countdown to
      </p>
      <p className="font-display text-2xl md:text-3xl text-foreground mb-4">{eventName}</p>
      <div className="flex justify-center gap-3 md:gap-5">
        {units.map((unit) => (
          <div key={unit.label} className="flex flex-col items-center">
            <div className="relative w-16 h-20 md:w-20 md:h-24 bg-foreground rounded-lg overflow-hidden shadow-lg">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={unit.value}
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 30, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="absolute inset-0 flex items-center justify-center font-display text-3xl md:text-4xl text-primary"
                >
                  {String(unit.value).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
              <div className="absolute inset-x-0 top-1/2 h-px bg-primary/20" />
            </div>
            <span className="mt-2 text-xs font-body text-muted-foreground uppercase tracking-wider">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

function getTimeLeft(target: Date) {
  const total = target.getTime() - Date.now();
  if (total <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    total,
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

export default CountdownTimer;
