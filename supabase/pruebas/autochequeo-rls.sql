-- ─────────────────────────────────────────────────────────────
-- Database self-check: who can read and change what (Row Level Security)
--
-- Run it in the Supabase SQL editor (or with execute_sql). It creates two
-- throwaway people, A and B, inside one transaction, tries what an attacker
-- would try, and always ends with an error on purpose: the error rolls
-- everything back, so nothing is left behind.
--
-- How to read the result (the error message):
--   "SELF-CHECK PASSED: 14 of 14 …"  → every check got the expected answer.
--   "SELF-CHECK FAILED: …"           → lists each check that did not, with
--                                       what it expected and what it got.
-- Each check is an assert: a count of 2 where 1 was expected, or an action
-- that should be blocked but goes through, makes it fail.
--
-- It never reads anyone's map: it only counts rows.
-- First run 30 Oct 2026: 14 of 14 passed. Re-run after every migration.
--
-- Afterwards, check nothing was left: select count(*) from auth.users where email like 'selfcheck-%';  → 0
-- ─────────────────────────────────────────────────────────────

do $$
declare
  a uuid := gen_random_uuid();
  b uuid := gen_random_uuid();
  n bigint;
  total int := 0;
  fallos text[] := '{}';
  bloqueado boolean;
begin
  insert into auth.users (id, instance_id, aud, role, email, raw_user_meta_data)
  values (a, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'selfcheck-a@example.invalid', '{"nombre":"Test A","mayor_de_edad":"true","elegibilidad":"true"}'),
         (b, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'selfcheck-b@example.invalid', '{"nombre":"Test B","mayor_de_edad":"true","elegibilidad":"true"}');

  -- ── Someone without a session (the public "anon" role): everything blocked
  execute 'set local role anon';

  total := total + 1; bloqueado := false;
  begin perform count(*) from public.mapas; exception when insufficient_privilege then bloqueado := true; end;
  if not bloqueado then fallos := fallos || 'anon reads mapas: expected blocked, got allowed'; end if;

  total := total + 1; bloqueado := false;
  begin perform count(*) from public.cuentas; exception when insufficient_privilege then bloqueado := true; end;
  if not bloqueado then fallos := fallos || 'anon reads cuentas: expected blocked, got allowed'; end if;

  total := total + 1; bloqueado := false;
  begin perform count(*) from public.uso_ai; exception when insufficient_privilege then bloqueado := true; end;
  if not bloqueado then fallos := fallos || 'anon reads uso_ai: expected blocked, got allowed'; end if;

  total := total + 1; bloqueado := false;
  begin perform public.consumir_cuota_ai(); exception when insufficient_privilege then bloqueado := true; end;
  if not bloqueado then fallos := fallos || 'anon calls consumir_cuota_ai(): expected blocked, got allowed'; end if;

  total := total + 1; bloqueado := false;
  begin perform public.borrar_mi_cuenta(); exception when insufficient_privilege then bloqueado := true; end;
  if not bloqueado then fallos := fallos || 'anon calls borrar_mi_cuenta(): expected blocked, got allowed'; end if;

  -- ── Person A, signed in, trying to reach person B
  execute 'reset role';
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';

  total := total + 1;
  select count(*) into n from public.mapas;
  if n <> 1 then fallos := fallos || ('A sees maps: expected 1, got ' || n); end if;

  total := total + 1;
  select count(*) into n from public.mapas where user_id = b;
  if n <> 0 then fallos := fallos || ('A sees B''s map: expected 0, got ' || n); end if;

  total := total + 1;
  select count(*) into n from public.cuentas;
  if n <> 1 then fallos := fallos || ('A sees accounts: expected 1, got ' || n); end if;

  total := total + 1;
  update public.mapas set datos = datos where user_id = b; get diagnostics n = row_count;
  if n <> 0 then fallos := fallos || ('A changes B''s map: expected 0 rows, got ' || n); end if;

  total := total + 1;
  update public.cuentas set nombre = 'x' where user_id = b; get diagnostics n = row_count;
  if n <> 0 then fallos := fallos || ('A changes B''s account: expected 0 rows, got ' || n); end if;

  total := total + 1; bloqueado := false;
  begin update public.mapas set user_id = b where user_id = a; exception when insufficient_privilege then bloqueado := true; end;
  if not bloqueado then fallos := fallos || 'A takes B''s id: expected blocked, got allowed'; end if;

  total := total + 1; bloqueado := false;
  begin delete from public.mapas where user_id = b; exception when insufficient_privilege then bloqueado := true; end;
  if not bloqueado then fallos := fallos || 'A deletes rows: expected blocked, got allowed'; end if;

  total := total + 1; bloqueado := false;
  begin insert into public.mapas (user_id) values (gen_random_uuid()); exception when insufficient_privilege then bloqueado := true; end;
  if not bloqueado then fallos := fallos || 'A inserts maps: expected blocked, got allowed'; end if;

  total := total + 1; bloqueado := false;
  begin perform count(*) from public.uso_ai; exception when insufficient_privilege then bloqueado := true; end;
  if not bloqueado then fallos := fallos || 'A reads uso_ai: expected blocked, got allowed'; end if;

  -- ── Roll everything back and report.
  if cardinality(fallos) = 0 then
    raise exception 'SELF-CHECK PASSED: % of % checks gave the expected answer (everything was rolled back)', total, total;
  else
    raise exception 'SELF-CHECK FAILED: % of % checks failed: %', cardinality(fallos), total, array_to_string(fallos, ' | ');
  end if;
end $$;
