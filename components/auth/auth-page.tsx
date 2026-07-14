import Link from "next/link";
import SiteNav from "@/components/layout/site-nav";
import SiteFooter from "@/components/layout/site-footer";
import AuthForm from "@/components/auth/auth-form";
import { supabaseConfigured } from "@/lib/supabase/config";

/** Página compartida de registro/login con estado "aún no activado" */
export default function AuthPage({
  mode,
  eyebrow,
  title,
  intro,
}: {
  mode: "registro" | "login";
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
}) {
  const ready = supabaseConfigured();

  return (
    <main className="bg-[#0a0a0a] min-h-dvh flex flex-col">
      <SiteNav />
      <section className="flex-1 px-5 md:px-10 pt-16 md:pt-24 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-14">
        <header>
          <div className="inline-flex items-center gap-2.5 mb-5 border border-[#e8ff00]/25 rounded-full px-4 py-[7px]">
            <span className="bio-node" aria-hidden="true" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#e8ff00]">
              {eyebrow}
            </span>
          </div>
          <h1
            className="uppercase leading-[0.9] tracking-[-0.03em] text-[#f0f0ee]"
            style={{
              fontFamily: "var(--font-barlow-condensed)",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(52px, 8vw, 110px)",
            }}
          >
            {title}
          </h1>
          <p className="mt-5 max-w-[440px] text-[15px] font-light leading-[1.75] text-white/65">
            {intro}
          </p>
        </header>

        <div className="max-w-[440px] w-full lg:pt-10">
          {ready ? (
            <AuthForm mode={mode} />
          ) : (
            <div className="bio-cell px-7 py-8">
              <h2
                className="uppercase text-[#f0f0ee] text-[22px] leading-[1.1]"
                style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 900 }}
              >
                Estamos activando las cuentas
              </h2>
              <p className="mt-3 text-[14px] text-white/65 font-light leading-[1.75]">
                Muy pronto podrás crear tu cuenta y subir tus vídeos. Mientras
                tanto, envíanos tu perfil por el formulario y lo revisamos
                igual.
              </p>
              <Link
                href="/perfil"
                className="bio-btn mt-6 inline-block bg-[#e8ff00] text-[#0a0a0a] font-mono text-[11px] tracking-[0.1em] uppercase font-medium px-7 py-3.5 no-underline"
              >
                Enviar mi perfil
              </Link>
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
