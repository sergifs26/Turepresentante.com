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
