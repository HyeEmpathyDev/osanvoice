import Link from "next/link";
import { DONGS, CATEGORIES, SITE } from "@/lib/constants";
import { getSupabase } from "@/lib/supabase";

export const revalidate = 60;

async function getStats() {
  try {
    const supabase = getSupabase();
    const [totalRes, dongsRes, catsRes] = await Promise.all([
      supabase.from("voices").select("*", { count: "exact", head: true }).eq("is_visible", true),
      supabase.from("voices").select("dong").eq("is_visible", true),
      supabase.from("voices").select("category").eq("is_visible", true),
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

    return { total, dongCounts, catCounts };
  } catch {
    return {
      total: 0,
      dongCounts: new Map<string, number>(),
      catCounts: new Map<string, number>(),
    };
  }
}

export default async function Home() {
  const { total, dongCounts, catCounts } = await getStats();

  return (
    <main className="min-h-screen bg-white text-[#0f1a2e]">
      {/* 헤더 */}
      <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-black text-[#003b8e]">
            오산의 목소리
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-bold">
            <Link href="/voices" className="hover:text-[#003b8e]">시민의견</Link>
            <Link href="/map" className="hover:text-[#003b8e]">고충지도</Link>
            <Link href="/promises" className="hover:text-[#003b8e]">7대 약속</Link>
            <Link href="/stats" className="hover:text-[#003b8e]">참여현황</Link>
            <Link href="/library" className="hover:text-[#003b8e]">자료실</Link>
            <Link href="/about" className="hover:text-[#003b8e]">소개</Link>
          </nav>
        </div>
      </header>

      {/* 히어로 */}
      <section className="bg-gradient-to-br from-[#003b8e] to-[#1a2654] text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
          <p className="text-sm font-bold tracking-[0.3em] opacity-80 mb-6">
            OSAN VOICE · 2026
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-[1.2] tracking-tight mb-6">
            오산의 변화와 미래를 위해<br />
            <span className="text-[#ffd54a]">시민의 목소리</span>를 듣습니다.
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-12">
            {SITE.subTagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/voices/new"
              className="inline-block bg-[#ffd54a] text-[#003b8e] font-black px-10 py-4 rounded-lg text-lg hover:opacity-90 transition shadow-lg"
            >
              의견 남기기
            </Link>
            <Link
              href="/voices"
              className="inline-block border-2 border-white text-white font-bold px-10 py-4 rounded-lg text-lg hover:bg-white hover:text-[#003b8e] transition"
            >
              시민의견 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 카운터 */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl md:text-5xl font-black text-[#003b8e]">{total}</div>
            <div className="text-xs md:text-sm text-gray-600 mt-2 font-bold">시민 의견</div>
          </div>
          <div className="border-x border-gray-200">
            <div className="text-3xl md:text-5xl font-black text-[#003b8e]">8</div>
            <div className="text-xs md:text-sm text-gray-600 mt-2 font-bold">행정동</div>
          </div>
          <div>
            <div className="text-3xl md:text-5xl font-black text-[#003b8e]">7</div>
            <div className="text-xs md:text-sm text-gray-600 mt-2 font-bold">정책 카테고리</div>
          </div>
        </div>
      </section>

      {/* 8개 행정동 */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-sm font-bold tracking-widest text-[#003b8e] mb-3">
            8 ADMINISTRATIVE DISTRICTS
          </p>
          <h2 className="text-2xl md:text-4xl font-black mb-4">
            오산 8개 행정동, 어디서나 의견을 보내주세요
          </h2>
          <p className="text-gray-600">
            우리 동네 이야기가 정책이 됩니다.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {DONGS.map((d) => (
            <Link
              key={d.id}
              href={`/voices?dong=${d.id}`}
              className="border-2 border-gray-200 rounded-xl p-6 text-center hover:border-[#003b8e] hover:shadow-lg transition group"
            >
              <div className="text-lg md:text-xl font-black text-[#003b8e] group-hover:text-[#1a2654]">
                {d.name}
              </div>
              <div className="text-xs text-gray-500 mt-3 font-bold">
                의견 {dongCounts.get(d.id) ?? 0}건
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 카테고리 */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-sm font-bold tracking-widest text-[#003b8e] mb-3">
              7 POLICY CATEGORIES
            </p>
            <h2 className="text-2xl md:text-4xl font-black mb-4">
              7대 정책 카테고리
            </h2>
            <p className="text-gray-600">
              어떤 분야에 의견을 남기시겠어요?
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {CATEGORIES.map((c) => (
              <Link
                key={c.key}
                href={`/voices?cat=${c.key}`}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:border-[#003b8e] hover:shadow-lg transition"
              >
                <div className="text-3xl mb-3">{c.emoji}</div>
                <div className="text-sm md:text-base font-black text-[#003b8e]">
                  {c.name}
                </div>
                <div className="text-xs text-gray-500 mt-2 font-bold">
                  {catCounts.get(c.key) ?? 0}건
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-black mb-6">
          여러분의 한 마디가, 오산의 미래를 만듭니다.
        </h2>
        <p className="text-gray-600 mb-10 leading-relaxed">
          교통, 교육, 일자리, 환경… 일상에서 느끼는 모든 이야기를 들려주세요.<br />
          시민의 의견은 7대 약속과 권역별 현안으로 정리됩니다.
        </p>
        <Link
          href="/voices/new"
          className="inline-block bg-[#003b8e] text-white font-black px-10 py-4 rounded-lg text-lg hover:bg-[#1a2654] transition shadow-lg"
        >
          지금 의견 남기기 →
        </Link>
      </section>

      {/* 푸터 */}
      <footer className="bg-[#0f1a2e] text-white">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-lg font-black mb-3">오산의 목소리</div>
              <p className="text-sm opacity-80 leading-relaxed">
                {SITE.tagline}
              </p>
            </div>
            <div>
              <div className="text-sm font-black mb-3 opacity-90">메뉴</div>
              <ul className="text-sm opacity-80 space-y-2">
                <li><Link href="/voices">시민의견</Link></li>
                <li><Link href="/map">고충지도</Link></li>
                <li><Link href="/promises">7대 약속</Link></li>
                <li><Link href="/library">자료실</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-black mb-3 opacity-90">안내</div>
              <p className="text-xs opacity-70 leading-relaxed">
                본 사이트는 시민 정책 청취 플랫폼입니다.<br />
                수집된 의견은 익명 처리되며, 정책 검토 자료로만 활용됩니다.
              </p>
            </div>
          </div>
          <div className="border-t border-white/15 mt-10 pt-6 text-xs opacity-60">
            © 2026 오산의 목소리 · {SITE.contact}
          </div>
        </div>
      </footer>
    </main>
  );
}
