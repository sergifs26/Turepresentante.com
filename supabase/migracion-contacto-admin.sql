-- ============================================================
-- Turepresentante — MIGRACIÓN: email del jugador visible para admins
-- Pegar ENTERO en Supabase: SQL Editor → New query → Run
--
-- El email vive en auth.users, que la web no puede leer. Lo copiamos a
-- profile_private (tabla que SOLO puede leer el dueño o un admin) para
-- que el panel de revisión pueda mostrarlo y puedas escribir tú.
-- ============================================================

alter table public.profile_private add column if not exists email text;

-- 1) Relleno inicial: todos los usuarios que ya existen ---------------

insert into public.profile_private (user_id, email)
select u.id, u.email from auth.users u
on conflict (user_id) do update set email = excluded.email;

-- 2) El email es SIEMPRE el de la cuenta ------------------------------
-- Se recalcula en cada escritura: así ni un jugador puede poner un
-- email falso ni se queda desactualizado.

create or replace function public.sincronizar_email_contacto()
  returns trigger
  language plpgsql
  security definer
  set search_path = public
as $$
begin
  new.email := (select u.email from auth.users u where u.id = new.user_id);
  return new;
end;
$$;

drop trigger if exists trg_sincronizar_email_contacto on public.profile_private;
create trigger trg_sincronizar_email_contacto
  before insert or update on public.profile_private
  for each row execute function public.sincronizar_email_contacto();

-- 3) Si el jugador cambia su email de acceso, se refleja aquí ---------

create or replace function public.propagar_email_usuario()
  returns trigger
  language plpgsql
  security definer
  set search_path = public
as $$
begin
  insert into public.profile_private (user_id, email)
  values (new.id, new.email)
  on conflict (user_id) do update set email = excluded.email;
  return new;
end;
$$;

-- auth.users no nos pertenece: creamos el trigger solo si no existe y
-- toleramos que la instalación no dé permisos (el email se sincroniza
-- igualmente en cada escritura de profile_private).
do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'trg_propagar_email_usuario'
      and tgrelid = 'auth.users'::regclass
  ) then
    create trigger trg_propagar_email_usuario
      after insert or update of email on auth.users
      for each row execute function public.propagar_email_usuario();
  end if;
exception
  when insufficient_privilege then
    raise notice 'Sin permisos sobre auth.users: el email se sincronizará al guardar datos.';
end
$$;
