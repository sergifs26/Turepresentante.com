/** Llamadas server-side a la API de Cloudflare Stream */

const API = "https://api.cloudflare.com/client/v4";

function creds() {
  const account = process.env.CF_ACCOUNT_ID;
  const token = process.env.CF_STREAM_API_TOKEN;
  if (!account || !token) return null;
  return { account, token };
}

async function cf(path: string, init?: RequestInit) {
  const c = creds();
  if (!c) throw new Error("stream_not_configured");
  const res = await fetch(`${API}/accounts/${c.account}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${c.token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const data = (await res.json()) as {
    success: boolean;
    result: Record<string, unknown> | null;
    errors: { message: string }[];
  };
  if (!res.ok || !data.success) {
    throw new Error(data.errors?.[0]?.message ?? `stream_error_${res.status}`);
  }
  return data.result;
}

/** URL de subida directa de un solo uso (el archivo va del navegador a
 *  Cloudflare, nunca pasa por nuestro servidor) */
export async function createDirectUpload(userId: string, maxSeconds = 600) {
  const result = await cf("/stream/direct_upload", {
    method: "POST",
    body: JSON.stringify({
      maxDurationSeconds: maxSeconds,
      creator: userId,
      requireSignedURLs: false,
    }),
  });
  return result as unknown as { uploadURL: string; uid: string };
}

export async function getVideoStatus(uid: string) {
  const result = (await cf(`/stream/${uid}`)) as unknown as {
    readyToStream: boolean;
    duration: number;
    status: { state: string };
  };
  return {
    ready: result.readyToStream,
    duration: result.duration > 0 ? result.duration : null,
    state: result.status?.state ?? "unknown",
  };
}

export async function deleteStreamVideo(uid: string) {
  await cf(`/stream/${uid}`, { method: "DELETE" });
}
