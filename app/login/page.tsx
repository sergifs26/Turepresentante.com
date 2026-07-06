import type { Metadata } from "next";
import AuthPage from "@/components/auth/auth-page";

export const metadata: Metadata = {
  title: "Entrar — Turepresentante",
  description: "Accede a tu cuenta de jugador para gestionar tu perfil y tu galería de vídeos.",
};

export default function LoginPage() {
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
