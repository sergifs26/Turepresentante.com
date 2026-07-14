"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const inputBase =
  "bio-input w-full bg-white/[0.04] border border-white/10 text-[#f0f0ee] text-[16px] px-4 py-3 outline-none focus:border-[#e8ff00] placeholder:text-white/60";

const label =
  "block font-mono text-[12px] tracking-[0.15em] uppercase text-white/75 mb-2";

export default function AuthForm({ mode }: { mode: "registro" | "login" }) {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "working" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const onGoogle = async () => {
    const supabase = createClient();
    if (!supabase) return;
    setStatus("working");
    setError("");
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (err) {
      setStatus("error");
      setError("No se pudo abrir Google. Inténtalo de nuevo.");
    }
    // si va bien, el navegador redirige a Google: no hay más que hacer aquí
  };

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
        <span className="font-mono text-[12px] tracking-[0.2em] uppercase text-[#e8ff00]">
          Un paso más
        </span>
        <h2
          className="mt-3 uppercase text-[#f0f0ee] text-[30px] leading-[1.05]"
          style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 900 }}
        >
          Confirma tu email.
        </h2>
        <p className="mt-3 text-[16px] text-white/80 leading-[1.75] max-w-[400px] mx-auto">
          Te hemos enviado un enlace a <span className="text-white/80">{email}</span>.
          Ábrelo para activar tu cuenta y entrar en tu panel.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {/* Google: la vía rápida */}
      <button
        type="button"
        onClick={onGoogle}
        disabled={status === "working"}
        className="bio-btn-ghost flex items-center justify-center gap-3 border border-white/20 text-white/80 font-mono text-[13px] tracking-[0.1em] uppercase px-8 py-[14px] bg-transparent cursor-pointer hover:border-[#e8ff00]/50 hover:text-white disabled:opacity-50"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#EA4335" d="M12 5.04c1.62 0 3.06.56 4.2 1.64l3.12-3.12C17.45 1.8 14.97.75 12 .75 7.7.75 3.99 3.22 2.18 6.82l3.66 2.84C6.71 7.05 9.14 5.04 12 5.04z" />
          <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
          <path fill="#FBBC05" d="M5.84 14.09A6.97 6.97 0 015.46 12c0-.73.14-1.43.38-2.09L2.18 7.07a11.25 11.25 0 000 9.86l3.66-2.84z" />
          <path fill="#34A853" d="M12 23.25c3.04 0 5.59-1 7.45-2.72l-3.86-3c-1.03.69-2.35 1.1-3.59 1.1-2.86 0-5.29-2.01-6.16-4.62l-3.66 2.84c1.81 3.6 5.52 6.4 9.82 6.4z" />
        </svg>
        Continuar con Google
      </button>

      <div className="flex items-center gap-4" aria-hidden="true">
        <span className="flex-1 h-px bg-white/10" />
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/60">
          o con tu email
        </span>
        <span className="flex-1 h-px bg-white/10" />
      </div>

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
        <p className="text-[15px] text-red-400/90 border border-red-400/25 bg-red-400/[0.05] px-4 py-3 rounded-2xl">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "working"}
        className="bio-btn bg-[#e8ff00] text-[#0a0a0a] font-mono text-[13px] tracking-[0.1em] uppercase font-medium px-10 py-4 cursor-pointer border-0 disabled:opacity-50 disabled:cursor-wait"
      >
        {status === "working"
          ? "Un momento…"
          : mode === "registro"
            ? "Crear mi cuenta gratis"
            : "Entrar"}
      </button>

      <p className="text-[15px] text-white/70">
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
  if (m.includes("is invalid")) return "Ese email no parece válido. Revísalo.";
  if (m.includes("email rate limit") || m.includes("over_email_send_rate_limit"))
    return "Hemos alcanzado el límite de emails por ahora. Prueba en unos minutos o entra con Google.";
  if (m.includes("rate limit")) return "Demasiados intentos. Espera un minuto y prueba otra vez.";
  return "No hemos podido completar la operación. Inténtalo de nuevo.";
}
