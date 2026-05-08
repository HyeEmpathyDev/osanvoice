// 오산시 8개 행정동 (2026년 기준, 2024.1 분동 반영)
// lat/lng는 각 행정복지센터 인근 대략값 — 지도 마커용
export const DONGS = [
  { id: "jungang",   name: "중앙동",   short: "중앙",   lat: 37.1497, lng: 127.0775 },
  { id: "daewon1",   name: "대원1동",  short: "대원1",  lat: 37.1378, lng: 127.0712 },
  { id: "daewon2",   name: "대원2동",  short: "대원2",  lat: 37.1437, lng: 127.0625 },
  { id: "sinjang1",  name: "신장1동",  short: "신장1",  lat: 37.1632, lng: 127.0925 },
  { id: "sinjang2",  name: "신장2동",  short: "신장2",  lat: 37.1545, lng: 127.1058 },
  { id: "sema",      name: "세마동",   short: "세마",   lat: 37.1843, lng: 127.0581 },
  { id: "namchon",   name: "남촌동",   short: "남촌",   lat: 37.1395, lng: 127.0882 },
  { id: "chopyeong", name: "초평동",   short: "초평",   lat: 37.1547, lng: 127.0625 },
] as const;

// 오산시 중심 (지도 초기 중심점)
export const OSAN_CENTER = { lat: 37.1525, lng: 127.0775 } as const;

export type DongId = (typeof DONGS)[number]["id"];

// 오산시 법정동 → 행정동 매핑 (사용자 확정).
// admin 필드는 대응되는 행정동 id (DONGS의 id와 매칭).
// 일부 법정동은 두 행정동에 걸쳐있음(원동·고현동) — 폼에선 한 번만 표시.
export const LEGAL_DONGS = [
  // 중앙동
  { name: "오산동",   admin: "jungang"  },
  { name: "부산동",   admin: "jungang"  },
  // 남촌동
  { name: "가장동",   admin: "namchon"  },
  { name: "궐동",     admin: "namchon"  },
  { name: "청학동",   admin: "namchon"  },
  // 대원1동
  { name: "갈곶동",   admin: "daewon1"  },
  { name: "고현동",   admin: "daewon1"  }, // 일부 대원2동에도 걸침
  { name: "원동",     admin: "daewon1"  }, // 일부 대원2동에도 걸침
  // 대원2동
  { name: "청호동",   admin: "daewon2"  },
  // 세마동
  { name: "서랑동",   admin: "sema"     },
  { name: "양산동",   admin: "sema"     },
  { name: "지곶동",   admin: "sema"     },
  { name: "세교동",   admin: "sema"     },
  { name: "외삼미동", admin: "sema"     },
  // 초평동
  { name: "서동",     admin: "chopyeong"},
  { name: "가수동",   admin: "chopyeong"},
  { name: "벌음동",   admin: "chopyeong"},
  { name: "탑동",     admin: "chopyeong"},
  { name: "두곡동",   admin: "chopyeong"},
  { name: "누읍동",   admin: "chopyeong"},
  // 신장1동
  { name: "금암동",   admin: "sinjang1" },
  { name: "수청동",   admin: "sinjang1" },
  // 신장2동
  { name: "내삼미동", admin: "sinjang2" },
  { name: "은계동",   admin: "sinjang2" },
] as const;

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

// 캠프 SNS 바로가기 (캠프 공식 채널)
export const CAMP_LINKS = {
  campaign: "https://www.xn--oo5bn6ap0x.kr",
  facebook: "https://www.facebook.com/profile.php?id=100079506165317",
  instagram: "https://www.instagram.com/joyho645/",
  youtube: "https://www.youtube.com/@%EC%A1%B0%EC%9A%A9%ED%98%B8TV",
  tiktok: "https://www.tiktok.com/@joyho645",
} as const;
