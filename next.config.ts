import type { NextConfig } from "next";

// Content Security Policy — 외부 리소스 출처 화이트리스트
const csp = [
  "default-src 'self'",
  // 스크립트: Next.js 인라인 + Cloudflare Turnstile + 네이버 지도
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://oapi.map.naver.com https://openapi.map.naver.com https://*.pstatic.net https://*.naver.net https://*.naver.com",
  // 스타일: 인라인 + Pretendard CDN + 네이버 지도
  "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://*.pstatic.net",
  // 폰트: Pretendard CDN
  "font-src 'self' data: https://cdn.jsdelivr.net",
  // 이미지: data·blob·Supabase·네이버 지도 타일
  "img-src 'self' data: blob: https://*.supabase.co https://*.pstatic.net https://*.naver.net https://*.naver.com",
  // 연결: Supabase API + 네이버 지도 + Turnstile
  "connect-src 'self' https://*.supabase.co https://challenges.cloudflare.com https://*.naver.com https://*.naver.net https://*.pstatic.net",
  // 프레임: Turnstile 위젯
  "frame-src https://challenges.cloudflare.com",
  // iframe 임베드 차단
  "frame-ancestors 'none'",
  // 객체 차단
  "object-src 'none'",
  // base URI
  "base-uri 'self'",
  // form 제출 자기 자신만
  "form-action 'self'",
  // HTTPS 강제
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
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
