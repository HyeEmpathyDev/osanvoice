"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CAMP_LINKS } from "@/lib/constants";
import { Menu, X, MessageSquarePlus, ExternalLink, Mic } from "lucide-react";
import { FacebookIcon, InstagramIcon, YoutubeIcon, TikTokIcon } from "./BrandIcons";

const NAV = [
  { href: "/voices", label: "시민의견" },
  { href: "/map", label: "고충지도" },
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
          ? "glass border-b border-white/40 bg-white/85"
          : isDark
            ? "bg-transparent"
            : "bg-white border-b border-gray-100"
      )}
    >
      {/* 상단 얇은 그라데이션 바 */}
      <div className="h-[3px] bg-gradient-to-r from-[#003b8e] via-[#2a5cb0] to-[#ffd54a]" />

      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center gap-4">
        {/* 로고 — 다단 구성 */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <span
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
              isDark
                ? "bg-white/10 backdrop-blur"
                : "bg-gradient-to-br from-[#003b8e] to-[#1a2654]"
            )}
          >
            <Mic size={18} className={isDark ? "text-[#ffd54a]" : "text-[#ffd54a]"} />
          </span>
          <div className="leading-tight">
            <div
              className={cn(
                "text-[10px] font-bold tracking-widest opacity-80",
                isDark ? "text-white" : "text-gray-500"
              )}
            >
              시민이 만드는 당당한 오산
            </div>
            <div
              className={cn(
                "text-base md:text-lg font-black tracking-tight",
                isDark ? "text-white" : "text-[#003b8e]"
              )}
            >
              오산의 목소리
            </div>
          </div>
        </Link>

        {/* 데스크톱 네비 */}
        <nav className="hidden lg:flex items-center gap-1">
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

          {/* SNS 아이콘 */}
          <div
            className={cn(
              "ml-2 pl-3 flex items-center gap-1 border-l",
              isDark ? "border-white/20" : "border-gray-200"
            )}
          >
            {CAMP_LINKS.campaign && (
              <a
                href={CAMP_LINKS.campaign}
                target="_blank"
                rel="noopener"
                aria-label="조용호 캠프 공식"
                className={cn(
                  "p-2 rounded-lg transition flex items-center gap-1 text-xs font-bold",
                  isDark
                    ? "text-white/85 hover:text-white hover:bg-white/10"
                    : "text-[#003b8e] hover:bg-[#003b8e]/10"
                )}
              >
                <ExternalLink size={14} />
                캠프
              </a>
            )}
            {CAMP_LINKS.facebook && (
              <a
                href={CAMP_LINKS.facebook}
                target="_blank"
                rel="noopener"
                aria-label="Facebook"
                className={cn(
                  "p-2 rounded-lg transition",
                  isDark
                    ? "text-white/85 hover:text-white hover:bg-white/10"
                    : "text-gray-600 hover:text-[#1877f2] hover:bg-gray-100"
                )}
              >
                <FacebookIcon size={16} />
              </a>
            )}
            {CAMP_LINKS.instagram && (
              <a
                href={CAMP_LINKS.instagram}
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
                className={cn(
                  "p-2 rounded-lg transition",
                  isDark
                    ? "text-white/85 hover:text-white hover:bg-white/10"
                    : "text-gray-600 hover:text-[#e4405f] hover:bg-gray-100"
                )}
              >
                <InstagramIcon size={16} />
              </a>
            )}
            {CAMP_LINKS.youtube && (
              <a
                href={CAMP_LINKS.youtube}
                target="_blank"
                rel="noopener"
                aria-label="YouTube"
                className={cn(
                  "p-2 rounded-lg transition",
                  isDark
                    ? "text-white/85 hover:text-white hover:bg-white/10"
                    : "text-gray-600 hover:text-[#ff0000] hover:bg-gray-100"
                )}
              >
                <YoutubeIcon size={16} />
              </a>
            )}
            {CAMP_LINKS.tiktok && (
              <a
                href={CAMP_LINKS.tiktok}
                target="_blank"
                rel="noopener"
                aria-label="TikTok"
                className={cn(
                  "p-2 rounded-lg transition",
                  isDark
                    ? "text-white/85 hover:text-white hover:bg-white/10"
                    : "text-gray-600 hover:text-black hover:bg-gray-100"
                )}
              >
                <TikTokIcon size={16} />
              </a>
            )}
          </div>

          {/* CTA */}
          <Link
            href="/voices/new"
            className={cn(
              "ml-2 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-black rounded-lg transition shadow-sm",
              isDark
                ? "bg-[#ffd54a] text-[#0a1633] hover:bg-[#fbcf3b]"
                : "bg-[#003b8e] text-white hover:bg-[#1a2654]"
            )}
          >
            <MessageSquarePlus size={15} />
            의견 남기기
          </Link>
        </nav>

        {/* 모바일 햄버거 */}
        <button
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          className={cn(
            "lg:hidden p-2 rounded-lg",
            isDark ? "text-white" : "text-[#003b8e]"
          )}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* 모바일 펼침 */}
      {open && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
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

            <div className="border-t border-gray-100 mt-2 pt-3">
              <div className="text-[10px] font-bold text-gray-400 mb-2 tracking-widest">
                CAMP
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {CAMP_LINKS.campaign && (
                  <a
                    href={CAMP_LINKS.campaign}
                    target="_blank"
                    rel="noopener"
                    className="text-xs font-bold px-3 py-2 bg-[#003b8e]/10 text-[#003b8e] rounded-lg flex items-center gap-1.5"
                  >
                    <ExternalLink size={14} /> 캠프 공식
                  </a>
                )}
                {CAMP_LINKS.facebook && (
                  <a href={CAMP_LINKS.facebook} target="_blank" rel="noopener" className="p-2 rounded-lg bg-gray-100">
                    <FacebookIcon size={16} className="text-[#1877f2]" />
                  </a>
                )}
                {CAMP_LINKS.instagram && (
                  <a href={CAMP_LINKS.instagram} target="_blank" rel="noopener" className="p-2 rounded-lg bg-gray-100">
                    <InstagramIcon size={16} className="text-[#e4405f]" />
                  </a>
                )}
                {CAMP_LINKS.youtube && (
                  <a href={CAMP_LINKS.youtube} target="_blank" rel="noopener" className="p-2 rounded-lg bg-gray-100">
                    <YoutubeIcon size={16} className="text-[#ff0000]" />
                  </a>
                )}
                {CAMP_LINKS.tiktok && (
                  <a href={CAMP_LINKS.tiktok} target="_blank" rel="noopener" className="p-2 rounded-lg bg-gray-100 text-black">
                    <TikTokIcon size={16} />
                  </a>
                )}
              </div>
            </div>

            <Link
              href="/voices/new"
              onClick={() => setOpen(false)}
              className="mt-3 bg-[#003b8e] text-white text-center font-black py-3 rounded-lg flex items-center justify-center gap-1.5"
            >
              <MessageSquarePlus size={15} />
              의견 남기기
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
