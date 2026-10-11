-- ─────────────────────────────────────────────────────────────
-- Cuenta y mapa se crean solos al registrarse
--
-- Por qué:
-- - La persona pasa el gate de 18+ y el de elegibilidad ANTES de crear la
--   cuenta (flujo aprobado del prototipo). La fecha de nacimiento y la respuesta
--   de elegibilidad nunca salen del navegador: al registrarse solo se envían
--   el nombre y dos marcas "sí" (mayor_de_edad, elegibilidad).
-- - Este trigger crea la fila de `cuentas` y el mapa vacío en el mismo momento
--   en que Supabase Auth crea la persona. Así nunca queda una cuenta a medias si
--   alguien cierra la pestaña antes de escribir el código del correo.
-- - Las horas las pone el servidor, no el navegador.
-- - Si faltan el nombre o las dos marcas, el registro se rechaza: no se puede
--   crear una cuenta por la API saltándose los gates.
-- - Después de copiarlos, los datos se borran de la metadata de auth.users, para
--   que el nombre no quede duplicado ni viaje dentro del token de sesión.
--
-- Consecuencia: crear personas desde el panel de Supabase ("Add user") o por
-- invitación falla a propósito. Las cuentas se crean solo desde la app.
-- ─────────────────────────────────────────────────────────────

create function public.crear_cuenta_al_registrarse()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  datos jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  nombre text := btrim(coalesce(datos ->> 'nombre', ''));
begin
  if char_length(nombre) not between 1 and 80
     or coalesce(datos ->> 'mayor_de_edad', '') <> 'true'
     or coalesce(datos ->> 'elegibilidad', '') <> 'true' then
    raise exception 'registro incompleto' using errcode = 'check_violation';
  end if;

  insert into public.cuentas (user_id, nombre, mayor_de_edad_verificado_en, elegibilidad_aprobada_en)
  values (new.id, nombre, now(), now());

  insert into public.mapas (user_id) values (new.id);

  update auth.users
     set raw_user_meta_data = raw_user_meta_data - 'nombre' - 'mayor_de_edad' - 'elegibilidad'
   where id = new.id;

  return new;
end;
$$;

revoke execute on function public.crear_cuenta_al_registrarse() from public, anon, authenticated;

create trigger crear_cuenta_al_registrarse
  after insert on auth.users
  for each row execute function public.crear_cuenta_al_registrarse();

-- ── Lo que el navegador ya no necesita hacer ─────────────────
-- Las filas las crea el trigger; desde la app solo se leen y se cambian.
drop policy "cuentas: crear la propia" on public.cuentas;
drop policy "mapas: crear el propio" on public.mapas;
revoke insert on table public.cuentas, public.mapas from authenticated;

-- ── Horas que no controla el navegador ───────────────────────
-- - Las marcas de 18+ y elegibilidad no se pueden cambiar después.
-- - La hora del consentimiento la pone el servidor cuando cambia la versión.
create or replace function public.cuentas_marcar_tiempo()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    new.creado_en := now();
    new.consentimiento_aceptado_en := case when new.consentimiento_version is null then null else now() end;
  else
    new.creado_en := old.creado_en;
    new.mayor_de_edad_verificado_en := old.mayor_de_edad_verificado_en;
    new.elegibilidad_aprobada_en := old.elegibilidad_aprobada_en;
    if new.consentimiento_version is null then
      new.consentimiento_aceptado_en := null;
    elsif new.consentimiento_version is distinct from old.consentimiento_version then
      new.consentimiento_aceptado_en := now();
    else
      new.consentimiento_aceptado_en := old.consentimiento_aceptado_en;
    end if;
  end if;
  new.actualizado_en := now();
  return new;
end;
$$;

revoke execute on function public.cuentas_marcar_tiempo() from public, anon, authenticated;
