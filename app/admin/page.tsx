import { createClient } from "@supabase/supabase-js";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminPanel } from "./AdminPanel";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "관리자 — 오산의 목소리",
  robots: { index: false, follow: false },
};

interface Search {
  searchParams: Promise<{ show?: string }>;
}

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function AdminPage({ searchParams }: Search) {
  // 인증은 middleware가 처리. 여기 도달하면 cookie 검증 통과 상태.
  const sp = await searchParams;
  const showHidden = sp.show === "all";

  let voices: Awaited<ReturnType<typeof loadVoices>> = [];
  let fetchError: string | null = null;
  try {
    voices = await loadVoices(showHidden);
  } catch (e) {
    fetchError =
      "목록 조회 실패: " +
      (e instanceof Error ? e.message : "알 수 없는 오류");
  }

  return (
    <main className="min-h-screen bg-mesh-light text-[#0a0e1a]">
      <Header />
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-black tracking-[0.3em] text-[#003b8e] mb-2">
              ADMIN
            </p>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-1">
              모더레이션
            </h1>
            <p className="text-sm text-gray-600">
              총 <b>{voices.length}건</b> · {showHidden ? "전체" : "공개"} 의견 표시
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="/admin"
              className={`text-sm font-bold px-4 py-2 rounded-lg border-2 transition ${
                !showHidden
                  ? "bg-[#003b8e] text-white border-[#003b8e]"
                  : "border-gray-200"
              }`}
            >
              공개만
            </a>
            <a
              href="/admin?show=all"
              className={`text-sm font-bold px-4 py-2 rounded-lg border-2 transition ${
                showHidden
                  ? "bg-[#003b8e] text-white border-[#003b8e]"
                  : "border-gray-200"
              }`}
            >
              전체
            </a>
          </div>
        </div>

        {fetchError ? (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-xl p-6 text-sm">
            {fetchError}
          </div>
        ) : (
          <AdminPanel voices={voices} />
        )}
      </section>
      <Footer />
    </main>
  );
}

async function loadVoices(showHidden: boolean) {
  if (!URL_ || !SERVICE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY 환경변수가 필요합니다 (Amplify에 추가)."
    );
  }
  const supabase = createClient(URL_, SERVICE_KEY, {
    auth: { persistSession: false },
  });
  let query = supabase
    .from("voices")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (!showHidden) query = query.eq("is_visible", true);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
