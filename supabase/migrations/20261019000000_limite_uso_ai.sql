-- ─────────────────────────────────────────────────────────────
-- Límite de uso de la AI (freno de costo)
--
-- La AI (Claude en Bedrock) cobra por uso. Para que un error en el código o
-- una persona que pide sugerencias sin parar no genere una factura grande,
-- api/claude.js llama a consumir_cuota_ai() ANTES de cada pedido a Bedrock.
-- Si devuelve false, la AI responde 429 y no se llama a Bedrock.
--
-- Límites (cámbialos aquí con una migración nueva):
--   - por persona: 15 pedidos por hora y 40 en 24 horas;
--   - en total, entre todas las personas: 500 pedidos en 24 horas
--     (≈ US$10–12 en el peor caso, con respuestas de 1500 tokens).
--
-- Qué se guarda: solo CUÁNTOS pedidos hizo cada persona en cada hora.
-- Nunca el texto enviado ni la respuesta (DATA-MAP §5: "solo metadatos sin
-- contenido"). Las filas de más de 2 días se borran en la misma función:
-- no hay tareas programadas (nada se ejecuta solo).
-- Borrar la cuenta borra sus filas (on delete cascade).
-- ─────────────────────────────────────────────────────────────

create table public.uso_ai (
  user_id uuid not null references auth.users (id) on delete cascade,
  hora timestamptz not null,
  pedidos integer not null default 0 check (pedidos >= 0),
  primary key (user_id, hora)
);

comment on table public.uso_ai is
  'Cuántos pedidos a la AI hizo cada persona por hora (sin contenido). Solo para limitar el costo; se borra a los 2 días.';

create index uso_ai_hora on public.uso_ai (hora);

-- Nadie la lee ni la cambia directamente: solo a través de la función.
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

  -- Un pedido a la vez, para que dos pedidos simultáneos no pasen el límite.
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
  'Cuenta un pedido a la AI de la persona con sesión. Devuelve false si se pasó del límite (por hora, por día o total).';

revoke all on function public.consumir_cuota_ai() from public, anon;
grant execute on function public.consumir_cuota_ai() to authenticated;
