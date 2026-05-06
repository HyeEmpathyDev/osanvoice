"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

// 2026-06-03 00:00 KST (한국시간) — 제9회 전국동시지방선거 투표일
const ELECTION_KST = new Date("2026-06-03T00:00:00+09:00").getTime();

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

// 한국식 D-Day 카운트다운
//   - days: 오늘 자정(KST) 기준으로 선거일까지 몇 일 남았나 (ceil — 오늘이 D-28)
//   - hh:mm:ss: 다음 KST 자정까지 남은 시간 (자정 도래 시 D-XX → D-(XX-1))
function calc(): Countdown {
  const now = Date.now();
  const diff = ELECTION_KST - now;

  if (diff <= 0) {
    const past = -diff;
    return {
      days: Math.floor(past / 86400000),
      hours: Math.floor((past % 86400000) / 3600000),
      minutes: Math.floor((past % 3600000) / 60000),
      seconds: Math.floor((past % 60000) / 1000),
      isPast: true,
    };
  }

  // KST 자정 기준 전체 남은 일수 (ceil → 한국식 "D-28")
  const totalDays = Math.ceil(diff / 86400000);

  // 현재 KST 시각의 "오늘 자정 다음 자정"까지 남은 ms
  // KST = UTC+9 → KST 기준 일자 경계는 UTC로는 +9h 시프트
  const KST_OFFSET = 9 * 3600000;
  const kstNowDayMs = Math.floor((now + KST_OFFSET) / 86400000) * 86400000;
  const nextKSTMidnightUTC = kstNowDayMs + 86400000 - KST_OFFSET;
  const untilTick = Math.max(0, nextKSTMidnightUTC - now);

  return {
    days: totalDays,
    hours: Math.floor(untilTick / 3600000),
    minutes: Math.floor((untilTick % 3600000) / 60000),
    seconds: Math.floor((untilTick % 60000) / 1000),
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
        제9회 전국동시지방선거 · 2026.06.03 (KST)
      </div>
      {c === null ? (
        <div className="text-base md:text-xl font-black text-[#003b8e] tabular tracking-tight">
          D-—
        </div>
      ) : (
        <div className="text-base md:text-xl font-black text-[#003b8e] tabular tracking-tight inline-flex items-baseline gap-1.5">
          <span>{c.isPast ? `D+${c.days}` : `D-${c.days}`}</span>
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
