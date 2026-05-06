import Link from "next/link";
import Image from "next/image";

export function CandidateBanner() {
  return (
    <div className="w-full bg-white border-b border-gray-100">
      <Link
        href="/"
        aria-label="기호 1번 조용호 — 진정한 변화! 당당한 오산!"
        className="inline-block px-4 py-2 md:py-3"
      >
        <Image
          src="/joyongho-banner.png"
          alt="기호 1번 조용호 — 진정한 변화! 당당한 오산!"
          width={830}
          height={300}
          priority
          className="w-auto h-24 md:h-32 object-contain object-left"
        />
      </Link>
    </div>
  );
}
