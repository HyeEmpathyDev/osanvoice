-- voices.legal_dong 컬럼 추가 — 시민이 폼에서 선택한 법정동 이름 저장.
-- dong 컬럼(행정동 id)은 유지. legal_dong이 있으면 매핑 변경 시 재분류 가능.
-- Supabase 대시보드 → SQL Editor에서 실행.

alter table public.voices
  add column if not exists legal_dong text;

create index if not exists voices_legal_dong_idx
  on public.voices (legal_dong)
  where legal_dong is not null;

comment on column public.voices.legal_dong is
  '시민이 폼에서 선택한 법정동 이름 (예: 갈곶동, 청학동). dong 컬럼은 행정동 id.';
