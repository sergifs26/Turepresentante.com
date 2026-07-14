"use client";

import { useState } from "react";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "url" | "select" | "textarea";
  required?: boolean;
  options?: string[];
  placeholder?: string;
  hint?: string;
  /** Take the full row width (default: half on desktop) */
  full?: boolean;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const inputBase =
  "bio-input w-full bg-white/[0.04] border border-white/10 text-[#f0f0ee] text-[14px] font-light px-4 py-3 outline-none focus:border-[#e8ff00] placeholder:text-white/45";

export default function LeadForm({
  tipo,
  fields,
  submitLabel,
  successTitle,
  successBody,
}: {
  tipo: "jugador" | "club" | "contacto";
  fields: Field[];
  submitLabel: string;
  successTitle: string;
  successBody: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const set = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    for (const f of fields) {
      const val = (values[f.name] ?? "").trim();
      if (f.required && !val) next[f.name] = "Este campo es obligatorio";
      else if (val && f.type === "email" && !EMAIL_RE.test(val))
        next[f.name] = "Ese email no parece válido";
      else if (val && f.type === "url" && !/^https?:\/\/.+\..+/.test(val))
        next[f.name] = "Pega un enlace completo (empieza por https://)";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, ...values }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
        setServerError(data.error ?? "No hemos podido enviar tu solicitud.");
      }
    } catch {
      setStatus("error");
      setServerError("Sin conexión. Comprueba tu red e inténtalo de nuevo.");
    }
  };

  if (status === "sent") {
    return (
      <div className="bio-cell px-8 py-12 text-center" style={{ borderColor: "rgba(232,255,0,0.3)" }}>
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#e8ff00]">
          Solicitud enviada
        </span>
        <h3
          className="mt-3 uppercase text-[#f0f0ee] text-[34px] leading-[1.05]"
          style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 900 }}
        >
          {successTitle}
        </h3>
        <p className="mt-3 text-[14px] text-white/65 font-light leading-[1.75] max-w-[420px] mx-auto">
          {successBody}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-6">
      {/* Honeypot — hidden from humans, catnip for bots */}
      <input
        type="text"
        name="_empresa"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        onChange={(e) => set("_empresa", e.target.value)}
      />

      {fields.map((f) => {
        const err = errors[f.name];
        const id = `f-${f.name}`;
        return (
          <div key={f.name} className={f.full ? "md:col-span-2" : ""}>
            <label
              htmlFor={id}
              className="block font-mono text-[10px] tracking-[0.15em] uppercase text-white/60 mb-2"
            >
              {f.label}
              {f.required && <span className="text-[#e8ff00]"> *</span>}
            </label>

            {f.type === "select" ? (
              <select
                id={id}
                value={values[f.name] ?? ""}
                onChange={(e) => set(f.name, e.target.value)}
                className={`${inputBase} appearance-none cursor-pointer ${err ? "border-red-400/60" : ""} ${!values[f.name] ? "text-white/45" : ""}`}
              >
                <option value="" disabled className="bg-[#141414]">
                  {f.placeholder ?? "Selecciona…"}
                </option>
                {f.options?.map((o) => (
                  <option key={o} value={o} className="bg-[#141414] text-[#f0f0ee]">
                    {o}
                  </option>
                ))}
              </select>
            ) : f.type === "textarea" ? (
              <textarea
                id={id}
                rows={5}
                value={values[f.name] ?? ""}
                onChange={(e) => set(f.name, e.target.value)}
                placeholder={f.placeholder}
                className={`${inputBase} resize-y min-h-[120px] ${err ? "border-red-400/60" : ""}`}
              />
            ) : (
              <input
                id={id}
                type={f.type ?? "text"}
                inputMode={f.type === "number" ? "numeric" : undefined}
                value={values[f.name] ?? ""}
                onChange={(e) => set(f.name, e.target.value)}
                placeholder={f.placeholder}
                className={`${inputBase} ${err ? "border-red-400/60" : ""}`}
              />
            )}

            {err ? (
              <p className="mt-1.5 text-[12px] text-red-400/90 font-light">{err}</p>
            ) : f.hint ? (
              <p className="mt-1.5 text-[12px] text-white/45 font-light">{f.hint}</p>
            ) : null}
          </div>
        );
      })}

      <div className="md:col-span-2 mt-2">
        {status === "error" && (
          <p className="mb-4 text-[13px] text-red-400/90 font-light border border-red-400/25 bg-red-400/[0.05] px-4 py-3 rounded-2xl">
            {serverError}
          </p>
        )}
        <button
          type="submit"
          disabled={status === "sending"}
          className="bio-btn w-full md:w-auto bg-[#e8ff00] text-[#0a0a0a] font-mono text-[11px] tracking-[0.1em] uppercase font-medium px-10 py-4 cursor-pointer border-0 disabled:opacity-50 disabled:cursor-wait"
        >
          {status === "sending" ? "Enviando…" : submitLabel}
        </button>
        <p className="mt-4 text-[12px] text-white/45 font-light leading-[1.7]">
          Al enviar aceptas nuestra{" "}
          <a href="/privacidad" className="text-white/60 underline hover:text-white/70 transition-colors">
            política de privacidad
          </a>
          . Solo usamos tus datos para valorar tu perfil y responderte.
        </p>
      </div>
    </form>
  );
}
