import type { NextConfig } from "next";

const securityHeaders = [
  // 클릭재킹 방어 — 다른 사이트가 iframe으로 우리 페이지를 감싸지 못하게
  { key: "X-Frame-Options", value: "DENY" },
  // MIME 타입 스니핑 차단
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Referer 정보 최소화
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // 카메라/마이크/위치정보 등 민감 권한 차단 (사이트가 요구하지 않음)
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()",
  },
  // HSTS — HTTPS 강제 (Amplify가 이미 적용하지만 명시적으로)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // XSS 보호 (구형 브라우저용)
  { key: "X-XSS-Protection", value: "1; mode=block" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      { source: "/promises", destination: "/", permanent: false },
      { source: "/promises/:path*", destination: "/", permanent: false },
      { source: "/about", destination: "/", permanent: false },
      { source: "/library", destination: "/", permanent: false },
      { source: "/library/:path*", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
