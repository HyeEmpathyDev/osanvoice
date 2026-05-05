import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { DONGS } from "@/lib/constants";
import { MapPin, ArrowRight } from "lucide-react";

export const metadata = {
  title: "고충지도 — 오산의 목소리",
  description: "오산 8개 행정동별 시민 의견을 한눈에.",
};

export default function MapPage() {
  return (
    <main className="min-h-screen bg-mesh-light text-[#0a0e1a]">
      <Header />

      <section className="bg-mesh-hero text-white relative overflow-hidden noise">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center relative z-10">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest mb-6 backdrop-blur">
              <MapPin size={14} className="text-[#ffd54a]" />
              CITIZEN COMPLAINT MAP
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight mb-5">
              오산 <span className="text-gradient-gold">고충지도</span>
            </h1>
            <p className="opacity-85 max-w-xl mx-auto">
              8개 행정동별 시민의 목소리를 한눈에 살펴보세요.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <FadeIn>
          <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-14 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#003b8e]/5 rounded-2xl mb-6">
              <MapPin size={28} className="text-[#003b8e]" />
            </div>
            <h2 className="text-xl md:text-2xl font-black mb-3 tracking-tight">
              지도 기반 시각화 준비 중
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed max-w-md mx-auto">
              네이버 지도와 연동된 권역별 의견 핀 시각화는
              5월 둘째 주 업데이트 예정입니다.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {DONGS.map((d) => (
                <Link
                  key={d.id}
                  href={`/voices?dong=${d.id}`}
                  className="bg-gray-50 hover:bg-[#003b8e] hover:text-white border border-gray-200 hover:border-[#003b8e] rounded-xl p-4 text-sm font-bold transition"
                >
                  {d.name}
                </Link>
              ))}
            </div>

            <Link
              href="/voices"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#003b8e] hover:underline"
            >
              시민의견 목록으로 보기
              <ArrowRight size={16} />
            </Link>
          </div>
        </FadeIn>
      </section>

      <Footer />
    </main>
  );
}
