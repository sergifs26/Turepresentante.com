import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import SiteNav from "@/components/layout/site-nav";
import SiteFooter from "@/components/layout/site-footer";
import ProfileForm from "@/components/account/profile-form";
import VideoManager from "@/components/account/video-manager";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";
import type { Profile } from "@/lib/types";

export const metadata: Metadata = {
  title: "Mi cuenta — Turepresentante",
  description: "Gestiona tu perfil de jugador y tu galería de vídeos.",
};

export const dynamic = "force-dynamic";

export default async function CuentaPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/registro");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Primer acceso: creamos el perfil con el nombre del registro
  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    const meta = user.user_metadata ?? {};
    const nombre =
      ((meta.nombre || meta.full_name || meta.name) as string | undefined)?.trim() ||
      "Jugador";
    const { data: created } = await supabase
      .from("profiles")
      .insert({
        user_id: user.id,
        nombre,
        slug: slugify(nombre, user.id),
      })
      .select()
      .single();
    profile = created;
  }

  const p = profile as Profile;

  return (
    <main className="bg-[#0a0a0a] min-h-dvh">
      <SiteNav />

      <header className="px-5 md:px-10 pt-14 md:pt-20 pb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2.5 mb-5 border border-[#e8ff00]/25 rounded-full px-4 py-[7px]">
            <span className="bio-node" aria-hidden="true" />
            <span className="font-mono text-[12px] tracking-[0.2em] uppercase text-[#e8ff00]">
              Tu panel
            </span>
          </div>
          <h1
            className="uppercase leading-[0.9] tracking-[-0.03em] text-[#f0f0ee]"
            style={{
              fontFamily: "var(--font-barlow-condensed)",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(44px, 7vw, 90px)",
            }}
          >
            Hola, <span className="text-[#e8ff00]">{p?.nombre?.split(" ")[0] ?? "crack"}.</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 pb-2">
          {p?.slug && (
            <Link
              href={`/jugadores/${p.slug}`}
              className="bio-btn-ghost border border-white/20 text-white/75 font-mono text-[12px] tracking-[0.12em] uppercase px-5 py-2.5 no-underline hover:border-[#e8ff00]/50 hover:text-white/90"
            >
              Ver mi perfil público
            </Link>
          )}
          <form action="/auth/logout" method="post">
            <button
              type="submit"
              className="bio-btn-ghost border border-white/10 text-white/70 font-mono text-[12px] tracking-[0.12em] uppercase px-5 py-2.5 bg-transparent cursor-pointer hover:text-white/85"
            >
              Salir
            </button>
          </form>
        </div>
      </header>

      <section className="px-5 md:px-10 pb-24 grid grid-cols-1 lg:grid-cols-5 gap-14">
        <div className="lg:col-span-3">
          <h2
            className="uppercase text-[#f0f0ee] text-[24px] leading-[1.1] mb-6"
            style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 900 }}
          >
            Tu galería de vídeos
          </h2>
          <VideoManager />
        </div>

        <div className="lg:col-span-2">
          <h2
            className="uppercase text-[#f0f0ee] text-[24px] leading-[1.1] mb-6"
            style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 900 }}
          >
            Tus datos
          </h2>
          {p && <ProfileForm profile={p} />}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
