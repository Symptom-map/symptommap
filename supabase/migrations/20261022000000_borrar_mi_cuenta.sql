-- ─────────────────────────────────────────────────────────────
-- Delete account and data (Settings → Privacy & your data)
--
-- Decided 11 Oct 2026 (docs/FUENTES-Y-DECISIONES.md §3): deleting the
-- account deletes everything, at once, in cascade. Deleting the person's row
-- in auth.users removes, through "on delete cascade":
--   - public.cuentas  (name, eligibility and consent dates)
--   - public.mapas    (the map: diagnoses, profiles, symptoms, notes)
--   - public.uso_ai   (AI request counts, no content)
--   - auth.sessions, auth.refresh_tokens, auth.identities… (Supabase Auth)
-- Nothing is kept or queued. Supabase's daily database backups (Pro plan:
-- kept 7 days) age out on their own; the privacy page says so.
--
-- The person can only delete their own account: the function uses
-- auth.uid() and takes no argument. Anonymous callers cannot run it.
-- ─────────────────────────────────────────────────────────────

create function public.borrar_mi_cuenta()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  yo constant uuid := auth.uid();
begin
  if yo is null then
    raise exception 'not signed in' using errcode = '28000';
  end if;
  delete from auth.users where id = yo;
end;
$$;

comment on function public.borrar_mi_cuenta() is
  'Deletes the signed-in person''s account and, in cascade, all their data. Only their own (auth.uid()).';

revoke all on function public.borrar_mi_cuenta() from public, anon;
grant execute on function public.borrar_mi_cuenta() to authenticated;
