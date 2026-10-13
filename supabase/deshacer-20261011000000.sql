-- Deshace la migración 20261011000000_cuentas_al_registrarse.sql
-- Solo si hiciera falta volver atrás (por ejemplo, si el registro falla).
-- No borra cuentas ni mapas ya creados.

drop trigger if exists crear_cuenta_al_registrarse on auth.users;
drop function if exists public.crear_cuenta_al_registrarse();

grant insert on table public.cuentas, public.mapas to authenticated;
create policy "cuentas: crear la propia" on public.cuentas
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "mapas: crear el propio" on public.mapas
  for insert to authenticated with check ((select auth.uid()) = user_id);

-- La versión anterior de cuentas_marcar_tiempo() está en
-- migrations/20261009000000_esquema_inicial.sql.

-- Y para la migración 20261013000000_limpiar_metadata_siempre.sql:
drop trigger if exists limpiar_metadata_de_registro on auth.users;
drop function if exists public.limpiar_metadata_de_registro();
