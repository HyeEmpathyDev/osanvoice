import { DONGS, CATEGORIES, SITE } from "./constants";

const dongMap = Object.fromEntries(DONGS.map((d) => [d.id, d.name]));
const catMap = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, { name: c.name, emoji: c.emoji }])
);

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

interface NewVoiceParams {
  id: string;
  dong: string;
  legalDong?: string;
  category: string;
  content: string;
  ageGroup: string | null;
  gender: string | null;
}

// 새 의견이 등록되면 텔레그램으로 알림.
// 실패해도 사용자 요청을 막지 않도록 모든 예외는 자체 처리한다.
export async function notifyNewVoice(p: NewVoiceParams): Promise<void> {
  const token = process.env.TELEGRAM_IDEA_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_OWNER_ID;
  if (!token || !chatId) return;

  const dongName = dongMap[p.dong] ?? p.dong;
  const dongLabel = p.legalDong
    ? `${p.legalDong} (${dongName})`
    : dongName;
  const cat = catMap[p.category];
  const catLabel = cat ? `${cat.emoji} ${cat.name}` : p.category;
  const profile = [
    p.ageGroup,
    p.gender === "m" ? "남" : p.gender === "f" ? "여" : null,
  ]
    .filter(Boolean)
    .join(" ");

  const snippet =
    p.content.length > 280 ? p.content.slice(0, 280) + "…" : p.content;

  const lines = [
    "🆕 <b>새 의견 — 공개 승인 필요</b>",
    "",
    `📍 ${escapeHtml(dongName)} · ${escapeHtml(catLabel)}`,
    profile ? `👤 ${escapeHtml(profile)}` : null,
    `🆔 <code>${escapeHtml(p.id.slice(0, 8))}</code>`,
    "",
    escapeHtml(snippet),
    "",
    `🔗 ${SITE.url}/admin?show=all → '공개' 버튼 클릭`,
  ].filter(Boolean) as string[];

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: lines.join("\n"),
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(3000),
      }
    );
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[notifyNewVoice] telegram error:", res.status, body);
    }
  } catch (e) {
    console.error("[notifyNewVoice] exception:", e);
  }
}
