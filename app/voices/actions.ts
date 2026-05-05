"use server";

import { revalidatePath } from "next/cache";
import { getSupabase } from "@/lib/supabase";
import { DONGS, CATEGORIES, AGE_GROUPS } from "@/lib/constants";

const VALID_DONGS = DONGS.map((d) => d.id);
const VALID_CATEGORIES = CATEGORIES.map((c) => c.key);
const VALID_AGE_GROUPS = [...AGE_GROUPS];
const VALID_GENDERS = ["m", "f"] as const;

export type SubmitResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function submitVoice(formData: FormData): Promise<SubmitResult> {
  const dong = String(formData.get("dong") ?? "");
  const category = String(formData.get("category") ?? "");
  const content = String(formData.get("content") ?? "").trim();
  const ageRaw = String(formData.get("age_group") ?? "");
  const genderRaw = String(formData.get("gender") ?? "");

  if (!VALID_DONGS.includes(dong as (typeof VALID_DONGS)[number])) {
    return { ok: false, error: "행정동을 선택해주세요." };
  }
  if (!VALID_CATEGORIES.includes(category as (typeof VALID_CATEGORIES)[number])) {
    return { ok: false, error: "카테고리를 선택해주세요." };
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

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("voices")
      .insert({
        dong,
        category,
        content,
        age_group: ageGroup,
        gender,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[submitVoice] insert error:", error);
      return { ok: false, error: "저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
    }

    revalidatePath("/voices");
    revalidatePath("/");
    return { ok: true, id: data!.id };
  } catch (e) {
    console.error("[submitVoice] exception:", e);
    return { ok: false, error: "서버 연결 오류입니다." };
  }
}
