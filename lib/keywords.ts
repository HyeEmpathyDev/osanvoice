// 한글 의견에서 의미있는 키워드 추출 — 단순 휴리스틱
// (정밀 형태소 분석은 비용·복잡도 부담이 커서 사용 안 함)

const STOPWORDS = new Set([
  "그리고", "그러나", "하지만", "그래서", "또한", "또는", "이런", "그런", "저런",
  "하나", "둘셋", "이것", "그것", "저것", "여기", "거기", "저기", "지금", "이번",
  "정말", "진짜", "너무", "조금", "많이", "매우", "아주", "특히", "이미",
  "그리고", "하지만", "그래도", "그래서", "정도", "동안", "때문", "위해", "통해",
  "관련", "대한", "있는", "없는", "있어", "없어", "되는", "되어", "되고",
  "합니다", "있습니다", "없습니다", "됩니다", "이다", "있다", "없다", "되다",
  "오산", "오산시", "오산의", "시민", "시민이", "시민들", "있는데", "있고",
  "이렇게", "그렇게", "저렇게",
]);

export function extractKeywords(
  contents: string[],
  topN: number = 30
): Array<{ text: string; count: number }> {
  const counts = new Map<string, number>();

  for (const c of contents) {
    if (!c) continue;
    // 한글/영문 단어 토큰화 (조사·어미 일부 흡수)
    const tokens = c.match(/[가-힣]{2,}|[A-Za-z]{3,}/g) ?? [];
    for (const raw of tokens) {
      // 한글 단어는 마지막 1글자가 조사일 가능성이 높아 휴리스틱으로 제거 시도
      let w = raw;
      if (/[가-힣]/.test(w) && w.length >= 4) {
        const last = w.slice(-1);
        if ("의을를이가은는도와과에서로으".includes(last)) {
          w = w.slice(0, -1);
        }
      }
      if (w.length < 2) continue;
      if (STOPWORDS.has(w)) continue;
      counts.set(w, (counts.get(w) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .filter(([, n]) => n >= 2) // 2회 이상 언급된 것만
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([text, count]) => ({ text, count }));
}

export function buildDailySeries(
  createdAts: string[],
  days: number = 14
): Array<{ label: string; value: number }> {
  const now = new Date();
  const startMs = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - (days - 1)
  ).getTime();

  const buckets = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(startMs + i * 86400000);
    const key = `${d.getMonth() + 1}/${d.getDate()}`;
    buckets.set(key, 0);
  }

  for (const ts of createdAts) {
    const d = new Date(ts);
    if (d.getTime() < startMs) continue;
    const key = `${d.getMonth() + 1}/${d.getDate()}`;
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return [...buckets.entries()].map(([label, value]) => ({ label, value }));
}
