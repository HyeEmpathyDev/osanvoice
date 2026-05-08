"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getSupabase, getAdminSupabase } from "@/lib/supabase";
import { CATEGORIES, AGE_GROUPS, LEGAL_DONGS } from "@/lib/constants";
import { isUuid } from "@/lib/validation";
import { notifyNewVoice } from "@/lib/notify";

const VALID_CATEGORIES = CATEGORIES.map((c) => c.key);
const VALID_AGE_GROUPS = [...AGE_GROUPS];
const VALID_GENDERS = ["m", "f"] as const;

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type SubmitResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) return true; // 키 미설정 시 검증 패스 (placeholder 단계)
  if (!token) return false;
  try {
    const formData = new URLSearchParams();
    formData.append("secret", TURNSTILE_SECRET);
    formData.append("response", token);
    formData.append("remoteip", ip);
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body: formData,
    });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch (e) {
    console.error("[turnstile] verify error:", e);
    return false;
  }
}

export async function submitVoice(formData: FormData): Promise<SubmitResult> {
  // 0. 헤더 추출 (IP 등)
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown";

  // 1. Honeypot — 봇이 자동 채우는 숨겨진 필드
  const honeypot = String(formData.get("website") ?? "");
  if (honeypot) {
    console.warn("[submitVoice] honeypot triggered:", { ip });
    // 봇에게는 성공한 것처럼 응답 (시간 낭비)
    return { ok: true, id: "blocked" };
  }

  // 2. 제출 시간 체크 — 폼 로드 후 3초 미만이면 봇 의심
  const formStart = Number(formData.get("__formStart") ?? "0");
  if (formStart > 0 && Date.now() - formStart < 3000) {
    return { ok: false, error: "너무 빠른 제출입니다. 잠시 후 다시 시도해주세요." };
  }

  // 3. Turnstile 검증 (키 설정 시)
  const turnstileToken = String(formData.get("cf-turnstile-response") ?? "");
  const turnstileOk = await verifyTurnstile(turnstileToken, ip);
  if (!turnstileOk) {
    return { ok: false, error: "보안 검증에 실패했습니다. 새로고침 후 다시 시도해주세요." };
  }

  // 4. 입력 검증 — 법정동 이름을 받아 행정동 id로 매핑
  const legalDong = String(formData.get("legal_dong") ?? "");
  const category = String(formData.get("category") ?? "");
  const content = String(formData.get("content") ?? "").trim();
  const ageRaw = String(formData.get("age_group") ?? "");
  const genderRaw = String(formData.get("gender") ?? "");

  const legalMatch = LEGAL_DONGS.find((l) => l.name === legalDong);
  if (!legalMatch) {
    return { ok: false, error: "법정동을 선택해주세요." };
  }
  const dong = legalMatch.admin;
  if (!VALID_CATEGORIES.includes(category as (typeof VALID_CATEGORIES)[number])) {
    return { ok: false, error: "분야를 선택해주세요." };
  }
  if (content.length < 5) {
    return { ok: false, error: "의견은 최소 5자 이상 입력해주세요." };
  }
  if (content.length > 500) {
    return { ok: false, error: "의견은 최대 500자까지 가능합니다." };
  }

  const ageGroup = VALID_AGE_GROUPS.includes(
    ageRaw as (typeof VALID_AGE_GROUPS)[number]
  )
    ? ageRaw
    : null;
  const gender = VALID_GENDERS.includes(
    genderRaw as (typeof VALID_GENDERS)[number]
  )
    ? genderRaw
    : null;

  // 5. 인서트 (service role 키로 RLS 우회 — amplify.yml에서 .env.production 굽기)
  try {
    const supabase = getAdminSupabase();

    // 동일 콘텐츠 중복 제출 차단 (5분 내)
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: dups } = await supabase
      .from("voices")
      .select("id")
      .eq("content", content)
      .gte("created_at", fiveMinAgo)
      .limit(1);
    if (dups && dups.length > 0) {
      return { ok: false, error: "이미 동일한 의견이 등록됐습니다." };
    }

    // 사전 모더레이션: 신규 의견은 비공개로 들어가고 운영진 검토 후 공개.
    // 텔레그램 알림 받은 운영자가 /admin에서 '공개' 버튼 누르면 노출됨.
    const { data, error } = await supabase
      .from("voices")
      .insert({
        dong,
        legal_dong: legalDong,
        category,
        content,
        age_group: ageGroup,
        gender,
        is_visible: false,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[submitVoice] insert error:", error);
      return { ok: false, error: "저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
    }

    // 텔레그램 알림 (실패해도 응답을 막지 않음)
    await notifyNewVoice({
      id: data!.id,
      dong,
      legalDong,
      category,
      content,
      ageGroup,
      gender,
    });

    revalidatePath("/voices");
    revalidatePath("/");
    revalidatePath("/stats");
    revalidatePath("/map");
    return { ok: true, id: data!.id };
  } catch (e) {
    console.error("[submitVoice] exception:", e);
    return { ok: false, error: "서버 연결 오류입니다." };
  }
}

export type LikeResult =
  | { ok: true; count: number }
  | { ok: false; error: string };

export async function likeVoice(voiceId: string): Promise<LikeResult> {
  if (!isUuid(voiceId)) {
    return { ok: false, error: "잘못된 요청입니다." };
  }
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.rpc("increment_voice_like", {
      p_voice_id: voiceId,
    });
    if (error) {
      console.error("[likeVoice] rpc error:", error);
      return { ok: false, error: "처리 중 오류가 발생했습니다." };
    }
    revalidatePath("/voices");
    revalidatePath("/");
    return { ok: true, count: Number(data) };
  } catch (e) {
    console.error("[likeVoice] exception:", e);
    return { ok: false, error: "서버 연결 오류입니다." };
  }
}

export async function unlikeVoice(voiceId: string): Promise<LikeResult> {
  if (!isUuid(voiceId)) {
    return { ok: false, error: "잘못된 요청입니다." };
  }
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.rpc("decrement_voice_like", {
      p_voice_id: voiceId,
    });
    if (error) {
      console.error("[unlikeVoice] rpc error:", error);
      return { ok: false, error: "처리 중 오류가 발생했습니다." };
    }
    revalidatePath("/voices");
    revalidatePath("/");
    return { ok: true, count: Number(data) };
  } catch (e) {
    console.error("[unlikeVoice] exception:", e);
    return { ok: false, error: "서버 연결 오류입니다." };
  }
}
