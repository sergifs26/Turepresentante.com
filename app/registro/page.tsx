import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthPage from "@/components/auth/auth-page";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Crea tu cuenta — Turepresentante",
  description:
    "Crea tu cuenta gratis, sube tus vídeos y ten tu perfil de jugador con galería propia. Los clubes te encuentran a ti.",
};

export const dynamic = "force-dynamic";

export default async function RegistroPage() {
  // Con sesión iniciada no tiene sentido el formulario: directo al panel
  const supabase = await createClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/cuenta");
  }

  return (
    <AuthPage
      mode="registro"
      eyebrow="Jugadores · 100% gratis"
      title={
        <>
          Tu carrera <span className="text-[#e8ff00]">empieza aquí.</span>
        </>
      }
      intro="Crea tu cuenta, completa tu perfil y sube tus mejores vídeos. Tu galería es pública: cualquier club puede descubrirte."
    />
  );
}
