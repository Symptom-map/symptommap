-- La función de "RLS automática" de Supabase se ejecuta sola al crear tablas
-- (event trigger). No debe poder llamarse desde la API.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
