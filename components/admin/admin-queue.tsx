"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { streamThumbUrl, streamIframeUrl } from "@/lib/supabase/config";
import type { Profile, Video } from "@/lib/types";

export type PerfilPendiente = {
  profile: Profile;
  videos: Video[];
  telefono: string | null;
};

export type VideoPendiente = {
  video: Video;
  nombre: string;
  slug: string;
};

function fmt(seconds: number) {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

const heading = {
  fontFamily: "var(--font-barlow-condensed)",
  fontWeight: 900,
} as const;

export default function AdminQueue({
  cola,
  videosSueltos,
}: {
  cola: PerfilPendiente[];
  videosSueltos: VideoPendiente[];
}) {
  const [perfiles, setPerfiles] = useState(cola);
  const [sueltos, setSueltos] = useState(videosSueltos);
  const [rechazando, setRechazando] = useState<string | null>(null);
  const [motivo, setMotivo] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState<Video | null>(null);
  const router = useRouter();

  // Tras router.refresh() el servidor manda listas frescas: resincronizamos
  useEffect(() => setPerfiles(cola), [cola]);
  useEffect(() => setSueltos(videosSueltos), [videosSueltos]);

  // Cerrar el reproductor con Escape
  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPlaying(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing]);

  const fallo = (msg: string) => {
    setError(msg);
    router.refresh();
  };

  const aprobarPerfil = async (p: PerfilPendiente) => {
    const supabase = createClient();
    if (!supabase) return;
    setError("");
    setBusy(p.profile.user_id);
    // 1) Perfil aprobado; 2) sus vídeos listos, publicados de una vez
    const { data: filas, error: e1 } = await supabase
      .from("profiles")
      .update({
        estado: "aprobado",
        revisado_at: new Date().toISOString(),
        revision_notas: null,
      })
      .eq("user_id", p.profile.user_id)
      .eq("estado", "en_revision")
      .select("user_id");
    if (e1 || !filas || filas.length === 0) {
      setBusy(null);
      fallo(
        e1
          ? "No se ha podido aprobar. Recarga y prueba de nuevo."
          : "Este perfil ya lo ha procesado otro admin. Actualizando la cola…"
      );
      return;
    }
    const { error: e2 } = await supabase
      .from("videos")
      .update({ revision: "aprobado" })
      .eq("user_id", p.profile.user_id)
      .eq("status", "ready")
      .eq("revision", "pendiente");
    setBusy(null);
    setPerfiles((list) => list.filter((x) => x.profile.user_id !== p.profile.user_id));
    if (e2) {
      // El perfil YA está aprobado: lo decimos tal cual para no confundir
      setError(
        "Perfil aprobado, pero sus vídeos no se han podido aprobar en bloque: apruébalos en la sección de vídeos pendientes."
      );
    }
    router.refresh();
  };

  const rechazarPerfil = async (p: PerfilPendiente) => {
    if (!motivo.trim()) {
      setError("Escribe el motivo: el jugador lo verá en su panel.");
      return;
    }
    const supabase = createClient();
    if (!supabase) return;
    setError("");
    setBusy(p.profile.user_id);
    const { data: filas, error: e } = await supabase
      .from("profiles")
      .update({
        estado: "rechazado",
        revisado_at: new Date().toISOString(),
        revision_notas: motivo.trim(),
      })
      .eq("user_id", p.profile.user_id)
      .eq("estado", "en_revision")
      .select("user_id");
    setBusy(null);
    if (e || !filas || filas.length === 0) {
      fallo(
        e
          ? "No se ha podido rechazar. Recarga y prueba de nuevo."
          : "Este perfil ya lo ha procesado otro admin. Actualizando la cola…"
      );
      return;
    }
    setRechazando(null);
    setMotivo("");
    setPerfiles((list) => list.filter((x) => x.profile.user_id !== p.profile.user_id));
    router.refresh();
  };

  const moderarVideo = async (v: VideoPendiente, aprobar: boolean) => {
    const supabase = createClient();
    if (!supabase) return;
    setError("");
    setBusy(v.video.id);
    const { data: filas, error: e } = await supabase
      .from("videos")
      .update({ revision: aprobar ? "aprobado" : "rechazado" })
      .eq("id", v.video.id)
      .eq("revision", "pendiente")
      .select("id");
    setBusy(null);
    if (e || !filas || filas.length === 0) {
      fallo(
        e
          ? "No se ha podido guardar. Recarga y prueba de nuevo."
          : "Este vídeo ya lo ha procesado otro admin. Actualizando la cola…"
      );
      return;
    }
    setSueltos((list) => list.filter((x) => x.video.id !== v.video.id));
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-14">
      {error && (
        <p className="text-[15px] text-red-400/90 border border-red-400/25 bg-red-400/[0.05] px-4 py-3 rounded-2xl">
          {error}
        </p>
      )}

      {/* Cola de perfiles */}
      <div>
        <h2 className="uppercase text-[#f0f0ee] text-[26px] leading-[1.1] mb-6" style={heading}>
          Perfiles pendientes <span className="text-[#e8ff00]">({perfiles.length})</span>
        </h2>

        {perfiles.length === 0 ? (
          <p className="text-[15px] text-white/65">
            Nada pendiente. Cuando un jugador envíe su perfil a revisión,
            aparecerá aquí (y te llegará un aviso a info@).
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {perfiles.map((p) => {
              const d = p.profile;
              const listos = p.videos.filter((v) => v.status === "ready");
              const total = listos.reduce((s, v) => s + (Number(v.duration) || 0), 0);
              const chips = [
                d.posicion,
                d.nacimiento ? `Nac. ${d.nacimiento}` : null,
                d.club,
                d.categoria,
                d.ciudad,
                d.pierna,
              ].filter(Boolean);
              return (
                <article key={d.user_id} className="bio-cell px-6 py-6 md:px-8 md:py-7">
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div className="flex items-center gap-4 min-w-0">
                      {d.foto_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={d.foto_url}
                          alt={`Foto de ${d.nombre}`}
                          className="w-[64px] h-[64px] rounded-full object-cover border border-white/15 flex-shrink-0"
                        />
                      ) : (
                        <span className="w-[64px] h-[64px] rounded-full bg-white/[0.06] border border-white/15 flex items-center justify-center flex-shrink-0 text-[24px] text-white/60">
                          {d.nombre?.[0]?.toUpperCase() ?? "?"}
                        </span>
                      )}
                      <div className="min-w-0">
                        <h3
                          className="uppercase text-[#f0f0ee] text-[24px] leading-[1.05] truncate"
                          style={heading}
                        >
                          {d.nombre}
                        </h3>
                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                          {chips.map((c) => (
                            <span key={c as string} className="font-mono text-[11px] tracking-[0.1em] uppercase text-white/65">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                      {p.telefono && (
                        <a
                          href={`tel:${p.telefono.replace(/\s+/g, "")}`}
                          className="font-mono text-[13px] text-[#e8ff00] no-underline hover:opacity-80"
                        >
                          {p.telefono}
                        </a>
                      )}
                      <Link
                        href={`/jugadores/${d.slug}`}
                        className="font-mono text-[11px] tracking-[0.15em] uppercase text-white/70 no-underline hover:text-white/90"
                      >
                        Ver perfil →
                      </Link>
                    </div>
                  </div>

                  {d.bio && (
                    <p className="mt-4 text-[15px] text-white/75 leading-[1.7] max-w-[680px]">{d.bio}</p>
                  )}

                  {/* Vídeos del jugador */}
                  <div className="mt-5">
                    <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-white/60">
                      Vídeos listos: {listos.length} · {fmt(total)} en total
                    </span>
                    {listos.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-3">
                        {listos.map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setPlaying(v)}
                            className="relative w-[168px] rounded-xl overflow-hidden border border-white/10 cursor-pointer p-0 bg-transparent"
                            aria-label={`Reproducir ${v.title}`}
                          >
                            <span className="block relative" style={{ aspectRatio: "16/9" }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={streamThumbUrl(v.stream_uid)}
                                alt={v.title}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              {v.duration != null && (
                                <span className="absolute bottom-1.5 right-1.5 font-mono text-[10px] text-white/90 bg-black/60 rounded-full px-2 py-0.5">
                                  {fmt(Number(v.duration))}
                                </span>
                              )}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  {rechazando === d.user_id ? (
                    <div className="mt-5 max-w-[560px]">
                      <label
                        className="block font-mono text-[12px] tracking-[0.15em] uppercase text-white/75 mb-2"
                        htmlFor={`motivo-${d.user_id}`}
                      >
                        Motivo del rechazo (lo verá el jugador)
                      </label>
                      <textarea
                        id={`motivo-${d.user_id}`}
                        rows={3}
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        className="bio-input w-full bg-white/[0.04] border border-white/10 text-[#f0f0ee] text-[15px] px-4 py-3 outline-none focus:border-[#e8ff00] placeholder:text-white/50 resize-y"
                        placeholder="Ej. El vídeo no está editado: junta tus mejores jugadas en un clip de 3-5 minutos y reenvíalo."
                      />
                      <div className="mt-3 flex gap-3">
                        <button
                          type="button"
                          disabled={busy === d.user_id}
                          onClick={() => rechazarPerfil(p)}
                          className="bio-btn bg-red-400/90 text-[#0a0a0a] font-mono text-[12px] tracking-[0.1em] uppercase font-medium px-6 py-3 cursor-pointer border-0 disabled:opacity-50"
                        >
                          Confirmar rechazo
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRechazando(null);
                            setMotivo("");
                          }}
                          className="bio-btn-ghost border border-white/20 text-white/75 font-mono text-[12px] tracking-[0.1em] uppercase px-6 py-3 bg-transparent cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        disabled={busy === d.user_id}
                        onClick={() => aprobarPerfil(p)}
                        className="bio-btn bg-[#e8ff00] text-[#0a0a0a] font-mono text-[12px] tracking-[0.1em] uppercase font-medium px-7 py-3 cursor-pointer border-0 disabled:opacity-50"
                      >
                        {busy === d.user_id ? "Guardando…" : "Aprobar y publicar"}
                      </button>
                      <button
                        type="button"
                        disabled={busy === d.user_id}
                        onClick={() => {
                          setRechazando(d.user_id);
                          setMotivo("");
                          setError("");
                        }}
                        className="bio-btn-ghost border border-red-400/40 text-red-400/90 font-mono text-[12px] tracking-[0.1em] uppercase px-7 py-3 bg-transparent cursor-pointer disabled:opacity-50"
                      >
                        Rechazar…
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Vídeos nuevos de perfiles ya aprobados */}
      <div>
        <h2 className="uppercase text-[#f0f0ee] text-[26px] leading-[1.1] mb-6" style={heading}>
          Vídeos nuevos pendientes <span className="text-[#e8ff00]">({sueltos.length})</span>
        </h2>
        {sueltos.length === 0 ? (
          <p className="text-[15px] text-white/65">
            No hay vídeos nuevos esperando. Los vídeos que suban los jugadores
            ya publicados aparecen aquí antes de hacerse públicos.
          </p>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {sueltos.map((s) => (
              <div
                key={s.video.id}
                className="rounded-tl-[24px] rounded-br-[24px] rounded-tr-[10px] rounded-bl-[10px] border border-white/10 bg-[#111] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setPlaying(s.video)}
                  className="block relative w-full cursor-pointer p-0 bg-transparent border-0"
                  style={{ aspectRatio: "16/9" }}
                  aria-label={`Reproducir ${s.video.title}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={streamThumbUrl(s.video.stream_uid)}
                    alt={s.video.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {s.video.duration != null && (
                    <span className="absolute bottom-2 right-2 font-mono text-[11px] text-white/90 bg-black/60 rounded-full px-2.5 py-1">
                      {fmt(Number(s.video.duration))}
                    </span>
                  )}
                </button>
                <div className="px-4 py-3">
                  <p className="text-[14px] text-white/85 truncate">{s.video.title}</p>
                  <Link
                    href={`/jugadores/${s.slug}`}
                    className="font-mono text-[11px] tracking-[0.1em] uppercase text-white/60 no-underline hover:text-white/85"
                  >
                    {s.nombre} →
                  </Link>
                  <div className="mt-3 flex gap-2.5">
                    <button
                      type="button"
                      disabled={busy === s.video.id}
                      onClick={() => moderarVideo(s, true)}
                      className="bio-btn bg-[#e8ff00] text-[#0a0a0a] font-mono text-[11px] tracking-[0.1em] uppercase font-medium px-4 py-2 cursor-pointer border-0 disabled:opacity-50"
                    >
                      Aprobar
                    </button>
                    <button
                      type="button"
                      disabled={busy === s.video.id}
                      onClick={() => moderarVideo(s, false)}
                      className="bio-btn-ghost border border-red-400/40 text-red-400/90 font-mono text-[11px] tracking-[0.1em] uppercase px-4 py-2 bg-transparent cursor-pointer disabled:opacity-50"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
