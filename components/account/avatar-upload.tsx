"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

const MAX_FILE_MB = 10;

/** Reduce la imagen a un máximo de 800px de lado y la convierte a JPEG:
 *  una foto de móvil de 8 MB queda en ~100 KB sin pérdida visible */
async function comprimir(file: File, maxSide = 800): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("blob"))),
      "image/jpeg",
      0.85
    )
  );
}

export default function AvatarUpload({ profile }: { profile: Profile }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fotoUrl, setFotoUrl] = useState(profile.foto_url);
  const [status, setStatus] = useState<"idle" | "subiendo" | "quitando" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const supabase = createClient();
    if (!supabase) return;

    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setErrMsg(`La foto pesa demasiado (máximo ${MAX_FILE_MB} MB).`);
      setStatus("error");
      return;
    }

    setStatus("subiendo");
    try {
      const blob = await comprimir(file);
      const path = `${profile.user_id}/avatar-${Date.now()}.jpg`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, blob, { contentType: "image/jpeg" });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      const { error: dbErr } = await supabase
        .from("profiles")
        .update({ foto_url: pub.publicUrl, updated_at: new Date().toISOString() })
        .eq("user_id", profile.user_id);
      if (dbErr) throw dbErr;

      // Limpieza: borramos las fotos anteriores para no acumular archivos
      const { data: old } = await supabase.storage
        .from("avatars")
        .list(profile.user_id);
      const viejas = (old ?? [])
        .map((o) => `${profile.user_id}/${o.name}`)
        .filter((p) => p !== path);
      if (viejas.length) await supabase.storage.from("avatars").remove(viejas);

      setFotoUrl(pub.publicUrl);
      setStatus("idle");
      router.refresh();
    } catch {
      setErrMsg(
        "No hemos podido subir la foto. Usa un JPG o PNG e inténtalo de nuevo."
      );
      setStatus("error");
    }
  };

  const onRemove = async () => {
    const supabase = createClient();
    if (!supabase) return;
    setStatus("quitando");
    try {
      // Borra los archivos de la carpeta del usuario y limpia la BD
      const { data: files } = await supabase.storage
        .from("avatars")
        .list(profile.user_id);
      const paths = (files ?? []).map((f) => `${profile.user_id}/${f.name}`);
      if (paths.length) await supabase.storage.from("avatars").remove(paths);
      const { error } = await supabase
        .from("profiles")
        .update({ foto_url: null, updated_at: new Date().toISOString() })
        .eq("user_id", profile.user_id);
      if (error) throw error;
      setFotoUrl(null);
      setStatus("idle");
      router.refresh();
    } catch {
      setErrMsg("No hemos podido quitar la foto. Inténtalo de nuevo.");
      setStatus("error");
    }
  };

  return (
    <div className="flex items-center gap-5 mb-8">
      {fotoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fotoUrl}
          alt="Tu foto de perfil"
          className="w-[88px] h-[88px] rounded-full object-cover border-2 border-[#e8ff00]/40 flex-shrink-0"
        />
      ) : (
        <span
          className="w-[88px] h-[88px] rounded-full bg-white/[0.05] border border-white/15 flex items-center justify-center text-[36px] text-[#e8ff00] uppercase flex-shrink-0"
          style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 900 }}
          aria-hidden="true"
        >
          {profile.nombre?.charAt(0) || "?"}
        </span>
      )}

      <div>
        <span className="block font-mono text-[12px] tracking-[0.15em] uppercase text-white/75 mb-2">
          Foto de perfil
        </span>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={status === "subiendo" || status === "quitando"}
            className="bio-btn-ghost border border-white/20 text-white/85 font-mono text-[12px] tracking-[0.12em] uppercase px-5 py-2.5 bg-transparent cursor-pointer hover:border-[#e8ff00]/50 disabled:opacity-50 disabled:cursor-wait"
          >
            {status === "subiendo"
              ? "Subiendo…"
              : fotoUrl
                ? "Cambiar foto"
                : "Subir foto"}
          </button>
          {fotoUrl && (
            <button
              type="button"
              onClick={onRemove}
              disabled={status === "subiendo" || status === "quitando"}
              className="border border-white/15 text-white/60 font-mono text-[12px] tracking-[0.12em] uppercase px-5 py-2.5 bg-transparent cursor-pointer hover:border-red-400/50 hover:text-red-400/90 transition-colors disabled:opacity-50 disabled:cursor-wait"
            >
              {status === "quitando" ? "Quitando…" : "Quitar foto"}
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={onFile}
        />
        {status === "error" ? (
          <p className="mt-2 text-[14px] text-red-400/90 leading-[1.6]">{errMsg}</p>
        ) : (
          <p className="mt-2 text-[14px] text-white/60 leading-[1.6]">
            JPG o PNG. Es tu portada en el escaparate de jugadores, así que
            elige una buena.
          </p>
        )}
      </div>
    </div>
  );
}
