import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShieldAlert } from "lucide-react";
import { signIn } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "관리자 로그인 — 오산의 목소리",
  robots: { index: false, follow: false },
};

interface SP {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLoginPage({ searchParams }: SP) {
  const { error } = await searchParams;
  const adminTokenSet = Boolean(process.env.ADMIN_SECRET_TOKEN);

  return (
    <main className="min-h-screen bg-mesh-light flex flex-col">
      <Header />
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <ShieldAlert size={40} className="text-[#003b8e] mx-auto mb-4" />
            <h1 className="text-xl font-black mb-2">관리자 인증</h1>
            <p className="text-sm text-gray-600">관리자 토큰을 입력하세요.</p>
          </div>
          {!adminTokenSet ? (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-sm text-red-700">
              <code className="bg-white px-2 py-0.5 rounded text-xs">
                ADMIN_SECRET_TOKEN
              </code>{" "}
              환경변수가 설정되지 않았습니다. Amplify Console에서 추가해주세요.
            </div>
          ) : (
            <form
              action={signIn}
              className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-bold mb-2">
                  관리자 토큰
                </label>
                <input
                  type="password"
                  name="token"
                  required
                  autoComplete="current-password"
                  placeholder="ADMIN_SECRET_TOKEN 값"
                  className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm focus:border-[#003b8e] outline-none"
                />
              </div>
              {error === "invalid" && (
                <div className="text-sm text-red-600 font-bold">
                  토큰이 일치하지 않습니다.
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-[#003b8e] text-white font-black py-3 rounded-lg hover:bg-[#0a1633] transition"
              >
                접속
              </button>
              <p className="text-xs text-gray-500 leading-relaxed">
                인증 성공 시 7일간 유효한 세션 쿠키(HttpOnly·Secure·SameSite=Strict)가
                발급됩니다.
              </p>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
