import type { MetadataRoute } from "next";

/** Manifest de app web: icono y nombre al añadir a pantalla de inicio,
 *  y apertura a pantalla completa como una app */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Turepresentante",
    short_name: "Turepresentante",
    description:
      "Representación de futbolistas: sube tu vídeo y, si hay nivel, te movemos ante clubes.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
