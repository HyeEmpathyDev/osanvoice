import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SocialSidebar } from "@/components/SocialSidebar";
import { CandidateBanner } from "@/components/CandidateBanner";

export const metadata: Metadata = {
  metadataBase: new URL("https://osanvoice.xn--oo5bn6ap0x.kr"),
  title: "오산의 목소리 — 시민이 만드는 당당한 오산",
  description: "오산의 변화와 미래를 위해 시민의 목소리를 듣습니다.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    title: "오산의 목소리",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "오산의 목소리",
    description: "오산의 변화와 미래를 위해 시민의 목소리를 듣습니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "오산의 목소리",
  },
  twitter: {
    card: "summary_large_image",
    title: "오산의 목소리",
    description: "오산의 변화와 미래를 위해 시민의 목소리를 듣습니다.",
  },
};

export const viewport: Viewport = {
  themeColor: "#003b8e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "'Pretendard', -apple-system, sans-serif" }}
      >
        <CandidateBanner />
        {children}
        <SocialSidebar />
      </body>
    </html>
  );
}
