"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminToken = process.env.ADMIN_SECRET_TOKEN;

function adminClient() {
  if (!url || !serviceKey) {
    throw new Error(
      "관리자 작업에는 SUPABASE_SERVICE_ROLE_KEY 환경변수가 필요합니다."
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

function checkToken(token: string): boolean {
  if (!adminToken) return false;
  return token === adminToken;
}

export async function toggleVisibility(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const id = String(formData.get("id") ?? "");
  const next = formData.get("next") === "true";

  if (!checkToken(token)) {
    return { ok: false, error: "권한이 없습니다." };
  }
  if (!id) return { ok: false, error: "id가 없습니다." };

  try {
    const supabase = adminClient();
    const { error } = await supabase
      .from("voices")
      .update({ is_visible: next })
      .eq("id", id);
    if (error) {
      console.error("[toggleVisibility]", error);
      return { ok: false, error: "처리 중 오류가 발생했습니다." };
    }
    revalidatePath("/admin");
    revalidatePath("/voices");
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    console.error("[toggleVisibility] exception:", e);
    return { ok: false, error: "서버 오류" };
  }
}

export async function deleteVoice(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const id = String(formData.get("id") ?? "");

  if (!checkToken(token)) {
    return { ok: false, error: "권한이 없습니다." };
  }
  if (!id) return { ok: false, error: "id가 없습니다." };

  try {
    const supabase = adminClient();
    const { error } = await supabase.from("voices").delete().eq("id", id);
    if (error) {
      console.error("[deleteVoice]", error);
      return { ok: false, error: "삭제 중 오류" };
    }
    revalidatePath("/admin");
    revalidatePath("/voices");
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    console.error("[deleteVoice] exception:", e);
    return { ok: false, error: "서버 오류" };
  }
}
