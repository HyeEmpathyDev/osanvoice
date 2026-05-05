import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Home, MessageSquarePlus } from "lucide-react";

export const metadata = {
  title: "페이지를 찾을 수 없습니다 — 오산의 목소리",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-mesh-light text-[#0a0e1a] flex flex-col">
      <Header />

      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-xl w-full text-center">
          <div className="mb-8">
            <div className="text-[120px] md:text-[180px] font-black text-[#003b8e]/10 leading-none tracking-tight tabular">
              404
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-black mb-4 tracking-tight">
            페이지를 찾을 수 없습니다
          </h1>
          <p className="text-gray-600 leading-relaxed mb-10">
            요청하신 페이지가 사라졌거나 잘못된 주소입니다.<br />
            메인 화면에서 시민의견을 살펴보세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-[#003b8e] text-white font-black px-7 py-3.5 rounded-xl text-sm hover:bg-[#0a1633] transition shadow-lg shadow-[#003b8e]/20"
            >
              <Home size={16} />
              메인으로
            </Link>
            <Link
              href="/voices/new"
              className="inline-flex items-center justify-center gap-2 border border-gray-300 bg-white text-[#003b8e] font-bold px-7 py-3.5 rounded-xl text-sm hover:bg-gray-50 transition"
            >
              <MessageSquarePlus size={16} />
              의견 남기기
            </Link>
            <Link
              href="/voices"
              className="inline-flex items-center justify-center gap-2 text-gray-700 font-bold px-7 py-3.5 rounded-xl text-sm hover:text-[#003b8e] transition"
            >
              <ArrowLeft size={16} />
              시민의견 보기
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
