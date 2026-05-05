import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { POLICIES } from "@/lib/policies";
import { ArrowRight, Calendar, Coins, Sparkles } from "lucide-react";

export const metadata = {
  title: "9대 약속 — 오산의 목소리",
  description: "조용호 오산시장 후보의 9대 핵심 정책. 사업목표·우선순위·이행기간·재원조달 5요소로 검증 가능한 약속.",
};

export default function PromisesPage() {
  return (
    <main className="min-h-screen bg-mesh-light text-[#0a0e1a]">
      <Header />

      {/* 히어로 */}
      <section className="bg-mesh-hero text-white relative overflow-hidden noise">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center relative z-10">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest mb-6 backdrop-blur">
              <Sparkles size={14} className="text-[#ffd54a]" />
              9 PROMISES TO OSAN
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-[1.15] tracking-tight mb-6">
              오산의 미래를 위한<br />
              <span className="text-gradient-gold">9가지 약속</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg opacity-85 max-w-2xl mx-auto leading-relaxed">
              사업목표 · 우선순위 · 이행절차 · 이행기간 · 재원조달 — 5요소로 검증 가능한 정책.<br />
              <span className="opacity-70 text-sm">한국매니페스토실천본부 SA 등급 기준에 부합하는 공약 설계.</span>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 정책 카드 그리드 */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-5">
          {POLICIES.map((p, i) => (
              <FadeIn key={p.num} delay={i * 0.04}>
                <article className="group relative bg-white border border-gray-200 rounded-2xl p-7 lift overflow-hidden h-full flex flex-col">
                  {/* 번호 워터마크 */}
                  <div className="absolute -top-6 -right-2 text-[160px] font-black text-[#003b8e]/[0.04] leading-none select-none">
                    {p.num}
                  </div>

                  <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-[#003b8e] text-white text-xs font-black px-3 py-1.5 rounded-full">
                        정책 {p.num}
                      </span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-black mb-3 leading-tight tracking-tight">
                      {p.title}
                    </h2>

                    <p className="text-sm text-gray-600 leading-relaxed mb-5">
                      {p.summary}
                    </p>

                    <div className="space-y-2.5 mb-5 text-xs">
                      <div className="flex items-center gap-2.5">
                        <Sparkles size={14} className="text-[#ffd54a] flex-shrink-0" />
                        <span className="font-bold text-gray-700">시그니처:</span>
                        <span className="text-gray-600">{p.signature}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Calendar size={14} className="text-[#003b8e] flex-shrink-0" />
                        <span className="font-bold text-gray-700">이행기간:</span>
                        <span className="text-gray-600 tabular">{p.period}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Coins size={14} className="text-[#003b8e] flex-shrink-0" />
                        <span className="font-bold text-gray-700">재원조달:</span>
                        <span className="text-gray-600">{p.funding}</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-auto">
                      <div className="text-xs font-bold text-gray-500 mb-2 tracking-wider">
                        주요 추진 과제
                      </div>
                      <ul className="space-y-1">
                        {p.tasks.slice(0, 4).map((t, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-gray-700 flex items-start gap-2"
                          >
                            <span className="text-[#003b8e] font-black mt-0.5">·</span>
                            <span>{t}</span>
                          </li>
                        ))}
                        {p.tasks.length > 4 && (
                          <li className="text-xs text-gray-400 pl-3">
                            외 {p.tasks.length - 4}건…
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </article>
              </FadeIn>
            ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <FadeIn>
          <h2 className="text-2xl md:text-4xl font-black mb-5 tracking-tight">
            여러분의 의견이, 약속을 더 정교하게 만듭니다.
          </h2>
          <p className="text-gray-600 mb-10 leading-relaxed">
            9대 약속에 대한 시민 여러분의 의견과 보완점을 들려주세요.
          </p>
          <Link
            href="/voices/new"
            className="inline-flex items-center gap-2 bg-[#003b8e] text-white font-black px-8 py-4 rounded-xl text-base hover:bg-[#0a1633] transition shadow-lg shadow-[#003b8e]/20"
          >
            의견 남기기
            <ArrowRight size={18} />
          </Link>
        </FadeIn>
      </section>

      <Footer />
    </main>
  );
}
