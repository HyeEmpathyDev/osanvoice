"use client";

import { CAMP_LINKS } from "@/lib/constants";
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  TikTokIcon,
} from "./BrandIcons";

export function SocialSidebar() {
  return (
    <>
      {/* 데스크톱 — 우측 세로 플로팅 */}
      <aside
        className="hidden lg:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col items-stretch gap-2 bg-white/95 backdrop-blur rounded-2xl shadow-xl shadow-black/10 border border-gray-200 p-2.5"
        aria-label="조용호 캠프 SNS"
      >
        <div className="text-[9px] font-black text-gray-400 text-center pb-1 tracking-[0.2em] leading-tight">
          조용호<br />
          캠프
        </div>

        {CAMP_LINKS.facebook && (
          <a
            href={CAMP_LINKS.facebook}
            target="_blank"
            rel="noopener"
            aria-label="Facebook"
            className="w-12 h-12 rounded-xl bg-gray-50 text-gray-600 hover:bg-[#1877f2] hover:text-white flex items-center justify-center transition hover:scale-110"
          >
            <FacebookIcon size={20} />
          </a>
        )}

        {CAMP_LINKS.instagram && (
          <a
            href={CAMP_LINKS.instagram}
            target="_blank"
            rel="noopener"
            aria-label="Instagram"
            className="w-12 h-12 rounded-xl bg-gray-50 text-gray-600 hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888] hover:text-white flex items-center justify-center transition hover:scale-110"
          >
            <InstagramIcon size={20} />
          </a>
        )}

        {CAMP_LINKS.youtube && (
          <a
            href={CAMP_LINKS.youtube}
            target="_blank"
            rel="noopener"
            aria-label="YouTube"
            className="w-12 h-12 rounded-xl bg-gray-50 text-gray-600 hover:bg-[#ff0000] hover:text-white flex items-center justify-center transition hover:scale-110"
          >
            <YoutubeIcon size={20} />
          </a>
        )}

        {CAMP_LINKS.tiktok && (
          <a
            href={CAMP_LINKS.tiktok}
            target="_blank"
            rel="noopener"
            aria-label="TikTok"
            className="w-12 h-12 rounded-xl bg-gray-50 text-gray-700 hover:bg-black hover:text-white flex items-center justify-center transition hover:scale-110"
          >
            <TikTokIcon size={20} />
          </a>
        )}
      </aside>

    </>
  );
}
