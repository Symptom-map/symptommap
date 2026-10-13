-- ─────────────────────────────────────────────────────────────
-- Mantener limpia la metadata de Auth
--
-- La migración anterior borraba nombre, mayor_de_edad y elegibilidad de
-- auth.users justo después de crear la cuenta. En la primera prueba real
-- (13 oct 2026) se vio que Supabase Auth vuelve a escribir toda la metadata
-- al confirmar el correo, y esos datos reaparecían.
--
-- Solución: un trigger BEFORE UPDATE que los quita cada vez que alguien
-- (Supabase Auth o la app) actualiza la persona. El nombre sigue guardado
-- donde corresponde: public.cuentas.
-- ─────────────────────────────────────────────────────────────

create function public.limpiar_metadata_de_registro()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.raw_user_meta_data ?| array['nombre', 'mayor_de_edad', 'elegibilidad'] then
    new.raw_user_meta_data := new.raw_user_meta_data - 'nombre' - 'mayor_de_edad' - 'elegibilidad';
  end if;
  return new;
end;
$$;

revoke execute on function public.limpiar_metadata_de_registro() from public, anon, authenticated;

create trigger limpiar_metadata_de_registro
  before update on auth.users
  for each row execute function public.limpiar_metadata_de_registro();

-- Limpiar las cuentas que ya existen (el trigger de arriba hace el trabajo).
update auth.users
   set raw_user_meta_data = raw_user_meta_data
 where raw_user_meta_data ?| array['nombre', 'mayor_de_edad', 'elegibilidad'];
