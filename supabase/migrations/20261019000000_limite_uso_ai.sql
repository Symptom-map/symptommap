-- ─────────────────────────────────────────────────────────────
-- AI usage limit (cost brake)
--
-- The AI (Claude on Bedrock) is billed per use. So that a bug or a person
-- asking for suggestions non-stop cannot run up a large bill,
-- api/claude.js calls consumir_cuota_ai() BEFORE every Bedrock request.
-- If it returns false, the AI answers 429 and Bedrock is not called.
--
-- Limits (change them here with a new migration):
--   - per person: 15 requests per hour and 40 per 24 hours;
--   - in total, across everyone: 500 requests per 24 hours
--     (≈ US$10–12 in the worst case, with 1500-token answers).
--
-- What is stored: only HOW MANY requests each person made in each hour.
-- Never the text sent or the answer (DATA-MAP §5: "content-free metadata
-- only"). Rows older than 2 days are deleted inside the same function:
-- there are no scheduled jobs (nothing runs on its own).
-- Deleting the account deletes its rows (on delete cascade).
-- ─────────────────────────────────────────────────────────────

create table public.uso_ai (
  user_id uuid not null references auth.users (id) on delete cascade,
  hora timestamptz not null,
  pedidos integer not null default 0 check (pedidos >= 0),
  primary key (user_id, hora)
);

comment on table public.uso_ai is
  'How many AI requests each person made per hour (no content). Only used to limit cost; deleted after 2 days.';

create index uso_ai_hora on public.uso_ai (hora);

-- Nobody reads or changes it directly: only through the function.
alter table public.uso_ai enable row level security;
revoke all on public.uso_ai from anon, authenticated;

create function public.consumir_cuota_ai()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  yo constant uuid := auth.uid();
  esta_hora constant timestamptz := date_trunc('hour', now());
  por_hora constant integer := 15;
  por_dia constant integer := 40;
  total_dia constant integer := 500;
begin
  if yo is null then
    return false;
  end if;

  -- One request at a time, so two simultaneous requests cannot pass the limit.
  perform pg_advisory_xact_lock(hashtext('consumir_cuota_ai'));

  delete from public.uso_ai where hora < now() - interval '2 days';

  if coalesce((select pedidos from public.uso_ai where user_id = yo and hora = esta_hora), 0) >= por_hora
     or coalesce((select sum(pedidos) from public.uso_ai where user_id = yo and hora > now() - interval '24 hours'), 0) >= por_dia
     or coalesce((select sum(pedidos) from public.uso_ai where hora > now() - interval '24 hours'), 0) >= total_dia
  then
    return false;
  end if;

  insert into public.uso_ai (user_id, hora, pedidos)
  values (yo, esta_hora, 1)
  on conflict (user_id, hora) do update set pedidos = public.uso_ai.pedidos + 1;

  return true;
end;
$$;

comment on function public.consumir_cuota_ai() is
  'Counts one AI request for the signed-in person. Returns false if over the limit (per hour, per day or in total).';

revoke all on function public.consumir_cuota_ai() from public, anon;
grant execute on function public.consumir_cuota_ai() to authenticated;
