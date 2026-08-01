-- ============================================================
-- Turepresentante — MIGRACIÓN: modo revisión de perfiles y vídeos
-- Pegar ENTERO en Supabase: SQL Editor → New query → Run
--
-- Qué hace:
--  1. Añade el estado de revisión a perfiles y vídeos.
--  2. Cierra la lectura pública: solo se ven perfiles APROBADOS
--     (y vídeos aprobados de perfiles aprobados).
--  3. Protege los campos de moderación: solo un admin puede
--     aprobar/rechazar; el jugador solo puede "enviar a revisión".
--  4. Pasa TODOS los perfiles existentes a revisión (decisión 2026-08-01).
-- ============================================================

-- 1) Columnas nuevas ------------------------------------------------

alter table public.profiles
  add column if not exists estado text not null default 'borrador'
    check (estado in ('borrador','en_revision','aprobado','rechazado'));
alter table public.profiles add column if not exists revision_notas text;
alter table public.profiles add column if not exists enviado_revision_at timestamptz;
alter table public.profiles add column if not exists revisado_at timestamptz;

alter table public.videos
  add column if not exists revision text not null default 'pendiente'
    check (revision in ('pendiente','aprobado','rechazado'));

-- 2) Lectura pública solo de lo aprobado ----------------------------

drop policy if exists "perfiles visibles para todos" on public.profiles;
create policy "perfiles: publico solo aprobados"
  on public.profiles for select
  using (estado = 'aprobado' or auth.uid() = user_id or public.is_admin());

drop policy if exists "videos visibles para todos" on public.videos;
create policy "videos: publico solo aprobados de perfil aprobado"
  on public.videos for select
  using (
    auth.uid() = user_id
    or public.is_admin()
    or (
      revision = 'aprobado'
      and exists (
        select 1 from public.profiles p
        where p.user_id = videos.user_id and p.estado = 'aprobado'
      )
    )
  );

-- Nadie puede crearse ya aprobado
drop policy if exists "cada uno crea su perfil" on public.profiles;
create policy "cada uno crea su perfil"
  on public.profiles for insert
  with check (auth.uid() = user_id and estado = 'borrador');

drop policy if exists "cada uno sube sus videos" on public.videos;
create policy "cada uno sube sus videos"
  on public.videos for insert
  with check (auth.uid() = user_id and revision = 'pendiente');

-- Un admin puede moderar (aprobar/rechazar) perfiles y vídeos
drop policy if exists "perfiles: un admin puede moderar" on public.profiles;
create policy "perfiles: un admin puede moderar"
  on public.profiles for update using (public.is_admin());

drop policy if exists "videos: un admin puede moderar" on public.videos;
create policy "videos: un admin puede moderar"
  on public.videos for update using (public.is_admin());

-- 3) Triggers de protección ----------------------------------------
-- El dueño puede editar su perfil, pero NO auto-aprobarse: la única
-- transición que se le permite es borrador/rechazado → en_revision,
-- y solo si cumple los requisitos (datos completos + 1 vídeo listo).

create or replace function public.proteger_moderacion_perfil()
  returns trigger
  language plpgsql
  security definer
  set search_path = public
as $$
begin
  if public.is_admin() then
    return new;
  end if;

  if new.revision_notas is distinct from old.revision_notas
     or new.revisado_at is distinct from old.revisado_at then
    raise exception 'Solo un administrador puede modificar la revisión.';
  end if;

  -- El slug es la URL pública: inmutable para evitar suplantaciones
  if new.slug is distinct from old.slug then
    raise exception 'El slug del perfil no se puede cambiar.';
  end if;

  -- La foto solo puede venir de la carpeta propia del bucket de avatares
  if new.foto_url is not null
     and new.foto_url not like '%/storage/v1/object/public/avatars/' || new.user_id || '/%' then
    raise exception 'La foto de perfil debe subirse desde la web.';
  end if;

  if new.estado is distinct from old.estado then
    if not (old.estado in ('borrador','rechazado') and new.estado = 'en_revision') then
      raise exception 'Transición de estado no permitida.';
    end if;
    if new.nombre is null or btrim(new.nombre) = ''
       or new.posicion is null
       or new.nacimiento is null
       or new.club is null or btrim(new.club) = ''
       or new.categoria is null or btrim(new.categoria) = '' then
      raise exception 'Faltan datos del perfil para enviarlo a revisión.';
    end if;
    if not exists (
      select 1 from public.videos v
      where v.user_id = new.user_id and v.status = 'ready'
    ) then
      raise exception 'Hace falta al menos un vídeo listo para enviar a revisión.';
    end if;
    -- La fecha de entrada en cola la pone la BD: no se puede falsear
    new.enviado_revision_at := now();
  end if;

  return new;
end;
$$;

drop trigger if exists trg_proteger_moderacion_perfil on public.profiles;
create trigger trg_proteger_moderacion_perfil
  before update on public.profiles
  for each row execute function public.proteger_moderacion_perfil();

-- El dueño no puede aprobarse los vídeos ni sustituir el archivo de uno
-- ya aprobado: eso solo lo hace un admin
create or replace function public.proteger_moderacion_video()
  returns trigger
  language plpgsql
  security definer
  set search_path = public
as $$
begin
  if public.is_admin() then
    return new;
  end if;
  if new.revision is distinct from old.revision then
    raise exception 'Solo un administrador puede aprobar o rechazar vídeos.';
  end if;
  -- Cambiar el stream_uid publicaría contenido jamás revisado
  if new.stream_uid is distinct from old.stream_uid then
    raise exception 'El archivo de un vídeo no se puede sustituir.';
  end if;
  if old.revision = 'aprobado' and new.title is distinct from old.title then
    raise exception 'Un vídeo publicado no se puede renombrar.';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_proteger_moderacion_video on public.videos;
create trigger trg_proteger_moderacion_video
  before update on public.videos
  for each row execute function public.proteger_moderacion_video();

-- 4) MIGRACIÓN ÚNICA: los perfiles ya existentes pasan a revisión ---
-- (Sus vídeos ya quedan en 'pendiente' por el default de la columna.)

update public.profiles
set estado = 'en_revision', enviado_revision_at = now()
where estado = 'borrador';
