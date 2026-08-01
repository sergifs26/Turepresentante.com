-- ============================================================
-- Turepresentante — esquema de la plataforma (perfiles + vídeos)
-- Pegar en Supabase: SQL Editor → New query → Run
-- ============================================================

-- Perfiles públicos de jugador (1 por usuario)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  slug text unique not null,
  nombre text not null,
  posicion text,
  pierna text,
  club text,
  categoria text,
  ciudad text,
  nacimiento int,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Vídeos de la galería (archivo vive en Cloudflare Stream)
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  stream_uid text not null,
  title text not null default 'Sin título',
  status text not null default 'processing' check (status in ('processing','ready','error')),
  duration numeric,
  created_at timestamptz not null default now()
);

create index if not exists videos_user_idx on public.videos (user_id, created_at desc);

-- ============================================================
-- Row Level Security: lectura pública, escritura solo del dueño
-- ============================================================
alter table public.profiles enable row level security;
alter table public.videos enable row level security;

drop policy if exists "perfiles visibles para todos" on public.profiles;
create policy "perfiles visibles para todos"
  on public.profiles for select using (true);

drop policy if exists "cada uno crea su perfil" on public.profiles;
create policy "cada uno crea su perfil"
  on public.profiles for insert with check (auth.uid() = user_id);

drop policy if exists "cada uno edita su perfil" on public.profiles;
create policy "cada uno edita su perfil"
  on public.profiles for update using (auth.uid() = user_id);

drop policy if exists "videos visibles para todos" on public.videos;
create policy "videos visibles para todos"
  on public.videos for select using (true);

drop policy if exists "cada uno sube sus videos" on public.videos;
create policy "cada uno sube sus videos"
  on public.videos for insert with check (auth.uid() = user_id);

drop policy if exists "cada uno actualiza sus videos" on public.videos;
create policy "cada uno actualiza sus videos"
  on public.videos for update using (auth.uid() = user_id);

drop policy if exists "cada uno borra sus videos" on public.videos;
create policy "cada uno borra sus videos"
  on public.videos for delete using (auth.uid() = user_id);

-- ============================================================
-- Fotos de perfil (Supabase Storage, bucket público "avatars")
-- ============================================================
alter table public.profiles add column if not exists foto_url text;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatars lectura publica" on storage.objects;
create policy "avatars lectura publica"
  on storage.objects for select using (bucket_id = 'avatars');

-- Cada usuario solo puede tocar su propia carpeta (avatars/{user_id}/...)
drop policy if exists "avatars sube el dueno" on storage.objects;
create policy "avatars sube el dueno"
  on storage.objects for insert with check (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars actualiza el dueno" on storage.objects;
create policy "avatars actualiza el dueno"
  on storage.objects for update using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars borra el dueno" on storage.objects;
create policy "avatars borra el dueno"
  on storage.objects for delete using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================
-- Administradores + teléfono privado
-- El teléfono NO puede ir en profiles (lectura pública): iría en una
-- tabla aparte que solo el dueño o un admin pueden leer.
-- ============================================================

-- Quién es admin. is_admin() es SECURITY DEFINER para poder comprobarlo
-- dentro de las políticas sin exponer la tabla.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.admins enable row level security;

drop policy if exists "cada uno ve si es admin" on public.admins;
create policy "cada uno ve si es admin"
  on public.admins for select using (auth.uid() = user_id);

create or replace function public.is_admin()
  returns boolean
  language sql
  security definer
  stable
  set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Contacto privado (teléfono)
create table if not exists public.profile_private (
  user_id uuid primary key references auth.users (id) on delete cascade,
  telefono text,
  updated_at timestamptz not null default now()
);
alter table public.profile_private enable row level security;

drop policy if exists "contacto: lo lee el dueno o un admin" on public.profile_private;
create policy "contacto: lo lee el dueno o un admin"
  on public.profile_private for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "contacto: el dueno lo crea" on public.profile_private;
create policy "contacto: el dueno lo crea"
  on public.profile_private for insert with check (auth.uid() = user_id);

drop policy if exists "contacto: el dueno lo actualiza" on public.profile_private;
create policy "contacto: el dueno lo actualiza"
  on public.profile_private for update using (auth.uid() = user_id);

-- Para hacerte admin, ejecuta (con tu user_id de auth.users):
--   insert into public.admins (user_id) values ('TU-USER-ID') on conflict do nothing;

-- ============================================================
-- Modo revisión (2026-08-01): nada sale en público sin aprobación
-- de un admin. Ver supabase/migracion-revision.sql (misma lógica;
-- aquí replicada para instalaciones nuevas).
-- ============================================================

alter table public.profiles
  add column if not exists estado text not null default 'borrador'
    check (estado in ('borrador','en_revision','aprobado','rechazado'));
alter table public.profiles add column if not exists revision_notas text;
alter table public.profiles add column if not exists enviado_revision_at timestamptz;
alter table public.profiles add column if not exists revisado_at timestamptz;

alter table public.videos
  add column if not exists revision text not null default 'pendiente'
    check (revision in ('pendiente','aprobado','rechazado'));

drop policy if exists "perfiles visibles para todos" on public.profiles;
drop policy if exists "perfiles: publico solo aprobados" on public.profiles;
create policy "perfiles: publico solo aprobados"
  on public.profiles for select
  using (estado = 'aprobado' or auth.uid() = user_id or public.is_admin());

drop policy if exists "videos visibles para todos" on public.videos;
drop policy if exists "videos: publico solo aprobados de perfil aprobado" on public.videos;
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

drop policy if exists "perfiles: un admin puede moderar" on public.profiles;
create policy "perfiles: un admin puede moderar"
  on public.profiles for update using (public.is_admin());

drop policy if exists "videos: un admin puede moderar" on public.videos;
create policy "videos: un admin puede moderar"
  on public.videos for update using (public.is_admin());

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
