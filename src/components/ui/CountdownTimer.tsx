"use client";

import { useEffect, useState } from "react";
import { EVENT } from "@/lib/constants";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const difference = new Date(EVENT.date).getTime() - new Date().getTime();
  if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-serif text-3xl font-bold text-heading sm:text-4xl md:text-5xl lg:text-6xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] font-medium uppercase tracking-widest text-body sm:text-xs">
        {label}
      </span>
    </div>
  );
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const content = mounted ? timeLeft : { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return (
    <div className="flex items-center gap-3 sm:gap-6 md:gap-10">
      <TimeUnit value={content.days} label="Jours" />
      <span className="font-serif text-xl text-gold sm:text-3xl">:</span>
      <TimeUnit value={content.hours} label="Heures" />
      <span className="font-serif text-xl text-gold sm:text-3xl">:</span>
      <TimeUnit value={content.minutes} label="Min" />
      <span className="font-serif text-xl text-gold sm:text-3xl">:</span>
      <TimeUnit value={content.seconds} label="Sec" />
    </div>
  );
}
