import Link from "next/link";
import { Mail, ExternalLink } from "lucide-react";
import { FacebookIcon, InstagramIcon, YoutubeIcon, TikTokIcon } from "./BrandIcons";
import { SITE, CAMP_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-[#0a0e1a] text-white">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="text-lg font-black mb-3">{SITE.name}</div>
            <p className="text-sm opacity-80 leading-relaxed">{SITE.tagline}</p>
          </div>

          <div>
            <div className="text-sm font-black mb-4 opacity-90 tracking-wide">
              메뉴
            </div>
            <ul className="text-sm opacity-80 space-y-2">
              <li>
                <Link href="/voices" className="hover:opacity-100">시민의견</Link>
              </li>
              <li>
                <Link href="/map" className="hover:opacity-100">고충지도</Link>
              </li>
              <li>
                <Link href="/stats" className="hover:opacity-100">참여현황</Link>
              </li>
            </ul>

            {/* 캠프 SNS */}
            <div className="mt-6">
              <div className="text-[11px] font-black opacity-70 tracking-widest mb-2">
                CAMP
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {CAMP_LINKS.campaign && (
                  <a
                    href={CAMP_LINKS.campaign}
                    target="_blank"
                    rel="noopener"
                    className="text-xs font-bold px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-1.5 transition"
                  >
                    <ExternalLink size={12} /> 캠프 공식
                  </a>
                )}
                {CAMP_LINKS.facebook && (
                  <a
                    href={CAMP_LINKS.facebook}
                    target="_blank"
                    rel="noopener"
                    aria-label="Facebook"
                    className="p-2 rounded-lg bg-white/10 hover:bg-[#1877f2] transition"
                  >
                    <FacebookIcon size={14} />
                  </a>
                )}
                {CAMP_LINKS.instagram && (
                  <a
                    href={CAMP_LINKS.instagram}
                    target="_blank"
                    rel="noopener"
                    aria-label="Instagram"
                    className="p-2 rounded-lg bg-white/10 hover:bg-[#e4405f] transition"
                  >
                    <InstagramIcon size={14} />
                  </a>
                )}
                {CAMP_LINKS.youtube && (
                  <a
                    href={CAMP_LINKS.youtube}
                    target="_blank"
                    rel="noopener"
                    aria-label="YouTube"
                    className="p-2 rounded-lg bg-white/10 hover:bg-[#ff0000] transition"
                  >
                    <YoutubeIcon size={14} />
                  </a>
                )}
                {CAMP_LINKS.tiktok && (
                  <a
                    href={CAMP_LINKS.tiktok}
                    target="_blank"
                    rel="noopener"
                    aria-label="TikTok"
                    className="p-2 rounded-lg bg-white/10 hover:bg-black transition"
                  >
                    <TikTokIcon size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-black mb-4 opacity-90 tracking-wide">
              문의사항
            </div>
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#ffd54a] hover:text-white transition"
            >
              <Mail size={16} />
              {SITE.contactEmail}
            </a>
            <p className="text-xs opacity-60 mt-2">{SITE.contactLabel}</p>
            <p className="text-xs opacity-60 mt-4 leading-relaxed">
              본 사이트는 시민 정책 청취 플랫폼입니다.<br />
              수집된 의견은 익명 처리되며 정책 검토 자료로만 활용됩니다.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-xs opacity-60">
          <div>© 2026 {SITE.name}</div>
          <div>제9회 전국동시지방선거 · 2026.06.03</div>
        </div>
      </div>
    </footer>
  );
}
