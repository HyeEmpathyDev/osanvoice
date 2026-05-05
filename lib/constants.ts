// 오산시 8개 행정동 (2026년 기준, 2024.1 분동 반영)
export const DONGS = [
  { id: "jungang", name: "중앙동", short: "중앙" },
  { id: "daewon1", name: "대원1동", short: "대원1" },
  { id: "daewon2", name: "대원2동", short: "대원2" },
  { id: "sinjang1", name: "신장1동", short: "신장1" },
  { id: "sinjang2", name: "신장2동", short: "신장2" },
  { id: "sema", name: "세마동", short: "세마" },
  { id: "namchon", name: "남촌동", short: "남촌" },
  { id: "chopyeong", name: "초평동", short: "초평" },
] as const;

export type DongId = (typeof DONGS)[number]["id"];

// 9대 정책 카테고리 (정책자료 v2 기준 — 2026.05.02 갱신)
export const CATEGORIES = [
  { key: "industry", name: "산업·일자리", emoji: "💼", desc: "K-AI시티·반도체·일자리" },
  { key: "transport", name: "교통", emoji: "🚍", desc: "GTX·분당선·광역버스" },
  { key: "education", name: "교육·돌봄", emoji: "📚", desc: "24시 돌봄·미래교육·산후조리" },
  { key: "family", name: "청년가정", emoji: "👨‍👩‍👧", desc: "키즈카페·이동지원·정주환경" },
  { key: "welfare", name: "생애주기복지", emoji: "❤️", desc: "청년·중년·어르신 통합돌봄" },
  { key: "culture", name: "문화·체육", emoji: "🎨", desc: "오산천·스포츠타운·관광" },
  { key: "admin", name: "행정혁신", emoji: "🏛️", desc: "참여예산·AI 행정·소통" },
  { key: "inclusion", name: "포용·다문화", emoji: "🤝", desc: "장애인·다문화·사회적 약자" },
  { key: "safety_environment", name: "안전·환경", emoji: "🌳", desc: "녹색도시·재난·미세먼지" },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];

// 연령대 (시민 의견 작성용)
export const AGE_GROUPS = [
  "10대",
  "20대",
  "30대",
  "40대",
  "50대",
  "60대",
  "70대 이상",
] as const;

// 사이트 메타
export const SITE = {
  name: "오산의 목소리",
  tagline: "오산의 변화와 미래를 위해 시민의 목소리를 듣습니다.",
  subTagline: "시민이 만드는 당당한 오산",
  url: "https://osanvoice.xn--oo5bn6ap0x.kr",
  contactEmail: "its.warm.rion@gmail.com",
  contactLabel: "오산의 목소리 운영팀",
} as const;
