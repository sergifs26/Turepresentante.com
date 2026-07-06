import type { MetadataRoute } from "next";

const BASE = "https://turepresentante.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/registro`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/jugadores`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/perfil`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/clubes`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/contacto`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/privacidad`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/terminos`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
