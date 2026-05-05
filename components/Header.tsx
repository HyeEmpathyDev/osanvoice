"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const NAV = [
  { href: "/voices", label: "시민의견" },
  { href: "/map", label: "고충지도" },
  { href: "/promises", label: "9대 약속" },
  { href: "/stats", label: "참여현황" },
];

export function Header({ variant = "light" }: { variant?: "light" | "dark" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDark = variant === "dark" && !scrolled;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "glass border-b border-white/40 bg-white/80"
          : isDark
            ? "bg-transparent"
            : "bg-white/95 border-b border-gray-100"
      )}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className={cn(
            "text-lg font-black tracking-tight transition-colors",
            isDark ? "text-white" : "text-[#003b8e]"
          )}
        >
          오산의 목소리
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-bold rounded-lg transition-colors",
                  active
                    ? isDark
                      ? "bg-white/15 text-white"
                      : "bg-[#003b8e]/10 text-[#003b8e]"
                    : isDark
                      ? "text-white/85 hover:text-white hover:bg-white/10"
                      : "text-gray-700 hover:text-[#003b8e] hover:bg-gray-100"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/voices/new"
            className={cn(
              "ml-2 px-4 py-2 text-sm font-bold rounded-lg transition shadow-sm",
              isDark
                ? "bg-[#ffd54a] text-[#0a1633] hover:bg-[#fbcf3b]"
                : "bg-[#003b8e] text-white hover:bg-[#1a2654]"
            )}
          >
            의견 남기기
          </Link>
        </nav>

        <button
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          className={cn(
            "md:hidden p-2 rounded-lg",
            isDark ? "text-white" : "text-[#003b8e]"
          )}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-bold text-gray-700"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/voices/new"
              onClick={() => setOpen(false)}
              className="mt-2 bg-[#003b8e] text-white text-center font-bold py-3 rounded-lg"
            >
              의견 남기기
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
