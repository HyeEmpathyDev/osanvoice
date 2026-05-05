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

// 의견 분야 (시민이 의견 분류용 9개 카테고리)
export const CATEGORIES = [
  { key: "industry", name: "산업·일자리", emoji: "💼", desc: "지역 산업·청년 일자리·창업" },
  { key: "transport", name: "교통", emoji: "🚍", desc: "출퇴근·광역철도·시내버스" },
  { key: "education", name: "교육·돌봄", emoji: "📚", desc: "보육·학교·평생학습" },
  { key: "family", name: "청년가정", emoji: "👨‍👩‍👧", desc: "신혼부부·영유아·정주환경" },
  { key: "welfare", name: "생애주기복지", emoji: "❤️", desc: "청년·중년·어르신 돌봄" },
  { key: "culture", name: "문화·체육", emoji: "🎨", desc: "여가·체육시설·관광" },
  { key: "admin", name: "행정혁신", emoji: "🏛️", desc: "민원·참여·소통" },
  { key: "inclusion", name: "포용·다문화", emoji: "🤝", desc: "장애인·다문화·사회적 약자" },
  { key: "safety_environment", name: "안전·환경", emoji: "🌳", desc: "치안·재난·미세먼지·녹색" },
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
