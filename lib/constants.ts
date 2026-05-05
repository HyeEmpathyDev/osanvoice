// 오산시 8개 행정동 (2026년 기준, 2024.1 분동 반영)
export const DONGS = [
  { id: "jungang", name: "중앙동" },
  { id: "daewon1", name: "대원1동" },
  { id: "daewon2", name: "대원2동" },
  { id: "sinjang1", name: "신장1동" },
  { id: "sinjang2", name: "신장2동" },
  { id: "sema", name: "세마동" },
  { id: "namchon", name: "남촌동" },
  { id: "chopyeong", name: "초평동" },
] as const;

export type DongId = (typeof DONGS)[number]["id"];

// 7대 정책 카테고리
export const CATEGORIES = [
  { key: "transport", name: "교통", emoji: "🚍" },
  { key: "education", name: "교육·돌봄", emoji: "📚" },
  { key: "industry", name: "산업·일자리", emoji: "💼" },
  { key: "safety", name: "안전", emoji: "🚓" },
  { key: "environment", name: "환경", emoji: "🌳" },
  { key: "culture", name: "문화·체육", emoji: "🎨" },
  { key: "admin", name: "행정", emoji: "🏛️" },
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
  contact: "joyongho.kr 캠프",
} as const;
