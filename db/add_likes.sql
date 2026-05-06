-- voices.like_count 컬럼 + 원자적 증가 RPC
-- Supabase 대시보드 → SQL Editor에서 실행

alter table public.voices
  add column if not exists like_count integer not null default 0;

create index if not exists voices_like_count_idx
  on public.voices (like_count desc, created_at desc)
  where is_visible = true;

create or replace function public.increment_voice_like(p_voice_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count integer;
begin
  update public.voices
     set like_count = like_count + 1
   where id = p_voice_id and is_visible = true
   returning like_count into new_count;

  if new_count is null then
     raise exception 'voice not found or hidden';
  end if;

  return new_count;
end;
$$;

revoke execute on function public.increment_voice_like(uuid) from public;
grant execute on function public.increment_voice_like(uuid) to anon, authenticated;
