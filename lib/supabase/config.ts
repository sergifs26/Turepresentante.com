/** Config central de la plataforma: si faltan claves, la web sigue
 *  funcionando en modo landing y las páginas de cuenta avisan. */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function supabaseConfigured() {
  return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
}

export function streamConfigured() {
  return (
    (process.env.CF_ACCOUNT_ID ?? "").length > 0 &&
    (process.env.CF_STREAM_API_TOKEN ?? "").length > 0
  );
}

/** Subdominio de reproducción de Cloudflare Stream (customer code).
 *  Acepta tanto el código a secas como la dirección completa
 *  ("customer-xxx.cloudflarestream.com") y extrae solo el código. */
export const STREAM_CUSTOMER_CODE = (
  process.env.NEXT_PUBLIC_STREAM_CUSTOMER_CODE ?? ""
)
  .trim()
  .replace(/^https?:\/\//, "")
  .replace(/^customer-/, "")
  .replace(/\.cloudflarestream\.com.*$/, "")
  .replace(/\/.*$/, "");

export function streamIframeUrl(uid: string) {
  return `https://customer-${STREAM_CUSTOMER_CODE}.cloudflarestream.com/${uid}/iframe`;
}

export function streamThumbUrl(uid: string, seconds = 2) {
  return `https://customer-${STREAM_CUSTOMER_CODE}.cloudflarestream.com/${uid}/thumbnails/thumbnail.jpg?time=${seconds}s&height=480`;
}
