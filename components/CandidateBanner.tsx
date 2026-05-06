import Link from "next/link";
import Image from "next/image";

export function CandidateBanner() {
  return (
    <div className="w-full bg-white border-b border-gray-100">
      <Link
        href="/"
        aria-label="기호 1번 조용호 — 진정한 변화! 당당한 오산!"
        className="block max-w-5xl mx-auto px-4 py-2 md:py-3"
      >
        <Image
          src="/joyongho-banner.png"
          alt="기호 1번 조용호 — 진정한 변화! 당당한 오산!"
          width={830}
          height={300}
          priority
          className="w-full h-auto max-h-32 md:max-h-40 object-contain object-center"
        />
      </Link>
    </div>
  );
}
