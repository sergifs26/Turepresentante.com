"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const inputBase =
  "bio-input w-full bg-white/[0.04] border border-white/10 text-[#f0f0ee] text-[14px] font-light px-4 py-3 outline-none focus:border-[#e8ff00] placeholder:text-white/25";

const label =
  "block font-mono text-[10px] tracking-[0.15em] uppercase text-white/40 mb-2";

export default function AuthForm({ mode }: { mode: "registro" | "login" }) {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "working" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    if (!supabase) return;
    if (mode === "registro" && nombre.trim().length < 3) {
      setError("Dinos tu nombre completo.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña necesita al menos 8 caracteres.");
      return;
    }
    setStatus("working");
    setError("");

    if (mode === "registro") {
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nombre: nombre.trim() },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });
      if (err) {
        setStatus("error");
        setError(traducir(err.message));
        return;
      }
      setStatus("sent");
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (err) {
        setStatus("error");
        setError(traducir(err.message));
        return;
      }
      router.push("/cuenta");
      router.refresh();
    }
  };

  if (status === "sent") {
    return (
      <div className="bio-cell px-8 py-12 text-center" style={{ borderColor: "rgba(232,255,0,0.3)" }}>
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#e8ff00]">
          Un paso más
        </span>
        <h2
          className="mt-3 uppercase text-[#f0f0ee] text-[30px] leading-[1.05]"
          style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 900 }}
        >
          Confirma tu email.
        </h2>
        <p className="mt-3 text-[14px] text-white/45 font-light leading-[1.75] max-w-[400px] mx-auto">
          Te hemos enviado un enlace a <span className="text-white/80">{email}</span>.
          Ábrelo para activar tu cuenta y entrar en tu panel.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {mode === "registro" && (
        <div>
          <label htmlFor="nombre" className={label}>
            Nombre y apellidos <span className="text-[#e8ff00]">*</span>
          </label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre completo"
            autoComplete="name"
            className={inputBase}
          />
        </div>
      )}
      <div>
        <label htmlFor="email" className={label}>
          Email <span className="text-[#e8ff00]">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          autoComplete="email"
          required
          className={inputBase}
        />
      </div>
      <div>
        <label htmlFor="password" className={label}>
          Contraseña <span className="text-[#e8ff00]">*</span>
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres"
          autoComplete={mode === "registro" ? "new-password" : "current-password"}
          required
          className={inputBase}
        />
      </div>

      {error && (
        <p className="text-[13px] text-red-400/90 font-light border border-red-400/25 bg-red-400/[0.05] px-4 py-3 rounded-2xl">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "working"}
        className="bio-btn bg-[#e8ff00] text-[#0a0a0a] font-mono text-[11px] tracking-[0.1em] uppercase font-medium px-10 py-4 cursor-pointer border-0 disabled:opacity-50 disabled:cursor-wait"
      >
        {status === "working"
          ? "Un momento…"
          : mode === "registro"
            ? "Crear mi cuenta gratis"
            : "Entrar"}
      </button>

      <p className="text-[13px] text-white/35 font-light">
        {mode === "registro" ? (
          <>¿Ya tienes cuenta?{" "}
            <a href="/login" className="text-[#e8ff00] no-underline hover:opacity-80">Entra aquí</a>
          </>
        ) : (
          <>¿Aún no tienes cuenta?{" "}
            <a href="/registro" className="text-[#e8ff00] no-underline hover:opacity-80">Regístrate gratis</a>
          </>
        )}
      </p>
    </form>
  );
}

function traducir(msg: string) {
  const m = msg.toLowerCase();
  if (m.includes("already registered")) return "Ese email ya tiene cuenta. Prueba a entrar.";
  if (m.includes("invalid login credentials")) return "Email o contraseña incorrectos.";
  if (m.includes("email not confirmed")) return "Confirma tu email primero: revisa tu bandeja de entrada.";
  if (m.includes("rate limit")) return "Demasiados intentos. Espera un minuto y prueba otra vez.";
  return "No hemos podido completar la operación. Inténtalo de nuevo.";
}
