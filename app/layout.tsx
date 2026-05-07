import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SocialSidebar } from "@/components/SocialSidebar";

export const metadata: Metadata = {
  metadataBase: new URL("https://osanvoice.xn--oo5bn6ap0x.kr"),
  title: "오산의 목소리",
  description: "오산의 변화와 미래를 위해 시민의 목소리를 듣겠습니다.",
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
    description: "오산의 변화와 미래를 위해 시민의 목소리를 듣겠습니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "오산의 목소리",
    url: "https://osanvoice.xn--oo5bn6ap0x.kr",
    images: [
      {
        url: "/og-thumb.jpg",
        width: 1200,
        height: 607,
        alt: "오산시장 후보 기호 1번 조용호 — 진정한 변화, 당당한 오산",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "오산의 목소리",
    description: "오산의 변화와 미래를 위해 시민의 목소리를 듣겠습니다.",
    images: ["/og-thumb.jpg"],
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
        {children}
        <SocialSidebar />
      </body>
    </html>
  );
}
