"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { isUuid } from "@/lib/validation";
import { DONGS } from "@/lib/constants";

const VALID_DONG_IDS = DONGS.map((d) => d.id) as readonly string[];

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminToken = process.env.ADMIN_SECRET_TOKEN;
const COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7일

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

async function isAuthed(): Promise<boolean> {
  if (!adminToken) return false;
  const c = await cookies();
  const v = c.get(COOKIE_NAME)?.value;
  return Boolean(v) && v === adminToken;
}

function revalidateAll() {
  revalidatePath("/admin");
  revalidatePath("/voices");
  revalidatePath("/");
  revalidatePath("/stats");
  revalidatePath("/map");
}

export async function signIn(formData: FormData) {
  const submitted = String(formData.get("token") ?? "");
  if (!adminToken || submitted !== adminToken) {
    redirect("/admin/login?error=invalid");
  }
  const c = await cookies();
  c.set(COOKIE_NAME, adminToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin");
}

export async function signOut() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
  redirect("/admin/login");
}

export async function toggleVisibility(formData: FormData) {
  if (!(await isAuthed())) return { ok: false, error: "권한이 없습니다." };
  const id = String(formData.get("id") ?? "");
  const next = formData.get("next") === "true";
  if (!isUuid(id)) return { ok: false, error: "잘못된 id입니다." };

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
    revalidateAll();
    return { ok: true };
  } catch (e) {
    console.error("[toggleVisibility] exception:", e);
    return { ok: false, error: "서버 오류" };
  }
}

export async function reassignDong(formData: FormData) {
  if (!(await isAuthed())) return { ok: false, error: "권한이 없습니다." };
  const id = String(formData.get("id") ?? "");
  const dong = String(formData.get("dong") ?? "");
  if (!isUuid(id)) return { ok: false, error: "잘못된 id입니다." };
  if (!VALID_DONG_IDS.includes(dong)) {
    return { ok: false, error: "잘못된 행정동입니다." };
  }
  try {
    const supabase = adminClient();
    const { error } = await supabase
      .from("voices")
      .update({ dong })
      .eq("id", id);
    if (error) {
      console.error("[reassignDong]", error);
      return { ok: false, error: "처리 중 오류가 발생했습니다." };
    }
    revalidateAll();
    return { ok: true };
  } catch (e) {
    console.error("[reassignDong] exception:", e);
    return { ok: false, error: "서버 오류" };
  }
}

export async function deleteVoice(formData: FormData) {
  if (!(await isAuthed())) return { ok: false, error: "권한이 없습니다." };
  const id = String(formData.get("id") ?? "");
  if (!isUuid(id)) return { ok: false, error: "잘못된 id입니다." };

  try {
    const supabase = adminClient();
    const { error } = await supabase.from("voices").delete().eq("id", id);
    if (error) {
      console.error("[deleteVoice]", error);
      return { ok: false, error: "삭제 중 오류" };
    }
    revalidateAll();
    return { ok: true };
  } catch (e) {
    console.error("[deleteVoice] exception:", e);
    return { ok: false, error: "서버 오류" };
  }
}
