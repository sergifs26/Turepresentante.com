# Plataforma de perfiles y vídeos — guía de activación

El código ya está completo. Para que las cuentas y la subida de vídeos
funcionen, hay que conectar 2 servicios y pegar 5 claves. Sin las claves,
la web funciona en modo landing y las páginas de cuenta muestran un aviso.

## 1. Supabase (cuentas + base de datos) — gratis

1. Entra en https://supabase.com → New project (nombre: turepresentante).
2. Cuando cargue, ve a **SQL Editor → New query**, pega TODO el contenido
   de `supabase/schema.sql` y pulsa **Run**.
3. En **Authentication → URL Configuration**:
   - Site URL: `https://turepresentante.com` (o la URL de Vercel mientras tanto)
   - Redirect URLs: añade también la URL de Vercel (`https://turepresentante-com.vercel.app/**`)
4. En **Project Settings → API** copia:
   - `Project URL`  → variable `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public`  → variable `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Cloudflare Stream (vídeos) — de pago (~5 $/mes por 1.000 min)

1. En el dashboard de Cloudflare → **Stream** → activa el plan.
2. Copia el **Account ID** (está en la URL o en la home del dashboard)
   → variable `CF_ACCOUNT_ID`
3. **My Profile → API Tokens → Create Token → Custom**: permiso
   `Account · Stream · Edit` → variable `CF_STREAM_API_TOKEN`
4. En Stream, cualquier vídeo de ejemplo muestra el "customer code" en su
   URL de embed: `customer-XXXX.cloudflarestream.com`
   → variable `NEXT_PUBLIC_STREAM_CUSTOMER_CODE` (solo la parte XXXX)

## 3. Dónde pegar las variables

Las 5 variables van en los DOS despliegues:
- **Vercel** (staging): Project → Settings → Environment Variables
- **Cloudflare** (producción): Workers → turepresentante → Settings →
  Variables (las `NEXT_PUBLIC_*` como texto, las otras dos como Secret)

Y para desarrollo local, en el archivo `.dev.vars` (nunca se sube a git).

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
CF_ACCOUNT_ID=
CF_STREAM_API_TOKEN=
NEXT_PUBLIC_STREAM_CUSTOMER_CODE=
```

## Qué hace la plataforma

- `/registro` y `/login`: cuentas de jugador (email + contraseña, con
  confirmación por correo).
- `/cuenta`: panel privado — editar ficha + galería (subir hasta 8 vídeos
  de máx. 500 MB, directo del navegador a Cloudflare Stream, con barra de
  progreso; borrar vídeos).
- `/jugadores`: escaparate público con todos los perfiles.
- `/jugadores/su-nombre-xxxxxx`: perfil público con datos y galería.
- Seguridad: cada jugador solo puede tocar SU perfil y SUS vídeos (RLS);
  los archivos van directos a Stream sin pasar por nuestro servidor.
