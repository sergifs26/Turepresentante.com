import type { Metadata } from "next";
import { Barlow_Condensed, Barlow, Geist_Mono } from "next/font/google";
import WhatsappPill from "@/components/layout/whatsapp-pill";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://turepresentante.com"),
  title: {
    default: "Turepresentante — Hazte Ver",
    template: "%s",
  },
  description:
    "El marketplace donde tu talento llega a los representantes y clubes que importan. Sube tu perfil gratis: lo revisamos a mano y, si hay nivel, asumimos tu representación.",
  keywords: [
    "representante de futbolistas",
    "agente de fútbol",
    "scouting fútbol España",
    "subir perfil jugador",
    "representación deportiva",
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://turepresentante.com",
    siteName: "Turepresentante",
    title: "Turepresentante — Hazte Ver",
    description:
      "Sube tu perfil gratis. Si tu nivel nos convence, te ponemos delante de los representantes y clubes que importan.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Turepresentante — Hazte Ver",
    description:
      "Sube tu perfil gratis. Si tu nivel nos convence, te ponemos delante de los representantes y clubes que importan.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${barlowCondensed.variable} ${barlow.variable} ${geistMono.variable} dark`}
    >
      <body className="min-h-full bg-[#0a0a0a] text-[#f0f0ee] antialiased overflow-x-hidden">
        {children}
        <WhatsappPill />
      </body>
    </html>
  );
}
