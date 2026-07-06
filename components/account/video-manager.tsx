"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { streamThumbUrl, streamIframeUrl } from "@/lib/supabase/config";
import type { Video } from "@/lib/types";

const MAX_MB = 500;

export default function VideoManager() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadPct, setUploadPct] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState<Video | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/videos");
      const data = (await res.json()) as { ok: boolean; videos: Video[] };
      if (data.ok) setVideos(data.videos);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Mientras haya vídeos procesándose, consultamos cada 6 s
  useEffect(() => {
    if (!videos.some((v) => v.status === "processing")) return;
    const t = setInterval(refresh, 6000);
    return () => clearInterval(t);
  }, [videos, refresh]);

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
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setVideos((v) => [data.video!, ...v]);
        } else {
          setError("La subida ha fallado a mitad. Inténtalo de nuevo.");
        }
        resolve();
      };
      xhr.onerror = () => {
        setError("La subida ha fallado. Comprueba tu conexión.");
        resolve();
      };
      xhr.send(form);
    });
    setUploadPct(null);
  };

  const onDelete = async (v: Video) => {
    if (!confirm(`¿Borrar "${v.title}" de tu galería?`)) return;
    setVideos((list) => list.filter((x) => x.id !== v.id));
    const res = await fetch(`/api/videos/${v.id}`, { method: "DELETE" });
    if (!res.ok) refresh();
  };

  return (
    <div>
      {/* Zona de subida */}
      <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={onFile} />
      {uploadPct === null ? (
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
          <span className="block mt-2 text-[12px] text-white/35 font-light">
            MP4, MOV o WebM · hasta {MAX_MB} MB · mejor clips de 1-5 minutos
          </span>
        </button>
      ) : (
        <div className="bio-cell w-full px-7 py-9">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#e8ff00]">
              Subiendo vídeo…
            </span>
            <span className="font-mono text-[12px] text-white/60">{uploadPct}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#e8ff00] rounded-full transition-[width] duration-300"
              style={{ width: `${uploadPct}%` }}
            />
          </div>
          <p className="mt-3 text-[12px] text-white/30 font-light">
            No cierres esta página hasta que termine.
          </p>
        </div>
      )}

      {error && (
        <p className="mt-4 text-[13px] text-red-400/90 font-light border border-red-400/25 bg-red-400/[0.05] px-4 py-3 rounded-2xl">
          {error}
        </p>
      )}

      {/* Galería */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading && (
          <p className="text-[13px] text-white/30 font-light col-span-full">Cargando tu galería…</p>
        )}
        {!loading && videos.length === 0 && (
          <p className="text-[13px] text-white/30 font-light col-span-full">
            Tu galería está vacía. Sube tu primer vídeo: es lo primero que
            miran los clubes.
          </p>
        )}
        {videos.map((v) => (
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
                </button>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <span className="bio-node" aria-hidden="true" />
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/40">
                    {v.status === "error" ? "Error al procesar" : "Procesando…"}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-[13px] text-white/70 font-light truncate pr-3">
                {v.title}
              </span>
              <button
                type="button"
                onClick={() => onDelete(v)}
                className="font-mono text-[9px] tracking-[0.15em] uppercase text-white/25 hover:text-red-400/90 transition-colors bg-transparent border-0 cursor-pointer flex-shrink-0"
              >
                Borrar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reproductor */}
      {playing && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-5"
          onClick={() => setPlaying(null)}
        >
          <div className="w-full max-w-[960px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[14px] text-white/70 font-light truncate pr-4">{playing.title}</span>
              <button
                type="button"
                onClick={() => setPlaying(null)}
                className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/50 hover:text-white bg-transparent border-0 cursor-pointer"
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
