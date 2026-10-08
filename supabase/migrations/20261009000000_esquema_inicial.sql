-- ─────────────────────────────────────────────────────────────
-- Esquema inicial de SymptomMap (Supabase, región Sydney)
--
-- Principios (docs/FUENTES-Y-DECISIONES.md y docs/producto/DATA-MAP.md):
-- - Datos mínimos: no se guarda la fecha de nacimiento, solo que se verificó
--   18+; no se guarda la respuesta de elegibilidad, solo que se aprobó.
-- - El mapa se guarda como UN documento JSON por persona, con la forma exacta
--   del núcleo (src/core/mapa.js). Las reglas del mapa viven solo en el núcleo;
--   la base de datos guarda, protege y controla el tamaño.
-- - Cada persona solo puede ver y cambiar lo suyo (Row Level Security).
-- - Nadie sin sesión (rol anon) tiene acceso a ninguna tabla.
-- - Borrar la cuenta (auth.users) borra en cascada su cuenta y su mapa.
-- ─────────────────────────────────────────────────────────────

-- ── Cuenta: datos mínimos de la persona ──────────────────────
create table public.cuentas (
  user_id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null check (char_length(btrim(nombre)) between 1 and 80),
  mayor_de_edad_verificado_en timestamptz not null,
  elegibilidad_aprobada_en timestamptz not null,
  consentimiento_version text,
  consentimiento_aceptado_en timestamptz,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint consentimiento_completo check (
    (consentimiento_version is null) = (consentimiento_aceptado_en is null)
  )
);

comment on table public.cuentas is
  'Datos mínimos de la cuenta. Sin fecha de nacimiento ni respuesta de elegibilidad (solo cuándo se aprobaron).';

-- ── Mapa: un documento por persona ───────────────────────────
create table public.mapas (
  user_id uuid primary key references auth.users (id) on delete cascade,
  datos jsonb not null default
    '{"version":1,"diagnosticos":[],"perfiles":{},"sintomas":[],"conexiones":[],"siguienteId":1}'::jsonb,
  revision integer not null default 1,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint datos_es_mapa check (
    jsonb_typeof(datos) = 'object'
    and datos ? 'version'
    and jsonb_typeof(datos -> 'diagnosticos') = 'array'
    and jsonb_typeof(datos -> 'sintomas') = 'array'
    and jsonb_typeof(datos -> 'conexiones') = 'array'
    and jsonb_typeof(datos -> 'perfiles') = 'object'
  ),
  constraint datos_tamano check (pg_column_size(datos) < 500000)
);

comment on table public.mapas is
  'Mapa de cada persona con la forma del núcleo (src/core/mapa.js). revision sube en cada cambio para detectar ediciones desde dos pestañas.';

-- ── Marcas de tiempo y revisión (no las controla el cliente) ─
create function public.cuentas_marcar_tiempo()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    new.creado_en := now();
  else
    new.creado_en := old.creado_en;
  end if;
  new.actualizado_en := now();
  return new;
end;
$$;

create function public.mapas_marcar_revision()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    new.revision := 1;
    new.creado_en := now();
  else
    new.revision := old.revision + 1;
    new.creado_en := old.creado_en;
  end if;
  new.actualizado_en := now();
  return new;
end;
$$;

create trigger cuentas_marcar_tiempo
  before insert or update on public.cuentas
  for each row execute function public.cuentas_marcar_tiempo();

create trigger mapas_marcar_revision
  before insert or update on public.mapas
  for each row execute function public.mapas_marcar_revision();

-- ── Permisos: solo personas con sesión, solo lo suyo ─────────
alter table public.cuentas enable row level security;
alter table public.mapas enable row level security;

revoke all on table public.cuentas, public.mapas from anon, authenticated;
grant select, insert, update on table public.cuentas, public.mapas to authenticated;

create policy "cuentas: ver la propia" on public.cuentas
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "cuentas: crear la propia" on public.cuentas
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "cuentas: cambiar la propia" on public.cuentas
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "mapas: ver el propio" on public.mapas
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "mapas: crear el propio" on public.mapas
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "mapas: cambiar el propio" on public.mapas
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Las funciones de los triggers no se pueden llamar desde la API.
revoke execute on function public.cuentas_marcar_tiempo() from public, anon, authenticated;
revoke execute on function public.mapas_marcar_revision() from public, anon, authenticated;
