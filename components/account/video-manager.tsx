"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { streamThumbUrl, streamIframeUrl } from "@/lib/supabase/config";
import { MAX_TOTAL_VIDEO_SECONDS, type Profile, type Video } from "@/lib/types";

// Límite real de la subida directa básica de Cloudflare Stream
const MAX_MB = 200;
const MIN_CLIP_SECONDS = 10;

function fmt(seconds: number) {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

const REVISION_BADGE: Record<Video["revision"], { texto: string; clase: string } | null> = {
  pendiente: { texto: "En revisión", clase: "text-white/60" },
  aprobado: { texto: "Publicado", clase: "text-[#e8ff00]" },
  rechazado: { texto: "No aprobado", clase: "text-red-400/90" },
};

export default function VideoManager({
  estadoPerfil = "borrador",
}: {
  estadoPerfil?: Profile["estado"];
}) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadPct, setUploadPct] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState<Video | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/videos");
      const data = (await res.json()) as { ok: boolean; videos: Video[] };
      if (data.ok) {
        setVideos((prev) => {
          // Si algún estado cambió (p. ej. procesando → listo), refrescamos
          // también la parte servida de /cuenta (checklist de revisión)
          const antes = new Map(prev.map((v) => [v.id, v.status]));
          if (data.videos.some((v) => antes.get(v.id) !== v.status)) {
            router.refresh();
          }
          return data.videos;
        });
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Mientras haya vídeos procesándose, consultamos cada 6 s
  useEffect(() => {
    if (!videos.some((v) => v.status === "processing")) return;
    const t = setInterval(refresh, 6000);
    return () => clearInterval(t);
  }, [videos, refresh]);

  const usedSeconds = videos.reduce(
    (sum, v) => sum + (v.status === "ready" && v.duration ? Number(v.duration) : 0),
    0
  );
  const remaining = MAX_TOTAL_VIDEO_SECONDS - usedSeconds;
  const galeriaLlena = !loading && remaining < MIN_CLIP_SECONDS;

  const onPick = () => fileRef.current?.click();

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");

    if (!file.type.startsWith("video/")) {
      setError("Eso no parece un vídeo. Formatos válidos: MP4, MOV, WebM…");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`El vídeo pesa demasiado (máx. ${MAX_MB} MB). Recórtalo o comprímelo.`);
      return;
    }

    // 1) Pedimos URL de subida directa
    const title = file.name.replace(/\.[^.]+$/, "").slice(0, 80);
    const res = await fetch("/api/stream/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const data = (await res.json()) as {
      ok: boolean;
      uploadURL?: string;
      video?: Video;
      error?: string;
    };
    if (!data.ok || !data.uploadURL) {
      setError(data.error ?? "No se pudo preparar la subida.");
      return;
    }

    // 2) El archivo viaja directo del navegador a Cloudflare Stream
    setUploadPct(0);
    const form = new FormData();
    form.append("file", file);
    await new Promise<void>((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", data.uploadURL!);
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) setUploadPct(Math.round((ev.loaded / ev.total) * 100));
      };
      const failUpload = async (msg: string) => {
        setError(msg);
        // Limpiamos la fila registrada para que no quede "procesando" eterna
        if (data.video) {
          try {
            await fetch(`/api/videos/${data.video.id}`, { method: "DELETE" });
          } catch {
            // si falla, el backstop del servidor la marcará como error
          }
        }
        resolve();
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setVideos((v) => [data.video!, ...v]);
          resolve();
        } else {
          failUpload("La subida ha fallado a mitad. Inténtalo de nuevo.");
        }
      };
      xhr.onerror = () => failUpload("La subida ha fallado. Comprueba tu conexión.");
      xhr.send(form);
    });
    setUploadPct(null);
  };

  const onDelete = async (v: Video) => {
    if (!confirm(`¿Borrar "${v.title}" de tu galería?`)) return;
    setVideos((list) => list.filter((x) => x.id !== v.id));
    const res = await fetch(`/api/videos/${v.id}`, { method: "DELETE" });
    if (!res.ok) refresh();
    else router.refresh(); // la checklist de revisión depende de los vídeos
  };

  // Cerrar el reproductor con Escape
  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPlaying(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing]);

  return (
    <div>
      {/* Zona de subida */}
      <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={onFile} />
      {uploadPct !== null ? (
        <div className="bio-cell w-full px-7 py-9">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[12px] tracking-[0.15em] uppercase text-[#e8ff00]">
              Subiendo vídeo…
            </span>
            <span className="font-mono text-[14px] text-white/75">{uploadPct}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#e8ff00] rounded-full transition-[width] duration-300"
              style={{ width: `${uploadPct}%` }}
            />
          </div>
          <p className="mt-3 text-[14px] text-white/65">
            No cierres esta página hasta que termine.
          </p>
        </div>
      ) : galeriaLlena ? (
        <div className="bio-cell w-full px-7 py-9 text-center">
          <span
            className="block uppercase text-[#f0f0ee] text-[22px] leading-[1.1]"
            style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 900 }}
          >
            Galería completa
          </span>
          <span className="block mt-2 text-[14px] text-white/70">
            Has usado tus 10 minutos de vídeo. Borra algún clip para subir otro mejor.
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={onPick}
          className="bio-cell w-full px-7 py-9 text-center cursor-pointer bg-transparent"
        >
          <span className="bio-node inline-block mb-3" aria-hidden="true" />
          <span
            className="block uppercase text-[#f0f0ee] text-[22px] leading-[1.1]"
            style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 900 }}
          >
            Subir un vídeo
          </span>
          <span className="block mt-2 text-[14px] text-white/70">
            Vídeo profesional y editado con tus mejores jugadas
          </span>
          <span className="block mt-1 text-[13px] text-white/60">
            MP4, MOV o WebM · hasta {MAX_MB} MB · máx. 10 min entre todos tus vídeos
          </span>
        </button>
      )}

      {/* Contador del tope de 10 minutos */}
      {!loading && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-white/60">
              Tiempo de galería
            </span>
            <span className="font-mono text-[12px] text-white/75">
              {fmt(usedSeconds)} / {fmt(MAX_TOTAL_VIDEO_SECONDS)}
            </span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#e8ff00]/70 rounded-full"
              style={{
                width: `${Math.min(100, (usedSeconds / MAX_TOTAL_VIDEO_SECONDS) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 text-[15px] text-red-400/90 border border-red-400/25 bg-red-400/[0.05] px-4 py-3 rounded-2xl">
          {error}
        </p>
      )}

      {videos.some((v) => v.status === "error" || v.revision === "rechazado") && (
        <p className="mt-4 text-[14px] text-white/65 leading-[1.6]">
          Los vídeos en error o no aprobados no se publican. Bórralos para
          liberar hueco; si el vídeo superaba tu tiempo libre, edítalo más
          corto y vuelve a subirlo.
        </p>
      )}

      {/* Galería */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading && (
          <p className="text-[15px] text-white/65 col-span-full">Cargando tu galería…</p>
        )}
        {!loading && videos.length === 0 && (
          <p className="text-[15px] text-white/65 col-span-full">
            Tu galería está vacía. Sube tu primer vídeo: es lo primero que
            miran los clubes.
          </p>
        )}
        {videos.map((v) => {
          // Antes de aprobarse el perfil, "pendiente" no significa nada para
          // el jugador: la insignia solo aparece con el perfil publicado
          const badge =
            v.status === "ready" &&
            (estadoPerfil === "aprobado" || v.revision === "rechazado")
              ? REVISION_BADGE[v.revision]
              : null;
          return (
            <div
              key={v.id}
              className="relative overflow-hidden rounded-tl-[28px] rounded-br-[28px] rounded-tr-[12px] rounded-bl-[12px] border border-white/10 bg-[#111] group"
            >
              <div className="relative" style={{ aspectRatio: "16/9" }}>
                {v.status === "ready" ? (
                  <button
                    type="button"
                    onClick={() => setPlaying(v)}
                    className="absolute inset-0 w-full cursor-pointer border-0 p-0 bg-transparent"
                    aria-label={`Reproducir ${v.title}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={streamThumbUrl(v.stream_uid)}
                      alt={v.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-80 group-hover:opacity-100 transition-opacity">
                      <span className="w-12 h-12 rounded-full bg-[#e8ff00] flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                          <path d="M4 2l10 6-10 6z" fill="#0a0a0a" />
                        </svg>
                      </span>
                    </span>
                    {v.duration != null && (
                      <span className="absolute bottom-2 right-2 font-mono text-[11px] text-white/90 bg-black/60 rounded-full px-2.5 py-1">
                        {fmt(Number(v.duration))}
                      </span>
                    )}
                  </button>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <span className="bio-node" aria-hidden="true" />
                    <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/75">
                      {v.status === "error" ? "Error al procesar" : "Procesando…"}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="text-[15px] text-white/85 truncate">{v.title}</span>
                <span className="flex items-center gap-3 flex-shrink-0">
                  {badge && (
                    <span
                      className={`font-mono text-[10px] tracking-[0.15em] uppercase ${badge.clase}`}
                    >
                      {badge.texto}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => onDelete(v)}
                    className="font-mono text-[11px] tracking-[0.15em] uppercase text-white/60 hover:text-red-400/90 transition-colors bg-transparent border-0 cursor-pointer"
                  >
                    Borrar
                  </button>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reproductor */}
      {playing && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Reproduciendo ${playing.title}`}
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-5"
          onClick={() => setPlaying(null)}
        >
          <div className="w-full max-w-[960px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[16px] text-white/85 truncate pr-4">{playing.title}</span>
              <button
                type="button"
                onClick={() => setPlaying(null)}
                className="font-mono text-[12px] tracking-[0.15em] uppercase text-white/85 hover:text-white bg-transparent border-0 cursor-pointer"
              >
                Cerrar ✕
              </button>
            </div>
            <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
              <iframe
                src={`${streamIframeUrl(playing.stream_uid)}?autoplay=true`}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                title={playing.title}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
