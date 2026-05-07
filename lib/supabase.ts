import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

let _client: SupabaseClient | null = null;
let _adminClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error(
      "Supabase 환경변수(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)가 설정되지 않았습니다."
    );
  }
  if (!_client) {
    _client = createClient(url, anonKey, {
      auth: { persistSession: false },
    });
  }
  return _client;
}

// 서버 액션 전용. service role 키로 RLS 우회한다.
// 클라이언트 코드에서 절대 import 하지 말 것.
export function getAdminSupabase(): SupabaseClient {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY 환경변수가 설정되지 않았습니다."
    );
  }
  if (!_adminClient) {
    _adminClient = createClient(url, serviceKey, {
      auth: { persistSession: false },
    });
  }
  return _adminClient;
}
