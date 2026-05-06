import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { TimeSeriesChart } from "@/components/TimeSeriesChart";
import { WordCloud } from "@/components/WordCloud";
import { DONGS, CATEGORIES } from "@/lib/constants";
import { getSupabase } from "@/lib/supabase";
import { extractKeywords, buildDailySeries } from "@/lib/keywords";
import { BarChart3, TrendingUp, Hash } from "lucide-react";

export const revalidate = 60;
export const metadata = {
  title: "참여현황 — 오산의 목소리",
  description: "행정동별·카테고리별 시민 의견 통계.",
};

async function getStats() {
  try {
    const supabase = getSupabase();
    const [totalRes, listRes] = await Promise.all([
      supabase
        .from("voices")
        .select("*", { count: "exact", head: true })
        .eq("is_visible", true),
      supabase
        .from("voices")
        .select("dong, category, content, created_at")
        .eq("is_visible", true)
        .order("created_at", { ascending: false })
        .limit(2000),
    ]);

    const total = totalRes.count ?? 0;
    const rows =
      (listRes.data as Array<{
        dong: string;
        category: string;
        content: string;
        created_at: string;
      }>) ?? [];

    const dongCounts = new Map<string, number>();
    const catCounts = new Map<string, number>();
    const contents: string[] = [];
    const createdAts: string[] = [];
    rows.forEach((r) => {
      dongCounts.set(r.dong, (dongCounts.get(r.dong) ?? 0) + 1);
      catCounts.set(r.category, (catCounts.get(r.category) ?? 0) + 1);
      contents.push(r.content);
      createdAts.push(r.created_at);
    });

    const series = buildDailySeries(createdAts, 14);
    const keywords = extractKeywords(contents, 30);

    return { total, dongCounts, catCounts, series, keywords };
  } catch {
    return {
      total: 0,
      dongCounts: new Map<string, number>(),
      catCounts: new Map<string, number>(),
      series: buildDailySeries([], 14),
      keywords: [],
    };
  }
}

function Bar({ label, count, max }: { label: string; count: number; max: number }) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-sm font-bold">{label}</span>
        <span className="text-xs font-black text-[#003b8e] tabular">
          {count}건
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#003b8e] to-[#2a5cb0] rounded-full transition-all duration-700"
          style={{ width: `${Math.max(pct, count > 0 ? 2 : 0)}%` }}
        />
      </div>
    </div>
  );
}

export default async function StatsPage() {
  const { total, dongCounts, catCounts, series, keywords } = await getStats();
  const maxDong = Math.max(...Array.from(dongCounts.values()), 1);
  const maxCat = Math.max(...Array.from(catCounts.values()), 1);
  const last14Total = series.reduce((s, d) => s + d.value, 0);

  return (
    <main className="min-h-screen bg-mesh-light text-[#0a0e1a]">
      <Header />

      <section className="bg-mesh-hero text-white relative overflow-hidden noise">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center relative z-10">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest mb-6 backdrop-blur">
              <BarChart3 size={14} className="text-[#ffd54a]" />
              PARTICIPATION STATS
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight mb-5">
              <span className="text-gradient-gold">참여현황</span>
            </h1>
            <p className="opacity-85">실시간으로 집계된 시민 의견 통계입니다.</p>
          </FadeIn>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <FadeIn>
          <div className="text-center mb-14">
            <div className="text-6xl md:text-8xl font-black text-[#003b8e] tabular tracking-tight">
              <AnimatedCounter value={total} />
            </div>
            <div className="text-sm md:text-base text-gray-600 font-bold mt-3">
              누적 시민 의견
            </div>
          </div>
        </FadeIn>

        {/* 시계열 차트 */}
        <FadeIn>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-black tracking-tight inline-flex items-center gap-2">
                  <TrendingUp size={16} className="text-[#003b8e]" />
                  최근 14일 추이
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  지난 2주간 등록된 의견은 {last14Total}건입니다.
                </p>
              </div>
            </div>
            <TimeSeriesChart data={series} />
          </div>
        </FadeIn>

        {/* 워드클라우드 */}
        <FadeIn delay={0.05}>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-6">
            <div className="mb-3">
              <h2 className="text-base font-black tracking-tight inline-flex items-center gap-2">
                <Hash size={16} className="text-[#003b8e]" />
                자주 등장한 키워드
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                의견 본문에서 추출한 상위 키워드 (2회 이상 언급)
              </p>
            </div>
            <WordCloud words={keywords} />
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6">
          <FadeIn>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
              <h2 className="text-base font-black mb-5 tracking-tight">
                행정동별
              </h2>
              <div className="space-y-3">
                {DONGS.map((d) => (
                  <Bar
                    key={d.id}
                    label={d.name}
                    count={dongCounts.get(d.id) ?? 0}
                    max={maxDong}
                  />
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
              <h2 className="text-base font-black mb-5 tracking-tight">
                카테고리별
              </h2>
              <div className="space-y-3">
                {CATEGORIES.map((c) => (
                  <Bar
                    key={c.key}
                    label={`${c.emoji} ${c.name}`}
                    count={catCounts.get(c.key) ?? 0}
                    max={maxCat}
                  />
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <div className="text-center mt-14">
            <Link
              href="/voices/new"
              className="inline-flex items-center gap-2 bg-[#003b8e] text-white font-black px-8 py-4 rounded-xl text-base hover:bg-[#0a1633] transition shadow-lg"
            >
              의견 남기기
            </Link>
          </div>
        </FadeIn>
      </section>

      <Footer />
    </main>
  );
}
