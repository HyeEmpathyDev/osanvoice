-- voices.ip 컬럼 추가 — 제출 시 클라이언트 IP 저장 (admin 전용 검증용).
-- Supabase 대시보드 → SQL Editor에서 실행.

alter table public.voices
  add column if not exists ip text;

create index if not exists voices_ip_idx on public.voices (ip);

comment on column public.voices.ip is
  '제출 시 클라이언트 IP. admin 전용 노출(어뷰즈 검증). 시민 페이지에는 절대 노출 금지.';
