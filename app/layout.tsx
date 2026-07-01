import type { Metadata } from "next";
import { Barlow_Condensed, Barlow, Geist_Mono } from "next/font/google";
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
  title: "Turepresentante — Hazte Ver",
  description: "El marketplace donde tu talento llega a los representantes y clubes que importan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${barlowCondensed.variable} ${barlow.variable} ${geistMono.variable} dark`}
    >
      <body className="min-h-full bg-[#0a0a0a] text-[#f0f0ee] antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
