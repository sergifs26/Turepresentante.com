import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthPage from "@/components/auth/auth-page";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Entrar — Turepresentante",
  description: "Accede a tu cuenta de jugador para gestionar tu perfil y tu galería de vídeos.",
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
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
      mode="login"
      eyebrow="Tu cuenta"
      title={
        <>
          Bienvenido <span className="text-[#e8ff00]">de vuelta.</span>
        </>
      }
      intro="Entra para actualizar tu perfil, subir vídeos nuevos y ver cómo queda tu galería."
    />
  );
}
