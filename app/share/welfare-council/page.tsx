import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  TikTokIcon,
} from "@/components/BrandIcons";

const TITLE = "사회복지협의회로부터 정책제안을 전달받았습니다.";
const DESC = "함께 잘 사는 오산, 든든하고 당당한 오산을 만들겠습니다.";
const URL = "/share/welfare-council";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESC,
    type: "article",
    locale: "ko_KR",
    url: URL,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
  },
};

const LINKS = [
  {
    href: "https://www.instagram.com/reel/DX-9WWJTzDE/",
    label: "Instagram에서 보기",
    Icon: InstagramIcon,
    bg: "from-[#f09433] via-[#e6683c] to-[#bc1888]",
  },
  {
    href: "https://www.facebook.com/share/v/18T17QVAYV/",
    label: "Facebook에서 보기",
    Icon: FacebookIcon,
    bg: "from-[#1877f2] to-[#0d5cba]",
  },
  {
    href: "https://www.tiktok.com/@joyho645/video/7636632489611529473",
    label: "TikTok에서 보기",
    Icon: TikTokIcon,
    bg: "from-[#111] to-[#000]",
  },
  {
    href: "https://youtube.com/shorts/umR2qZIZ07U",
    label: "YouTube에서 보기",
    Icon: YoutubeIcon,
    bg: "from-[#ff0000] to-[#c00]",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#003b8e] via-[#1a2654] to-[#0a1633] text-white">
      <div className="max-w-md mx-auto px-6 py-16 md:py-24">
        <div className="text-[10px] font-black tracking-[0.3em] opacity-70 mb-5">
          OSAN VOICE
        </div>
        <h1 className="text-2xl md:text-3xl font-black mb-5 leading-snug tracking-tight">
          {TITLE}
        </h1>
        <p className="opacity-85 mb-10 leading-relaxed">{DESC}</p>

        <div className="flex flex-col gap-3">
          {LINKS.map(({ href, label, Icon, bg }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group bg-gradient-to-r ${bg} rounded-2xl p-4 flex items-center gap-4 transition hover:scale-[1.02] shadow-lg shadow-black/30`}
            >
              <span className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center shrink-0">
                <Icon size={20} />
              </span>
              <span className="font-black flex-1">{label}</span>
              <ArrowRight
                size={18}
                className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition"
              />
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
