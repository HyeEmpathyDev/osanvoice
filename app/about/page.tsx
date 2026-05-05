import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { Info, Shield, Users, Lightbulb } from "lucide-react";

export const metadata = {
  title: "소개 — 오산의 목소리",
  description: "오산의 목소리는 시민이 만든 정책 청취 플랫폼입니다.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-mesh-light text-[#0a0e1a]">
      <Header />

      <section className="bg-mesh-hero text-white relative overflow-hidden noise">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center relative z-10">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest mb-6 backdrop-blur">
              <Info size={14} className="text-[#ffd54a]" />
              ABOUT
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight mb-5">
              <span className="text-gradient-gold">오산의 목소리</span>
            </h1>
            <p className="opacity-85 max-w-xl mx-auto leading-relaxed">
              오산 시민이 직접 정책 의견을 보내고,<br />
              그 목소리가 9대 약속과 권역별 현안으로 정리됩니다.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <FadeIn>
          <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 mb-10">
            <h2 className="text-xl md:text-2xl font-black mb-5 tracking-tight">
              왜 만들었나요?
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                선거철에만 듣는 시민의 목소리가 아니라, 일상에서 느끼는 모든
                이야기를 정책으로 옮기는 통로가 필요했습니다.
              </p>
              <p>
                오산의 목소리는 <b>익명·실시간·시민 주도</b>로 운영되는 정책 청취
                플랫폼입니다. 의견은 8개 행정동·9대 정책 카테고리로 정리되어, 정책 검토
                자료로 활용됩니다.
              </p>
              <p>
                <b>한국매니페스토실천본부 SA 등급 기준</b>에 따라, 모든 정책에는
                사업목표·우선순위·이행절차·이행기간·재원조달의 5요소가 명시됩니다.
              </p>
            </div>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-4">
          <FadeIn delay={0.05}>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 h-full">
              <div className="w-10 h-10 bg-[#003b8e]/5 rounded-xl flex items-center justify-center mb-4">
                <Users size={20} className="text-[#003b8e]" />
              </div>
              <h3 className="font-black mb-2 tracking-tight">시민 주도</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                누구나 의견을 남길 수 있고, 누구나 의견을 볼 수 있습니다.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 h-full">
              <div className="w-10 h-10 bg-[#003b8e]/5 rounded-xl flex items-center justify-center mb-4">
                <Shield size={20} className="text-[#003b8e]" />
              </div>
              <h3 className="font-black mb-2 tracking-tight">익명 보호</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                개인정보 없이 익명으로 운영. 부적절한 내용은 비공개 처리됩니다.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 h-full">
              <div className="w-10 h-10 bg-[#003b8e]/5 rounded-xl flex items-center justify-center mb-4">
                <Lightbulb size={20} className="text-[#003b8e]" />
              </div>
              <h3 className="font-black mb-2 tracking-tight">정책 연결</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                의견은 9대 약속과 권역별 현안으로 정리되어 정책 자료가 됩니다.
              </p>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <div className="text-center mt-14">
            <Link
              href="/voices/new"
              className="inline-flex items-center gap-2 bg-[#003b8e] text-white font-black px-8 py-4 rounded-xl text-base hover:bg-[#0a1633] transition shadow-lg"
            >
              지금 의견 남기기
            </Link>
          </div>
        </FadeIn>
      </section>

      <Footer />
    </main>
  );
}
