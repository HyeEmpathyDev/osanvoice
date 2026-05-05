import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Phase 2 이후 활성화. 현재는 환경변수가 없어도 빌드가 깨지지 않도록 처리.
export const supabase =
  url && anonKey
    ? createClient(url, anonKey)
    : null;

export const isSupabaseConfigured = Boolean(url && anonKey);
