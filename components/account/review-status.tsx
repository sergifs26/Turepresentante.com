"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Profile } from "@/lib/types";

/** Tarjeta de estado de revisión del perfil en /cuenta: el jugador ve en
 *  qué fase está y desde aquí lo envía a revisión cuando cumple requisitos. */
export default function ReviewStatus({
  profile,
  hasReadyVideo,
}: {
  profile: Profile;
  hasReadyVideo: boolean;
}) {
  const [estado, setEstado] = useState(profile.estado);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Tras un router.refresh() el servidor manda el estado real: mandamos el suyo
  useEffect(() => {
    setEstado(profile.estado);
  }, [profile.estado]);

  const datosCompletos = Boolean(
    profile.nombre?.trim() &&
      profile.posicion &&
      profile.nacimiento &&
      profile.club?.trim() &&
      profile.categoria?.trim()
  );

  const enviar = async () => {
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/revision", { method: "POST" });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        setEstado("en_revision");
      } else {
        setError(data.error ?? "No hemos podido enviar tu perfil. Inténtalo de nuevo.");
      }
    } catch {
      setError("No hemos podido enviar tu perfil. Comprueba tu conexión.");
    } finally {
      setSending(false);
    }
  };

  const Item = ({ ok, children }: { ok: boolean; children: React.ReactNode }) => (
    <li className="flex items-center gap-3 text-[15px] leading-[1.6]">
      <span
        className={`font-mono text-[13px] flex-shrink-0 ${ok ? "text-[#e8ff00]" : "text-white/50"}`}
        aria-hidden="true"
      >
        {ok ? "✓" : "○"}
      </span>
      <span className={ok ? "text-white/80" : "text-white/60"}>{children}</span>
    </li>
  );

  if (estado === "aprobado") {
    return (
      <div className="bio-cell px-7 py-6 md:px-9 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
        <div>
          <span className="font-mono text-[12px] tracking-[0.2em] uppercase text-[#e8ff00]">
            Perfil publicado
          </span>
          <p className="mt-1.5 text-[15px] text-white/75 leading-[1.7]">
            Ya estás en el escaparate. Los vídeos nuevos que subas pasan
            también por revisión antes de hacerse públicos.
          </p>
        </div>
        <Link
          href={`/jugadores/${profile.slug}`}
          className="bio-btn-ghost border border-[#e8ff00]/40 text-[#e8ff00] font-mono text-[12px] tracking-[0.12em] uppercase px-5 py-2.5 no-underline hover:opacity-85"
        >
          Ver mi perfil
        </Link>
      </div>
    );
  }

  if (estado === "en_revision") {
    return (
      <div className="bio-cell px-7 py-7 md:px-9">
        <span className="font-mono text-[12px] tracking-[0.2em] uppercase text-[#e8ff00]">
          Perfil en revisión
        </span>
        <p className="mt-2 text-[16px] text-white/80 leading-[1.75] max-w-[620px]">
          Estamos revisando tu perfil y tus vídeos. Te respondemos en menos de
          72 horas. Mientras tanto puedes seguir puliendo tus datos: los
          cambios entran en la misma revisión.
        </p>
      </div>
    );
  }

  // borrador o rechazado
  return (
    <div className="bio-cell px-7 py-7 md:px-9">
      <span className="font-mono text-[12px] tracking-[0.2em] uppercase text-[#e8ff00]">
        {estado === "rechazado" ? "Revisado" : "Tu perfil no es público todavía"}
      </span>

      {estado === "rechazado" && (
        <div className="mt-3 max-w-[620px]">
          <p className="text-[16px] text-white/85 leading-[1.75]">
            Ahora mismo tu perfil no está publicado. Nuestro apunte:
          </p>
          {profile.revision_notas && (
            <p className="mt-2 text-[15px] text-white/80 leading-[1.75] border-l-2 border-[#e8ff00]/50 pl-4">
              {profile.revision_notas}
            </p>
          )}
          <p className="mt-2 text-[15px] text-white/70 leading-[1.7]">
            Corrige lo que te indicamos y vuelve a enviarlo cuando quieras.
          </p>
        </div>
      )}

      <h3
        className="mt-4 uppercase text-[#f0f0ee] text-[22px] leading-[1.1]"
        style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 900 }}
      >
        Qué hace falta para publicarte
      </h3>
      <ul className="mt-4 flex flex-col gap-2.5">
        <Item ok={datosCompletos}>
          Datos completos: nombre, posición, año de nacimiento, club y categoría
        </Item>
        <Item ok={hasReadyVideo}>
          Al menos un vídeo profesional y editado con tus mejores jugadas
        </Item>
        <Item ok={Boolean(profile.foto_url)}>
          Foto de perfil (recomendada: es tu portada en el escaparate)
        </Item>
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={enviar}
          disabled={sending}
          className="bio-btn bg-[#e8ff00] text-[#0a0a0a] font-mono text-[13px] tracking-[0.1em] uppercase font-medium px-8 py-3.5 cursor-pointer border-0 disabled:opacity-50 disabled:cursor-wait"
        >
          {sending
            ? "Enviando…"
            : estado === "rechazado"
              ? "Reenviar a revisión"
              : "Enviar a revisión"}
        </button>
        <span className="text-[14px] text-white/65">
          Lo revisamos a mano y te respondemos en menos de 72 h.
        </span>
      </div>

      {error && (
        <p className="mt-4 text-[15px] text-red-400/90 border border-red-400/25 bg-red-400/[0.05] px-4 py-3 rounded-2xl inline-block">
          {error}
        </p>
      )}
    </div>
  );
}
