import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { NaverMap, type DongMarker } from "@/components/NaverMap";
import { DONGS } from "@/lib/constants";
import { getSupabase } from "@/lib/supabase";
import { MapPin, ArrowRight } from "lucide-react";

export const metadata = {
  title: "고충지도 — 오산의 목소리",
  description: "오산 8개 행정동별 시민 의견을 한눈에.",
};

export const revalidate = 60;

async function fetchDongCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = Object.fromEntries(
    DONGS.map((d) => [d.id, 0])
  );
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("voices")
      .select("dong")
      .eq("is_visible", true);
    if (error) throw error;
    for (const row of data ?? []) {
      const k = (row as { dong: string }).dong;
      if (k in counts) counts[k] += 1;
    }
  } catch (e) {
    console.error("[MapPage] count fetch error:", e);
  }
  return counts;
}

export default async function MapPage() {
  const counts = await fetchDongCounts();
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  const markers: DongMarker[] = DONGS.map((d) => ({
    id: d.id,
    name: d.name,
    lat: d.lat,
    lng: d.lng,
    count: counts[d.id] ?? 0,
  }));

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
              현재 <b className="text-[#ffd54a]">{total}건</b>의 의견이 등록되어 있습니다.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14">
        <FadeIn>
          <NaverMap markers={markers} />
        </FadeIn>

        <FadeIn>
          <div className="mt-10">
            <h2 className="text-lg font-black mb-4 tracking-tight">행정동별 의견 수</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DONGS.map((d) => (
                <Link
                  key={d.id}
                  href={`/voices?dong=${d.id}`}
                  className="bg-white border border-gray-200 hover:border-[#003b8e] rounded-xl p-4 text-sm font-bold transition flex items-center justify-between"
                >
                  <span>{d.name}</span>
                  <span className="bg-[#003b8e] text-white text-xs px-2.5 py-1 rounded-full">
                    {counts[d.id] ?? 0}
                  </span>
                </Link>
              ))}
            </div>

            <Link
              href="/voices"
              className="inline-flex items-center gap-2 mt-8 text-sm font-bold text-[#003b8e] hover:underline"
            >
              시민의견 전체 목록 보기
              <ArrowRight size={16} />
            </Link>
          </div>
        </FadeIn>
      </section>

      <Footer />
    </main>
  );
}
