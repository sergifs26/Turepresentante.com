"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { POSICIONES, PIERNAS, type Profile } from "@/lib/types";

const inputBase =
  "bio-input w-full bg-white/[0.04] border border-white/10 text-[#f0f0ee] text-[16px] px-4 py-3 outline-none focus:border-[#e8ff00] placeholder:text-white/60";
const label =
  "block font-mono text-[12px] tracking-[0.15em] uppercase text-white/75 mb-2";

export default function ProfileForm({
  profile,
  telefonoInicial = "",
}: {
  profile: Profile;
  telefonoInicial?: string;
}) {
  const [form, setForm] = useState({
    nombre: profile.nombre ?? "",
    posicion: profile.posicion ?? "",
    pierna: profile.pierna ?? "",
    club: profile.club ?? "",
    categoria: profile.categoria ?? "",
    ciudad: profile.ciudad ?? "",
    nacimiento: profile.nacimiento ? String(profile.nacimiento) : "",
    bio: profile.bio ?? "",
    telefono: telefonoInicial,
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (status === "saved") setStatus("idle");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    if (!supabase) return;
    setStatus("saving");
    const { error } = await supabase
      .from("profiles")
      .update({
        nombre: form.nombre.trim() || profile.nombre,
        posicion: form.posicion || null,
        pierna: form.pierna || null,
        club: form.club.trim() || null,
        categoria: form.categoria.trim() || null,
        ciudad: form.ciudad.trim() || null,
        nacimiento: form.nacimiento ? parseInt(form.nacimiento, 10) : null,
        bio: form.bio.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", profile.user_id);

    // El teléfono va en una tabla aparte protegida (solo dueño y admins
    // pueden leerlo), nunca en profiles que es de lectura pública
    const { error: telError } = await supabase.from("profile_private").upsert({
      user_id: profile.user_id,
      telefono: form.telefono.trim() || null,
      updated_at: new Date().toISOString(),
    });

    setStatus(error || telError ? "error" : "saved");
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
      <div className="sm:col-span-2">
        <label className={label} htmlFor="p-nombre">Nombre y apellidos</label>
        <input id="p-nombre" className={inputBase} value={form.nombre} onChange={(e) => set("nombre", e.target.value)} />
      </div>
      <div>
        <label className={label} htmlFor="p-posicion">Posición</label>
        <select
          id="p-posicion"
          className={`${inputBase} appearance-none cursor-pointer ${!form.posicion ? "text-white/60" : ""}`}
          value={form.posicion}
          onChange={(e) => set("posicion", e.target.value)}
        >
          <option value="" disabled className="bg-[#141414]">Selecciona…</option>
          {POSICIONES.map((p) => (
            <option key={p} value={p} className="bg-[#141414] text-[#f0f0ee]">{p}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={label} htmlFor="p-pierna">Pierna dominante</label>
        <select
          id="p-pierna"
          className={`${inputBase} appearance-none cursor-pointer ${!form.pierna ? "text-white/60" : ""}`}
          value={form.pierna}
          onChange={(e) => set("pierna", e.target.value)}
        >
          <option value="" disabled className="bg-[#141414]">Selecciona…</option>
          {PIERNAS.map((p) => (
            <option key={p} value={p} className="bg-[#141414] text-[#f0f0ee]">{p}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={label} htmlFor="p-club">Club actual</label>
        <input id="p-club" className={inputBase} value={form.club} onChange={(e) => set("club", e.target.value)} placeholder="Tu equipo" />
      </div>
      <div>
        <label className={label} htmlFor="p-categoria">Categoría</label>
        <input id="p-categoria" className={inputBase} value={form.categoria} onChange={(e) => set("categoria", e.target.value)} placeholder="Ej. Tercera RFEF" />
      </div>
      <div>
        <label className={label} htmlFor="p-ciudad">Ciudad</label>
        <input id="p-ciudad" className={inputBase} value={form.ciudad} onChange={(e) => set("ciudad", e.target.value)} placeholder="Dónde juegas" />
      </div>
      <div>
        <label className={label} htmlFor="p-nacimiento">Año de nacimiento</label>
        <input id="p-nacimiento" type="number" inputMode="numeric" className={inputBase} value={form.nacimiento} onChange={(e) => set("nacimiento", e.target.value)} placeholder="2004" />
      </div>
      <div className="sm:col-span-2">
        <label className={label} htmlFor="p-telefono">Teléfono</label>
        <input
          id="p-telefono"
          type="tel"
          inputMode="tel"
          className={inputBase}
          value={form.telefono}
          onChange={(e) => set("telefono", e.target.value)}
          placeholder="+34 600 000 000"
        />
        <p className="mt-1.5 text-[13px] text-white/60 leading-[1.6]">
          Privado. No sale en tu perfil público: solo lo ven los
          administradores de Turepresentante para poder contactarte.
        </p>
      </div>
      <div className="sm:col-span-2">
        <label className={label} htmlFor="p-bio">Sobre ti</label>
        <textarea
          id="p-bio"
          rows={4}
          className={`${inputBase} resize-y min-h-[100px]`}
          value={form.bio}
          onChange={(e) => set("bio", e.target.value)}
          placeholder="Tu juego en dos líneas: fortalezas, trayectoria, objetivos."
        />
      </div>

      <div className="sm:col-span-2 flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "saving"}
          className="bio-btn bg-[#e8ff00] text-[#0a0a0a] font-mono text-[13px] tracking-[0.1em] uppercase font-medium px-8 py-3.5 cursor-pointer border-0 disabled:opacity-50 disabled:cursor-wait"
        >
          {status === "saving" ? "Guardando…" : "Guardar cambios"}
        </button>
        {status === "saved" && (
          <span className="font-mono text-[12px] tracking-[0.15em] uppercase text-[#e8ff00]">Guardado</span>
        )}
        {status === "error" && (
          <span className="font-mono text-[12px] tracking-[0.15em] uppercase text-red-400/90">No se pudo guardar</span>
        )}
      </div>
    </form>
  );
}
