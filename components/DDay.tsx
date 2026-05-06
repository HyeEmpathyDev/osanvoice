"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

const ELECTION_DATE = new Date("2026-06-03T00:00:00+09:00");

function calcDDay() {
  const now = new Date();
  const diff = ELECTION_DATE.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
}

export function DDay() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(calcDDay());
    const id = setInterval(() => setDays(calcDDay()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (days === null) return null;

  const label =
    days > 0 ? `D-${days}` : days === 0 ? "D-Day" : `D+${Math.abs(days)}`;

  return (
    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/25 rounded-full px-4 py-1.5 text-xs font-black tracking-widest backdrop-blur">
      <Calendar size={13} className="text-[#ffd54a]" />
      <span className="text-white">제9회 전국동시지방선거</span>
      <span className="text-[#ffd54a] tabular">{label}</span>
    </div>
  );
}
