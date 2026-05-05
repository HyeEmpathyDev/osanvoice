import { createClient } from "@supabase/supabase-js";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminPanel } from "./AdminPanel";
import { ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "관리자 — 오산의 목소리",
  robots: { index: false, follow: false },
};

interface Search {
  searchParams: Promise<{ token?: string; show?: string }>;
}

const ADMIN_TOKEN = process.env.ADMIN_SECRET_TOKEN;
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function AdminPage({ searchParams }: Search) {
  const sp = await searchParams;
  const token = sp.token ?? "";
  const showHidden = sp.show === "all";

  if (!ADMIN_TOKEN) {
    return (
      <main className="min-h-screen bg-mesh-light flex flex-col">
        <Header />
        <section className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="max-w-md text-center">
            <ShieldAlert size={48} className="text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-black mb-2">설정이 필요합니다</h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                ADMIN_SECRET_TOKEN
              </code>{" "}
              환경변수를 Amplify에 설정해주세요.
            </p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  if (token !== ADMIN_TOKEN) {
    return (
      <main className="min-h-screen bg-mesh-light flex flex-col">
        <Header />
        <section className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <ShieldAlert size={40} className="text-[#003b8e] mx-auto mb-4" />
              <h1 className="text-xl font-black mb-2">관리자 인증</h1>
              <p className="text-sm text-gray-600">
                URL에 token 파라미터가 필요합니다.
              </p>
            </div>
            <form className="bg-white border border-gray-200 rounded-2xl p-6">
              <label className="block text-sm font-bold mb-2">
                관리자 토큰
              </label>
              <input
                type="password"
                name="token"
                required
                placeholder="ADMIN_SECRET_TOKEN 값을 입력"
                className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm focus:border-[#003b8e] outline-none mb-4"
              />
              <button
                type="submit"
                className="w-full bg-[#003b8e] text-white font-black py-3 rounded-lg hover:bg-[#0a1633] transition"
              >
                접속
              </button>
              <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                URL: <code>/admin?token=XXX</code> 형태로 직접 접속도 가능합니다.
              </p>
            </form>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  // 인증 성공 — 의견 목록 가져오기
  let voices: Awaited<ReturnType<typeof loadVoices>> = [];
  let fetchError: string | null = null;
  try {
    voices = await loadVoices(showHidden);
  } catch (e) {
    fetchError = "목록 조회 실패: " + (e instanceof Error ? e.message : "알 수 없는 오류");
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
              href={`/admin?token=${encodeURIComponent(token)}`}
              className={`text-sm font-bold px-4 py-2 rounded-lg border-2 transition ${
                !showHidden
                  ? "bg-[#003b8e] text-white border-[#003b8e]"
                  : "border-gray-200"
              }`}
            >
              공개만
            </a>
            <a
              href={`/admin?token=${encodeURIComponent(token)}&show=all`}
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
          <AdminPanel voices={voices} token={token} />
        )}
      </section>
      <Footer />
    </main>
  );
}

async function loadVoices(showHidden: boolean) {
  if (!URL || !SERVICE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY 환경변수가 필요합니다 (Amplify에 추가)."
    );
  }
  const supabase = createClient(URL, SERVICE_KEY, {
    auth: { persistSession: false },
  });
  let query = supabase.from("voices").select("*").order("created_at", { ascending: false }).limit(200);
  if (!showHidden) query = query.eq("is_visible", true);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
