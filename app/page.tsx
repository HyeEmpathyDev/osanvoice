import Link from "next/link";
import { DONGS, CATEGORIES, SITE } from "@/lib/constants";
import { getSupabase } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ProgressBar } from "@/components/ProgressBar";
import { DDay } from "@/components/DDay";
import { LikeButton } from "@/components/LikeButton";
import { ArrowRight, MessageSquarePlus, Sparkles, Flame } from "lucide-react";
import type { Voice } from "@/lib/types";

// 카운트가 시민에게 즉시 반영되어야 하므로 매 요청마다 fresh.
// (캐시되면 의견 새로 등록·공개 처리해도 메인 화면 숫자가 안 바뀐다)
export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const supabase = getSupabase();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const [totalRes, dongsRes, catsRes, bestRes] = await Promise.all([
      supabase.from("voices").select("*", { count: "exact", head: true }).eq("is_visible", true),
      supabase.from("voices").select("dong").eq("is_visible", true),
      supabase.from("voices").select("category").eq("is_visible", true),
      supabase
        .from("voices")
        .select("*")
        .eq("is_visible", true)
        .gte("created_at", sevenDaysAgo)
        .order("like_count", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    const total = totalRes.count ?? 0;
    const dongCounts = new Map<string, number>();
    (dongsRes.data ?? []).forEach((r: { dong: string }) =>
      dongCounts.set(r.dong, (dongCounts.get(r.dong) ?? 0) + 1)
    );
    const catCounts = new Map<string, number>();
    (catsRes.data ?? []).forEach((r: { category: string }) =>
      catCounts.set(r.category, (catCounts.get(r.category) ?? 0) + 1)
    );
    const best = ((bestRes.data ?? []) as Voice[]).filter(
      (v) => (v.like_count ?? 0) > 0
    );

    return { total, dongCounts, catCounts, best };
  } catch {
    return {
      total: 0,
      dongCounts: new Map<string, number>(),
      catCounts: new Map<string, number>(),
      best: [] as Voice[],
    };
  }
}

export default async function Home() {
  const { total, dongCounts, catCounts, best } = await getStats();
  const dongMap = Object.fromEntries(DONGS.map((d) => [d.id, d.name]));
  const catMap = Object.fromEntries(
    CATEGORIES.map((c) => [c.key, { name: c.name, emoji: c.emoji }])
  );

  return (
    <main className="min-h-screen bg-white text-[#0a0e1a]">
      <Header />

      {/* 헤더 하단 — 모바일은 D-Day, 데스크톱은 진행 바 */}
      <div className="md:hidden bg-gradient-to-r from-white to-amber-50 border-y border-amber-100 py-3 px-6">
        <DDay />
      </div>
      <div className="hidden md:block">
        <ProgressBar count={total} goal={Math.max(100, Math.ceil(total / 100) * 100)} />
      </div>

      {/* 히어로 */}
      <section className="bg-mesh-hero text-white relative overflow-hidden noise">
        <div className="max-w-6xl mx-auto px-6 pt-40 pb-28 md:pt-48 md:pb-36 text-center relative z-10">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest mb-7 backdrop-blur">
              <Sparkles size={14} className="text-[#ffd54a]" />
              OSAN VOICE · 2026
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-[1.15] tracking-tight mb-6">
              오산의 변화와 미래를 위해<br />
              <span className="text-gradient-gold">시민의 목소리</span>를 듣습니다.
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl opacity-85 mb-12 max-w-xl mx-auto">
              {SITE.subTagline}
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/voices/new"
                className="group inline-flex items-center justify-center gap-2 bg-[#ffd54a] text-[#0a1633] font-black px-8 py-4 rounded-xl text-base hover:bg-[#fbcf3b] transition shadow-lg shadow-[#ffd54a]/20"
              >
                <MessageSquarePlus size={18} />
                의견 남기기
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition" />
              </Link>
              <Link
                href="/voices"
                className="inline-flex items-center justify-center gap-2 border border-white/30 bg-white/5 text-white font-bold px-8 py-4 rounded-xl text-base hover:bg-white/15 transition backdrop-blur"
              >
                시민의견 보기
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* 카운터 (히어로 하단 글래스 띠) */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-14">
          <div className="glass-dark rounded-2xl p-6 md:p-8 grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-black text-white tabular tracking-tight">
                <AnimatedCounter value={total} />
              </div>
              <div className="text-xs md:text-sm text-white/70 mt-2 font-bold tracking-wide">
                시민 의견
              </div>
            </div>
            <div className="text-center border-x border-white/10">
              <div className="text-3xl md:text-5xl font-black text-white tabular tracking-tight">
                <AnimatedCounter value={8} />
              </div>
              <div className="text-xs md:text-sm text-white/70 mt-2 font-bold tracking-wide">
                행정동
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-black text-white tabular tracking-tight">
                <AnimatedCounter value={9} />
              </div>
              <div className="text-xs md:text-sm text-white/70 mt-2 font-bold tracking-wide">
                의견 분야
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8개 행정동 */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <FadeIn>
          <div className="text-center mb-12">
            <p className="text-xs font-black tracking-[0.3em] text-[#003b8e] mb-3">
              8 ADMINISTRATIVE DISTRICTS
            </p>
            <h2 className="text-2xl md:text-4xl font-black mb-4 tracking-tight">
              오산 8개 행정동
            </h2>
            <p className="text-gray-600">
              우리 동네 이야기가 정책이 됩니다.
            </p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DONGS.map((d, i) => (
            <FadeIn key={d.id} delay={i * 0.04}>
              <Link
                href={`/voices?dong=${d.id}`}
                className="group block bg-white border border-gray-200 rounded-2xl p-6 text-center lift hover:border-[#003b8e]"
              >
                <div className="text-lg md:text-xl font-black text-[#003b8e] mb-2 tracking-tight">
                  {d.name}
                </div>
                <div className="inline-flex items-center gap-1 text-xs text-gray-500 font-bold">
                  <span className="tabular">{dongCounts.get(d.id) ?? 0}</span>
                  <span>건</span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 이번 주 베스트 의견 */}
      {best.length > 0 && (
        <section className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-6 py-20">
            <FadeIn>
              <div className="text-center mb-10">
                <p className="text-xs font-black tracking-[0.3em] text-[#e4405f] mb-3 inline-flex items-center gap-2 justify-center">
                  <Flame size={14} className="text-[#e4405f]" />
                  THIS WEEK&apos;S BEST
                </p>
                <h2 className="text-2xl md:text-4xl font-black mb-4 tracking-tight">
                  이번 주 인기 의견
                </h2>
                <p className="text-gray-600">
                  많은 시민이 공감한 의견 TOP {best.length}
                </p>
              </div>
            </FadeIn>
            <ul className="space-y-3">
              {best.map((v, i) => {
                const cat = catMap[v.category];
                return (
                  <FadeIn key={v.id} delay={i * 0.04}>
                    <li className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#003b8e] transition flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#e4405f] to-[#bc1888] text-white flex items-center justify-center font-black text-sm">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2 text-xs font-bold">
                          <span className="bg-[#003b8e] text-white px-2.5 py-0.5 rounded-full">
                            {dongMap[v.dong] ?? v.dong}
                          </span>
                          <span className="bg-[#ffd54a] text-[#0f1a2e] px-2.5 py-0.5 rounded-full">
                            {cat?.emoji} {cat?.name ?? v.category}
                          </span>
                        </div>
                        <p className="text-sm md:text-base leading-relaxed text-gray-800 line-clamp-3 mb-3">
                          {v.content}
                        </p>
                        <div className="flex justify-end">
                          <LikeButton
                            voiceId={v.id}
                            initialCount={v.like_count ?? 0}
                          />
                        </div>
                      </div>
                    </li>
                  </FadeIn>
                );
              })}
            </ul>
            <div className="text-center mt-8">
              <Link
                href="/voices?sort=popular"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#003b8e] hover:underline"
              >
                인기 의견 더 보기
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 9대 카테고리 */}
      <section className="bg-mesh-light border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-xs font-black tracking-[0.3em] text-[#003b8e] mb-3">
                9 TOPICS
              </p>
              <h2 className="text-2xl md:text-4xl font-black mb-4 tracking-tight">
                9개 의견 분야
              </h2>
              <p className="text-gray-600">
                어떤 분야에 의견을 남기시겠어요?
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
            {CATEGORIES.map((c, i) => (
              <FadeIn key={c.key} delay={i * 0.03}>
                <Link
                  href={`/voices?cat=${c.key}`}
                  className="group block bg-white border border-gray-200 rounded-2xl p-6 lift hover:border-[#003b8e]"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{c.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-black text-[#003b8e] mb-1">
                        {c.name}
                      </div>
                      <div className="text-xs text-gray-500 mb-2 leading-relaxed">
                        {c.desc}
                      </div>
                      <div className="text-xs font-bold text-gray-400 tabular">
                        {catCounts.get(c.key) ?? 0}건
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-mesh-hero text-white relative overflow-hidden noise">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center relative z-10">
          <FadeIn>
            <h2 className="text-2xl md:text-4xl font-black mb-5 tracking-tight">
              여러분의 한 마디가,<br />
              오산의 미래를 만듭니다.
            </h2>
            <p className="opacity-80 mb-10 leading-relaxed">
              교통, 교육, 일자리, 환경… 일상에서 느끼는 모든 이야기를 들려주세요.
            </p>
            <Link
              href="/voices/new"
              className="inline-flex items-center gap-2 bg-[#ffd54a] text-[#0a1633] font-black px-10 py-4 rounded-xl text-base hover:bg-[#fbcf3b] transition shadow-2xl shadow-[#ffd54a]/30"
            >
              지금 의견 남기기
              <ArrowRight size={18} />
            </Link>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}
