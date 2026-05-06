"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

const ELECTION_DATE = new Date("2026-06-03T00:00:00+09:00");

function calcDDay() {
  const now = new Date();
  const diff = ELECTION_DATE.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function DDay() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(calcDDay());
    const id = setInterval(() => setDays(calcDDay()), 60_000);
    return () => clearInterval(id);
  }, []);

  const label =
    days === null
      ? ""
      : days > 0
        ? `D-${days}`
        : days === 0
          ? "D-Day"
          : `D+${Math.abs(days)}`;

  return (
    <div className="w-full bg-gradient-to-r from-[#0a1633] via-[#003b8e] to-[#0a1633] text-white">
      <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center justify-center gap-2 text-[11px] md:text-xs font-bold tracking-wide">
        <Calendar size={12} className="text-[#ffd54a] shrink-0" />
        <span>제9회 전국동시지방선거 · 2026.06.03</span>
        <span aria-hidden className="opacity-40">·</span>
        <span className="text-[#ffd54a] font-black tabular">
          {label || " "}
        </span>
      </div>
    </div>
  );
}
