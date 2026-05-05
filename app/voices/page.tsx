import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { DONGS, CATEGORIES } from "@/lib/constants";
import type { Voice } from "@/lib/types";

export const metadata = {
  title: "시민의견 — 오산의 목소리",
  description: "오산 시민이 보낸 정책 의견을 한곳에서 보세요.",
};

export const revalidate = 60; // 1분마다 ISR

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "방금 전";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}일 전`;
  return new Date(iso).toLocaleDateString("ko-KR");
}

interface SearchParams {
  searchParams: Promise<{
    dong?: string;
    cat?: string;
    submitted?: string;
  }>;
}

export default async function VoicesPage({ searchParams }: SearchParams) {
  const sp = await searchParams;
  const dongFilter = sp.dong;
  const catFilter = sp.cat;
  const justSubmitted = sp.submitted === "1";

  let voices: Voice[] = [];
  let totalCount = 0;
  let fetchError: string | null = null;

  try {
    const supabase = getSupabase();
    let query = supabase
      .from("voices")
      .select("*", { count: "exact" })
      .eq("is_visible", true)
      .order("created_at", { ascending: false })
      .limit(50);

    if (dongFilter) query = query.eq("dong", dongFilter);
    if (catFilter) query = query.eq("category", catFilter);

    const { data, count, error } = await query;
    if (error) throw error;
    voices = (data ?? []) as Voice[];
    totalCount = count ?? 0;
  } catch (e) {
    console.error("[VoicesPage] fetch error:", e);
    fetchError = "목록을 불러오는 중 오류가 발생했습니다.";
  }

  const dongMap = Object.fromEntries(DONGS.map((d) => [d.id, d.name]));
  const catMap = Object.fromEntries(
    CATEGORIES.map((c) => [c.key, { name: c.name, emoji: c.emoji }])
  );

  return (
    <main className="min-h-screen bg-white text-[#0f1a2e]">
      {/* 헤더 */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10 backdrop-blur bg-white/95">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-black text-[#003b8e]">
            오산의 목소리
          </Link>
          <Link
            href="/voices/new"
            className="bg-[#003b8e] text-white font-bold px-5 py-2 rounded-lg text-sm hover:bg-[#1a2654] transition"
          >
            의견 남기기
          </Link>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-10">
        {justSubmitted && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6 text-sm text-green-800 font-bold">
            ✓ 의견이 등록되었습니다. 감사합니다.
          </div>
        )}

        <div className="mb-8">
          <p className="text-sm font-bold tracking-widest text-[#003b8e] mb-3">
            CITIZEN VOICES
          </p>
          <h1 className="text-2xl md:text-3xl font-black mb-3">시민의견</h1>
          <p className="text-gray-600">
            현재까지 <b className="text-[#003b8e]">{totalCount}건</b>의 의견이
            전달되었습니다.
          </p>
        </div>

        {/* 필터 */}
        <div className="space-y-4 mb-8">
          <div>
            <div className="text-xs font-bold text-gray-500 mb-2 tracking-widest">
              행정동
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/voices"
                className={`text-sm font-bold px-4 py-2 rounded-full border-2 transition ${
                  !dongFilter
                    ? "bg-[#003b8e] text-white border-[#003b8e]"
                    : "border-gray-200 hover:border-[#003b8e]"
                }`}
              >
                전체
              </Link>
              {DONGS.map((d) => (
                <Link
                  key={d.id}
                  href={`/voices?dong=${d.id}${catFilter ? `&cat=${catFilter}` : ""}`}
                  className={`text-sm font-bold px-4 py-2 rounded-full border-2 transition ${
                    dongFilter === d.id
                      ? "bg-[#003b8e] text-white border-[#003b8e]"
                      : "border-gray-200 hover:border-[#003b8e]"
                  }`}
                >
                  {d.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-gray-500 mb-2 tracking-widest">
              카테고리
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={dongFilter ? `/voices?dong=${dongFilter}` : "/voices"}
                className={`text-sm font-bold px-4 py-2 rounded-full border-2 transition ${
                  !catFilter
                    ? "bg-[#003b8e] text-white border-[#003b8e]"
                    : "border-gray-200 hover:border-[#003b8e]"
                }`}
              >
                전체
              </Link>
              {CATEGORIES.map((c) => (
                <Link
                  key={c.key}
                  href={`/voices?cat=${c.key}${dongFilter ? `&dong=${dongFilter}` : ""}`}
                  className={`text-sm font-bold px-4 py-2 rounded-full border-2 transition ${
                    catFilter === c.key
                      ? "bg-[#003b8e] text-white border-[#003b8e]"
                      : "border-gray-200 hover:border-[#003b8e]"
                  }`}
                >
                  {c.emoji} {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 목록 */}
        {fetchError ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-red-700 text-center">
            {fetchError}
          </div>
        ) : voices.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-16 text-center text-gray-500">
            <p className="font-bold mb-2">아직 등록된 의견이 없습니다.</p>
            <p className="text-sm">첫 의견을 남겨주세요.</p>
            <Link
              href="/voices/new"
              className="inline-block mt-6 bg-[#003b8e] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#1a2654] transition"
            >
              의견 남기기
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {voices.map((v) => {
              const cat = catMap[v.category];
              return (
                <li
                  key={v.id}
                  className="border-2 border-gray-200 rounded-lg p-5 hover:border-[#003b8e] transition"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-3 text-xs font-bold">
                    <span className="bg-[#003b8e] text-white px-3 py-1 rounded-full">
                      {dongMap[v.dong] ?? v.dong}
                    </span>
                    <span className="bg-[#ffd54a] text-[#0f1a2e] px-3 py-1 rounded-full">
                      {cat?.emoji} {cat?.name ?? v.category}
                    </span>
                    {v.age_group && (
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                        {v.age_group}
                        {v.gender === "m"
                          ? " 남"
                          : v.gender === "f"
                            ? " 여"
                            : ""}
                      </span>
                    )}
                    <span className="ml-auto text-gray-400">
                      {formatRelative(v.created_at)}
                    </span>
                  </div>
                  <p className="text-sm md:text-base leading-relaxed text-gray-800 whitespace-pre-wrap">
                    {v.content}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
