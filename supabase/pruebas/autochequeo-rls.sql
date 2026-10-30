-- ─────────────────────────────────────────────────────────────
-- Database self-check: who can read and change what (Row Level Security)
--
-- Run it in the Supabase SQL editor (or with execute_sql). It creates two
-- throwaway people, A and B, inside one transaction, tries what an attacker
-- would try, and ends with an error on purpose: the error rolls everything
-- back, so nothing is left behind. The error message is the report.
--
-- It never reads anyone's map: it only counts rows.
--
-- Expected result (first run, 30 Oct 2026, all 14 passed):
--   anon reads mapas / cuentas / uso_ai: blocked
--   anon calls consumir_cuota_ai() / borrar_mi_cuenta(): blocked
--   A sees 1 map (their own) and 0 of B's; sees 1 account
--   A changes B's map or account: 0 rows
--   A takes B's id, deletes rows, inserts maps, reads uso_ai: blocked
--
-- Afterwards, check nothing was left: select count(*) from auth.users where email like 'selfcheck-%';  → 0
-- ─────────────────────────────────────────────────────────────

do $$
declare
  a uuid := gen_random_uuid();
  b uuid := gen_random_uuid();
  r text := '';
  n bigint;
begin
  insert into auth.users (id, instance_id, aud, role, email, raw_user_meta_data)
  values (a, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'selfcheck-a@example.invalid', '{"nombre":"Test A","mayor_de_edad":"true","elegibilidad":"true"}'),
         (b, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'selfcheck-b@example.invalid', '{"nombre":"Test B","mayor_de_edad":"true","elegibilidad":"true"}');

  -- Someone without a session (the public "anon" role)
  execute 'set local role anon';
  begin select count(*) into n from public.mapas; r := r || 'anon reads mapas: ALLOWED(' || n || ') | '; exception when insufficient_privilege then r := r || 'anon reads mapas: blocked | '; end;
  begin select count(*) into n from public.cuentas; r := r || 'anon reads cuentas: ALLOWED(' || n || ') | '; exception when insufficient_privilege then r := r || 'anon reads cuentas: blocked | '; end;
  begin select count(*) into n from public.uso_ai; r := r || 'anon reads uso_ai: ALLOWED(' || n || ') | '; exception when insufficient_privilege then r := r || 'anon reads uso_ai: blocked | '; end;
  begin perform public.consumir_cuota_ai(); r := r || 'anon uses AI quota: ALLOWED | '; exception when insufficient_privilege then r := r || 'anon uses AI quota: blocked | '; end;
  begin perform public.borrar_mi_cuenta(); r := r || 'anon deletes account: ALLOWED | '; exception when insufficient_privilege then r := r || 'anon deletes account: blocked | '; end;

  -- Person A, signed in, trying to reach person B
  execute 'reset role';
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';
  select count(*) into n from public.mapas; r := r || 'A sees maps (expect 1): ' || n || ' | ';
  select count(*) into n from public.mapas where user_id = b; r := r || 'A sees B''s map (expect 0): ' || n || ' | ';
  select count(*) into n from public.cuentas; r := r || 'A sees accounts (expect 1): ' || n || ' | ';
  update public.mapas set datos = datos where user_id = b; get diagnostics n = row_count; r := r || 'A changes B''s map (expect 0): ' || n || ' | ';
  update public.cuentas set nombre = 'x' where user_id = b; get diagnostics n = row_count; r := r || 'A changes B''s account (expect 0): ' || n || ' | ';
  begin update public.mapas set user_id = b where user_id = a; r := r || 'A takes B''s id: ALLOWED | '; exception when insufficient_privilege then r := r || 'A takes B''s id: blocked | '; end;
  begin delete from public.mapas where user_id = b; r := r || 'A deletes rows: ALLOWED | '; exception when insufficient_privilege then r := r || 'A deletes rows: blocked | '; end;
  begin insert into public.mapas (user_id) values (gen_random_uuid()); r := r || 'A inserts maps: ALLOWED | '; exception when insufficient_privilege then r := r || 'A inserts maps: blocked | '; end;
  begin select count(*) into n from public.uso_ai; r := r || 'A reads uso_ai: ALLOWED(' || n || ')'; exception when insufficient_privilege then r := r || 'A reads uso_ai: blocked'; end;

  -- Roll everything back and show the report.
  raise exception 'RESULT: %', r;
end $$;
