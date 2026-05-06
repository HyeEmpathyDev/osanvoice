"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

const ELECTION_DATE = new Date("2026-06-03T00:00:00+09:00");

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calc(): Countdown {
  const diff = ELECTION_DATE.getTime() - Date.now();
  if (diff <= 0) {
    const past = Math.abs(diff);
    return {
      days: Math.floor(past / 86400000),
      hours: Math.floor((past % 86400000) / 3600000),
      minutes: Math.floor((past % 3600000) / 60000),
      seconds: Math.floor((past % 60000) / 1000),
      isPast: true,
    };
  }
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    isPast: false,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function DDay() {
  const [c, setC] = useState<Countdown | null>(null);

  useEffect(() => {
    setC(calc());
    const id = setInterval(() => setC(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center leading-tight select-none">
      <div className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-gray-500 inline-flex items-center gap-1">
        <Calendar size={10} className="text-[#003b8e]" />
        제9회 전국동시지방선거 · 2026.06.03
      </div>
      {c === null ? (
        <div className="text-base md:text-xl font-black text-[#003b8e] tabular tracking-tight">
          D-—
        </div>
      ) : (
        <div className="text-base md:text-xl font-black text-[#003b8e] tabular tracking-tight inline-flex items-baseline gap-1.5">
          <span>
            {c.isPast ? `D+${c.days}` : `D-${c.days}`}
          </span>
          <span
            className="text-[11px] md:text-sm text-gray-600 tabular font-bold"
            aria-label={`${c.hours}시간 ${c.minutes}분 ${c.seconds}초`}
          >
            {pad(c.hours)}:{pad(c.minutes)}:{pad(c.seconds)}
          </span>
        </div>
      )}
    </div>
  );
}
