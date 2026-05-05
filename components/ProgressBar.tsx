"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Props {
  count: number;
  goal?: number;
  label?: string;
}

export function ProgressBar({ count, goal = 100, label }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const pct = Math.min((count / goal) * 100, 100);
  const remaining = Math.max(goal - count, 0);

  return (
    <div ref={ref} className="bg-gradient-to-r from-white to-amber-50 border-y border-amber-100">
      <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-lg">📊</span>
          <p className="text-xs md:text-sm font-bold text-[#0a1633]">
            {label ?? "오산의 목소리는 지금"}{" "}
            <span className="text-base md:text-lg font-black text-[#003b8e] tabular">
              {count.toLocaleString()}건
            </span>
            의 의견을 받았습니다
          </p>
        </div>
        <div className="flex-1 flex items-center gap-3 min-w-0">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${pct}%` } : { width: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-gradient-to-r from-[#003b8e] via-[#2a5cb0] to-[#ffd54a] rounded-full relative"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </motion.div>
          </div>
          <span className="text-[11px] font-bold text-gray-500 whitespace-nowrap tabular">
            다음 {goal}건까지 {remaining > 0 ? `${remaining}건` : "달성!"}
          </span>
        </div>
      </div>
    </div>
  );
}
