import Link from "next/link";
import VoiceForm from "./VoiceForm";

export const metadata = {
  title: "의견 남기기 — 오산의 목소리",
  description: "오산 시민의 목소리를 들려주세요.",
};

export default function NewVoicePage() {
  return (
    <main className="min-h-screen bg-white text-[#0f1a2e]">
      {/* 헤더 */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-black text-[#003b8e]">
            오산의 목소리
          </Link>
          <Link
            href="/voices"
            className="text-sm font-bold text-gray-600 hover:text-[#003b8e]"
          >
            ← 시민의견 보기
          </Link>
        </div>
      </header>

      {/* 본문 */}
      <section className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-10">
          <p className="text-sm font-bold tracking-widest text-[#003b8e] mb-3">
            VOICE OF OSAN
          </p>
          <h1 className="text-2xl md:text-3xl font-black mb-3">
            의견을 들려주세요
          </h1>
          <p className="text-gray-600 leading-relaxed">
            우리 동네 이야기, 정책 제안 — 시민의 한 마디가 오산의 변화를 만듭니다.
          </p>
        </div>

        <VoiceForm />
      </section>
    </main>
  );
}
