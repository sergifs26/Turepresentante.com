"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { streamThumbUrl, streamIframeUrl } from "@/lib/supabase/config";
import type { Profile, Video } from "@/lib/types";

export type Contacto = { telefono: string | null; email: string | null };

export type PerfilPendiente = {
  profile: Profile;
  videos: Video[];
  contacto: Contacto;
};

export type PerfilRevisado = {
  profile: Profile;
  contacto: Contacto;
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

/** dd/mm/aaaa a partir del ISO, sin depender de la zona del navegador */
function fecha(iso: string | null) {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

/** Número en formato internacional para el enlace de WhatsApp */
function waNumero(telefono: string) {
  let n = telefono.replace(/\D/g, "");
  if (n.startsWith("00")) n = n.slice(2);
  if (n.length === 9) n = `34${n}`; // móvil español sin prefijo
  return n;
}

const heading = {
  fontFamily: "var(--font-barlow-condensed)",
  fontWeight: 900,
} as const;

const btnGhost =
  "bio-btn-ghost border border-white/20 text-white/80 font-mono text-[11px] tracking-[0.1em] uppercase px-4 py-2 no-underline hover:border-[#e8ff00]/50 hover:text-white transition-colors";

const inputBase =
  "bio-input w-full bg-white/[0.04] border border-white/10 text-[#f0f0ee] text-[15px] px-4 py-3 outline-none focus:border-[#e8ff00] placeholder:text-white/50";

/** Aviso de error junto a la acción que lo provocó (no al principio de la página) */
function Aviso({ texto }: { texto: string }) {
  return (
    <p className="mt-4 text-[15px] text-red-400/90 border border-red-400/25 bg-red-400/[0.05] px-4 py-3 rounded-2xl">
      {texto}
    </p>
  );
}

/** Botones de contacto: escribes tú, cuando quieras */
function Contactar({ contacto, nombre }: { contacto: Contacto; nombre: string }) {
  const primer = nombre?.split(" ")[0] ?? "";
  const asunto = encodeURIComponent("Tu perfil en Turepresentante");
  const cuerpo = encodeURIComponent(`Hola ${primer},\n\n`);
  const waTexto = encodeURIComponent(`Hola ${primer}, te escribo de Turepresentante.`);

  if (!contacto.email && !contacto.telefono) {
    return (
      <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-white/45">
        Sin datos de contacto
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {contacto.email && (
        <a href={`mailto:${contacto.email}?subject=${asunto}&body=${cuerpo}`} className={btnGhost}>
          ✉ Email
        </a>
      )}
      {contacto.telefono && (
        <>
          <a
            href={`https://wa.me/${waNumero(contacto.telefono)}?text=${waTexto}`}
            target="_blank"
            rel="noopener noreferrer"
            className={btnGhost}
          >
            WhatsApp
          </a>
          <a href={`tel:${contacto.telefono.replace(/\s+/g, "")}`} className={btnGhost}>
            Llamar
          </a>
        </>
      )}
    </div>
  );
}

/** Ficha de datos: todo lo que el jugador ha rellenado, de un vistazo */
function Ficha({
  profile,
  contacto,
  anioActual,
  extra,
}: {
  profile: Profile;
  contacto: Contacto;
  anioActual: number;
  extra?: { k: string; v: string }[];
}) {
  const edad = profile.nacimiento ? anioActual - profile.nacimiento : null;
  const datos: { k: string; v: string }[] = [
    { k: "Posición", v: profile.posicion ?? "—" },
    { k: "Pierna", v: profile.pierna ?? "—" },
    { k: "Nacimiento", v: profile.nacimiento ? `${profile.nacimiento} (${edad} años)` : "—" },
    { k: "Club", v: profile.club ?? "—" },
    { k: "Categoría", v: profile.categoria ?? "—" },
    { k: "Ciudad", v: profile.ciudad ?? "—" },
    { k: "Email", v: contacto.email ?? "—" },
    { k: "Teléfono", v: contacto.telefono ?? "—" },
    { k: "Registrado", v: fecha(profile.created_at) },
    { k: "Foto", v: profile.foto_url ? "Sí" : "No" },
    ...(extra ?? []),
  ];

  return (
    <dl
      className="mt-5 grid gap-x-6 gap-y-3.5"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}
    >
      {datos.map((d) => (
        <div key={d.k} className="min-w-0">
          <dt className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50">{d.k}</dt>
          <dd className="mt-1 text-[15px] text-white/85 leading-[1.45] break-words">{d.v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Avatar circular con inicial de reserva */
function Avatar({ profile, size }: { profile: Profile; size: number }) {
  if (profile.foto_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={profile.foto_url}
        alt={`Foto de ${profile.nombre}`}
        className="rounded-full object-cover border border-white/15 flex-shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className="rounded-full bg-white/[0.06] border border-white/15 flex items-center justify-center flex-shrink-0 text-white/60"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {profile.nombre?.[0]?.toUpperCase() ?? "?"}
    </span>
  );
}

/** Formulario de motivo. A NIVEL DE MÓDULO: si se declarase dentro de
 *  AdminQueue, React lo remontaría en cada tecla y el textarea perdería
 *  el foco letra a letra. */
function FormMotivo({
  perfilId,
  etiqueta,
  motivo,
  onMotivo,
  onConfirmar,
  onCancelar,
  ocupado,
  error,
}: {
  perfilId: string;
  etiqueta: string;
  motivo: string;
  onMotivo: (v: string) => void;
  onConfirmar: () => void;
  onCancelar: () => void;
  ocupado: boolean;
  error: string;
}) {
  return (
    <div className="mt-5 max-w-[560px]">
      <label
        className="block font-mono text-[12px] tracking-[0.15em] uppercase text-white/75 mb-2"
        htmlFor={`motivo-${perfilId}`}
      >
        Motivo (lo verá el jugador en su panel)
      </label>
      <textarea
        id={`motivo-${perfilId}`}
        rows={3}
        autoFocus
        value={motivo}
        onChange={(e) => onMotivo(e.target.value)}
        className={`${inputBase} resize-y`}
        placeholder="Ej. El vídeo no está editado: junta tus mejores jugadas en un clip de 3-5 minutos y reenvíalo."
      />
      <div className="mt-3 flex gap-3">
        <button
          type="button"
          disabled={ocupado}
          onClick={onConfirmar}
          className="bio-btn bg-red-400/90 text-[#0a0a0a] font-mono text-[12px] tracking-[0.1em] uppercase font-medium px-6 py-3 cursor-pointer border-0 disabled:opacity-50"
        >
          {ocupado ? "Guardando…" : etiqueta}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="bio-btn-ghost border border-white/20 text-white/75 font-mono text-[12px] tracking-[0.1em] uppercase px-6 py-3 bg-transparent cursor-pointer"
        >
          Cancelar
        </button>
      </div>
      {error && <Aviso texto={error} />}
    </div>
  );
}

export default function AdminQueue({
  cola,
  videosSueltos,
  revisados,
  anioActual,
}: {
  cola: PerfilPendiente[];
  videosSueltos: VideoPendiente[];
  revisados: PerfilRevisado[];
  anioActual: number;
}) {
  const [perfiles, setPerfiles] = useState(cola);
  const [sueltos, setSueltos] = useState(videosSueltos);
  const [hechos, setHechos] = useState(revisados);
  const [rechazando, setRechazando] = useState<string | null>(null);
  const [motivo, setMotivo] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<{ id: string; texto: string } | null>(null);
  const [playing, setPlaying] = useState<Video | null>(null);
  const [filtro, setFiltro] = useState("");
  const router = useRouter();

  // Tras router.refresh() el servidor manda listas frescas: resincronizamos
  useEffect(() => setPerfiles(cola), [cola]);
  useEffect(() => setSueltos(videosSueltos), [videosSueltos]);
  useEffect(() => setHechos(revisados), [revisados]);

  // Cerrar el reproductor con Escape
  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPlaying(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing]);

  const errorDe = (id: string) => (error?.id === id ? error.texto : "");

  const fallo = (id: string, texto: string) => {
    setError({ id, texto });
    setRechazando(null);
    setMotivo("");
    router.refresh();
  };

  /** Quita el perfil de la cola y lo pone arriba de "Ya revisados" */
  const moverARevisados = (
    perfil: Profile,
    contacto: Contacto,
    estado: Profile["estado"],
    notas: string | null
  ) => {
    const actualizado: Profile = {
      ...perfil,
      estado,
      revision_notas: notas,
      revisado_at: new Date().toISOString(),
    };
    setPerfiles((list) => list.filter((x) => x.profile.user_id !== perfil.user_id));
    setHechos((list) => [
      { profile: actualizado, contacto },
      ...list.filter((x) => x.profile.user_id !== perfil.user_id),
    ]);
  };

  /** Aprueba el perfil y publica de una vez sus vídeos ya listos */
  const aprobar = async (
    profile: Profile,
    contacto: Contacto,
    estadoEsperado: Profile["estado"]
  ) => {
    const supabase = createClient();
    if (!supabase) return;
    setError(null);
    setBusy(profile.user_id);
    const { data: filas, error: e1 } = await supabase
      .from("profiles")
      .update({
        estado: "aprobado",
        revisado_at: new Date().toISOString(),
        revision_notas: null,
      })
      .eq("user_id", profile.user_id)
      .eq("estado", estadoEsperado)
      .select("user_id");
    if (e1 || !filas || filas.length === 0) {
      setBusy(null);
      fallo(
        profile.user_id,
        e1
          ? "No se ha podido aprobar. Recarga y prueba de nuevo."
          : "Este perfil ya lo ha procesado otro admin. Actualizando…"
      );
      return;
    }
    const { error: e2 } = await supabase
      .from("videos")
      .update({ revision: "aprobado" })
      .eq("user_id", profile.user_id)
      .eq("status", "ready")
      .eq("revision", "pendiente");
    setBusy(null);
    moverARevisados(profile, contacto, "aprobado", null);
    if (e2) {
      // El perfil YA está aprobado: lo decimos tal cual para no confundir
      setError({
        id: profile.user_id,
        texto:
          "Perfil aprobado, pero sus vídeos no se han podido publicar en bloque: apruébalos en la sección de vídeos.",
      });
    }
    router.refresh();
  };

  /** Rechaza (o retira del escaparate) con un motivo que verá el jugador */
  const rechazar = async (profile: Profile, contacto: Contacto) => {
    if (!motivo.trim()) {
      setError({ id: profile.user_id, texto: "Escribe el motivo: el jugador lo verá en su panel." });
      return;
    }
    const supabase = createClient();
    if (!supabase) return;
    const texto = motivo.trim();
    setError(null);
    setBusy(profile.user_id);
    const { data: filas, error: e } = await supabase
      .from("profiles")
      .update({
        estado: "rechazado",
        revisado_at: new Date().toISOString(),
        revision_notas: texto,
      })
      .eq("user_id", profile.user_id)
      .neq("estado", "rechazado")
      .select("user_id");
    setBusy(null);
    if (e || !filas || filas.length === 0) {
      fallo(
        profile.user_id,
        e
          ? "No se ha podido guardar. Recarga y prueba de nuevo."
          : "Este perfil ya lo ha procesado otro admin. Actualizando…"
      );
      return;
    }
    setRechazando(null);
    setMotivo("");
    moverARevisados(profile, contacto, "rechazado", texto);
    router.refresh();
  };

  const moderarVideo = async (v: VideoPendiente, aprobarVideo: boolean) => {
    if (!aprobarVideo && !confirm(`¿Rechazar el vídeo "${v.video.title}" de ${v.nombre}?`)) return;
    const supabase = createClient();
    if (!supabase) return;
    const desde = v.video.revision;
    setError(null);
    setBusy(v.video.id);
    const { data: filas, error: e } = await supabase
      .from("videos")
      .update({ revision: aprobarVideo ? "aprobado" : "rechazado" })
      .eq("id", v.video.id)
      .eq("revision", desde)
      .select("id");
    setBusy(null);
    if (e || !filas || filas.length === 0) {
      fallo(
        v.video.id,
        e
          ? "No se ha podido guardar. Recarga y prueba de nuevo."
          : "Este vídeo ya lo ha procesado otro admin. Actualizando…"
      );
      return;
    }
    if (aprobarVideo) {
      setSueltos((list) => list.filter((x) => x.video.id !== v.video.id));
    } else {
      // Sigue a la vista, marcado, para poder rectificar
      setSueltos((list) =>
        list.map((x) =>
          x.video.id === v.video.id ? { ...x, video: { ...x.video, revision: "rechazado" } } : x
        )
      );
    }
    router.refresh();
  };

  const hechosFiltrados = useMemo(() => {
    const q = filtro.trim().toLowerCase();
    if (!q) return hechos;
    return hechos.filter((h) =>
      [h.profile.nombre, h.profile.club, h.profile.ciudad, h.profile.categoria, h.contacto.email]
        .filter(Boolean)
        .some((campo) => (campo as string).toLowerCase().includes(q))
    );
  }, [hechos, filtro]);

  return (
    <div className="flex flex-col gap-14">
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
              return (
                <article key={d.user_id} className="bio-cell px-6 py-6 md:px-8 md:py-7">
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div className="flex items-center gap-4 min-w-0">
                      <Avatar profile={d} size={72} />
                      <div className="min-w-0">
                        <h3
                          className="uppercase text-[#f0f0ee] text-[26px] leading-[1.05]"
                          style={heading}
                        >
                          {d.nombre}
                        </h3>
                        <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-white/55">
                          En cola desde {fecha(d.enviado_revision_at)}
                        </span>
                      </div>
                    </div>
                    <Link href={`/jugadores/${d.slug}`} className={btnGhost}>
                      Ver perfil →
                    </Link>
                  </div>

                  <Ficha
                    profile={d}
                    contacto={p.contacto}
                    anioActual={anioActual}
                    extra={[{ k: "Vídeos", v: `${listos.length} · ${fmt(total)}` }]}
                  />

                  {d.bio && (
                    <div className="mt-5">
                      <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50">
                        Sobre él
                      </span>
                      <p className="mt-1 text-[15px] text-white/80 leading-[1.7] max-w-[680px]">
                        {d.bio}
                      </p>
                    </div>
                  )}

                  <div className="mt-5">
                    <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50 block mb-2">
                      Escribirle
                    </span>
                    <Contactar contacto={p.contacto} nombre={d.nombre} />
                  </div>

                  {/* Vídeos del jugador */}
                  {listos.length > 0 && (
                    <div className="mt-6">
                      <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50 block mb-2.5">
                        Sus vídeos
                      </span>
                      <div className="flex flex-wrap gap-3">
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
                    </div>
                  )}

                  {/* Acciones */}
                  {rechazando === d.user_id ? (
                    <FormMotivo
                      perfilId={d.user_id}
                      etiqueta="Confirmar rechazo"
                      motivo={motivo}
                      onMotivo={setMotivo}
                      onConfirmar={() => rechazar(d, p.contacto)}
                      onCancelar={() => {
                        setRechazando(null);
                        setMotivo("");
                        setError(null);
                      }}
                      ocupado={busy === d.user_id}
                      error={errorDe(d.user_id)}
                    />
                  ) : (
                    <>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          type="button"
                          disabled={busy === d.user_id}
                          onClick={() => aprobar(d, p.contacto, "en_revision")}
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
                            setError(null);
                          }}
                          className="bio-btn-ghost border border-red-400/40 text-red-400/90 font-mono text-[12px] tracking-[0.1em] uppercase px-7 py-3 bg-transparent cursor-pointer disabled:opacity-50"
                        >
                          Rechazar…
                        </button>
                      </div>
                      {errorDe(d.user_id) && <Aviso texto={errorDe(d.user_id)} />}
                    </>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Vídeos de perfiles ya aprobados */}
      <div>
        <h2 className="uppercase text-[#f0f0ee] text-[26px] leading-[1.1] mb-6" style={heading}>
          Vídeos por revisar{" "}
          <span className="text-[#e8ff00]">
            ({sueltos.filter((s) => s.video.revision === "pendiente").length})
          </span>
        </h2>
        {sueltos.length === 0 ? (
          <p className="text-[15px] text-white/65">
            No hay vídeos esperando. Los que suban los jugadores ya publicados
            aparecen aquí antes de hacerse públicos.
          </p>
        ) : (
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
          >
            {sueltos.map((s) => {
              const rechazado = s.video.revision === "rechazado";
              return (
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
                      className={`absolute inset-0 w-full h-full object-cover ${rechazado ? "opacity-40" : ""}`}
                    />
                    {s.video.duration != null && (
                      <span className="absolute bottom-2 right-2 font-mono text-[11px] text-white/90 bg-black/60 rounded-full px-2.5 py-1">
                        {fmt(Number(s.video.duration))}
                      </span>
                    )}
                    {rechazado && (
                      <span className="absolute top-2 left-2 font-mono text-[10px] tracking-[0.15em] uppercase text-red-400/90 bg-black/70 rounded-full px-2.5 py-1">
                        Rechazado
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
                        {rechazado ? "Recuperar" : "Aprobar"}
                      </button>
                      {!rechazado && (
                        <button
                          type="button"
                          disabled={busy === s.video.id}
                          onClick={() => moderarVideo(s, false)}
                          className="bio-btn-ghost border border-red-400/40 text-red-400/90 font-mono text-[11px] tracking-[0.1em] uppercase px-4 py-2 bg-transparent cursor-pointer disabled:opacity-50"
                        >
                          Rechazar
                        </button>
                      )}
                    </div>
                    {errorDe(s.video.id) && <Aviso texto={errorDe(s.video.id)} />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ya revisados: para escribirles y para rectificar */}
      <div>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <h2 className="uppercase text-[#f0f0ee] text-[26px] leading-[1.1]" style={heading}>
            Ya revisados{" "}
            <span className="text-[#e8ff00]">
              ({hechosFiltrados.length}
              {filtro ? ` de ${hechos.length}` : ""})
            </span>
          </h2>
          {hechos.length > 0 && (
            <input
              type="search"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className={`${inputBase} max-w-[280px]`}
              placeholder="Buscar por nombre, club, ciudad…"
              aria-label="Buscar entre los jugadores ya revisados"
            />
          )}
        </div>

        {hechos.length === 0 ? (
          <p className="text-[15px] text-white/65">
            Aquí aparecerán los jugadores que ya hayas aprobado o rechazado,
            con sus datos de contacto y la opción de cambiar de decisión.
          </p>
        ) : hechosFiltrados.length === 0 ? (
          <p className="text-[15px] text-white/65">Ningún jugador coincide con «{filtro}».</p>
        ) : (
          <div className="flex flex-col gap-4">
            {hechosFiltrados.map((h) => {
              const d = h.profile;
              const aprobado = d.estado === "aprobado";
              return (
                <article
                  key={d.user_id}
                  className="border border-white/10 rounded-tl-[24px] rounded-br-[24px] rounded-tr-[10px] rounded-bl-[10px] px-6 py-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <Avatar profile={d} size={48} />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3
                            className="uppercase text-[#f0f0ee] text-[22px] leading-[1.05]"
                            style={heading}
                          >
                            {d.nombre}
                          </h3>
                          <span
                            className={`font-mono text-[10px] tracking-[0.18em] uppercase ${aprobado ? "text-[#e8ff00]" : "text-red-400/90"}`}
                          >
                            {aprobado ? "Publicado" : "No publicado"}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-white/50">
                          Revisado el {fecha(d.revisado_at)}
                        </span>
                      </div>
                    </div>
                    <Link href={`/jugadores/${d.slug}`} className={btnGhost}>
                      Ver perfil →
                    </Link>
                  </div>

                  <Ficha profile={d} contacto={h.contacto} anioActual={anioActual} />

                  {!aprobado && d.revision_notas && (
                    <p className="mt-4 text-[14px] text-white/70 leading-[1.7] border-l-2 border-red-400/40 pl-4 max-w-[620px]">
                      Tu motivo: {d.revision_notas}
                    </p>
                  )}

                  <div className="mt-5">
                    <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50 block mb-2">
                      Escribirle
                    </span>
                    <Contactar contacto={h.contacto} nombre={d.nombre} />
                  </div>

                  {rechazando === d.user_id ? (
                    <FormMotivo
                      perfilId={d.user_id}
                      etiqueta="Retirar del escaparate"
                      motivo={motivo}
                      onMotivo={setMotivo}
                      onConfirmar={() => rechazar(d, h.contacto)}
                      onCancelar={() => {
                        setRechazando(null);
                        setMotivo("");
                        setError(null);
                      }}
                      ocupado={busy === d.user_id}
                      error={errorDe(d.user_id)}
                    />
                  ) : (
                    <>
                      <div className="mt-5 flex flex-wrap gap-3">
                        {aprobado ? (
                          <button
                            type="button"
                            disabled={busy === d.user_id}
                            onClick={() => {
                              setRechazando(d.user_id);
                              setMotivo("");
                              setError(null);
                            }}
                            className="bio-btn-ghost border border-red-400/40 text-red-400/90 font-mono text-[12px] tracking-[0.1em] uppercase px-6 py-2.5 bg-transparent cursor-pointer disabled:opacity-50"
                          >
                            Retirar del escaparate…
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={busy === d.user_id}
                            onClick={() => aprobar(d, h.contacto, "rechazado")}
                            className="bio-btn bg-[#e8ff00] text-[#0a0a0a] font-mono text-[12px] tracking-[0.1em] uppercase font-medium px-6 py-2.5 cursor-pointer border-0 disabled:opacity-50"
                          >
                            {busy === d.user_id ? "Guardando…" : "Aprobar y publicar"}
                          </button>
                        )}
                      </div>
                      {errorDe(d.user_id) && <Aviso texto={errorDe(d.user_id)} />}
                    </>
                  )}
                </article>
              );
            })}
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
