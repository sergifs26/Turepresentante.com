-- ============================================================
-- Turepresentante — MIGRACIÓN: contador de perfiles en revisión
-- Pegar ENTERO en Supabase: SQL Editor → New query → Run
--
-- El escaparate muestra siluetas difuminadas por cada perfil que está
-- esperando aprobación. Para eso solo necesita SABER CUÁNTOS hay, nunca
-- quiénes son: esta función devuelve un número y nada más.
-- ============================================================

create or replace function public.perfiles_en_revision_count()
  returns int
  language sql
  security definer
  stable
  set search_path = public
as $$
  select count(*)::int from public.profiles where estado = 'en_revision';
$$;

grant execute on function public.perfiles_en_revision_count() to anon, authenticated;
