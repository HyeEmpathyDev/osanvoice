import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import VoiceForm from "./VoiceForm";

export const metadata = {
  title: "의견 남기기 — 오산의 목소리",
  description: "오산 시민의 목소리를 들려주세요.",
};

export default function NewVoicePage() {
  return (
    <main className="min-h-screen bg-white text-[#0f1a2e]">
      <Header />

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

      <Footer />
    </main>
  );
}
