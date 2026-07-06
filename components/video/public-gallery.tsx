"use client";

import { useState } from "react";
import { streamIframeUrl, streamThumbUrl } from "@/lib/supabase/config";
import type { Video } from "@/lib/types";

/** Galería pública: rejilla de miniaturas + reproductor en modal */
export default function PublicGallery({
  videos,
  nombre,
}: {
  videos: Video[];
  nombre: string;
}) {
  const [playing, setPlaying] = useState<Video | null>(null);

  if (videos.length === 0) {
    return (
      <p className="text-[14px] text-white/35 font-light">
        {nombre.split(" ")[0]} todavía no ha publicado vídeos.
      </p>
    );
  }

  return (
    <>
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {videos.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setPlaying(v)}
            className="relative overflow-hidden rounded-tl-[28px] rounded-br-[28px] rounded-tr-[12px] rounded-bl-[12px] border border-white/10 bg-[#111] cursor-pointer p-0 text-left group transition-all duration-500 hover:border-[#e8ff00]/40 hover:shadow-[0_0_32px_rgba(232,255,0,0.12)]"
            aria-label={`Reproducir ${v.title}`}
          >
            <div className="relative" style={{ aspectRatio: "16/9" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={streamThumbUrl(v.stream_uid)}
                alt={v.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-80 group-hover:opacity-100 transition-opacity">
                <span className="w-12 h-12 rounded-full bg-[#e8ff00] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M4 2l10 6-10 6z" fill="#0a0a0a" />
                  </svg>
                </span>
              </span>
              {v.duration && (
                <span className="absolute bottom-2.5 right-2.5 font-mono text-[10px] bg-black/70 text-white/80 px-2 py-0.5 rounded-full">
                  {formatDuration(v.duration)}
                </span>
              )}
            </div>
            <span className="block px-4 py-3 text-[13px] text-white/70 font-light truncate">
              {v.title}
            </span>
          </button>
        ))}
      </div>

      {playing && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-5"
          onClick={() => setPlaying(null)}
        >
          <div className="w-full max-w-[960px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[14px] text-white/70 font-light truncate pr-4">
                {playing.title}
              </span>
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
    </>
  );
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
