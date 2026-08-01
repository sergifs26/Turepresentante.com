export type Profile = {
  user_id: string;
  slug: string;
  nombre: string;
  posicion: string | null;
  pierna: string | null;
  club: string | null;
  categoria: string | null;
  ciudad: string | null;
  nacimiento: number | null;
  bio: string | null;
  foto_url: string | null;
  created_at: string;
  /** Moderación: nada sale en público sin aprobación de un admin */
  estado: "borrador" | "en_revision" | "aprobado" | "rechazado";
  revision_notas: string | null;
  enviado_revision_at: string | null;
  revisado_at: string | null;
};

export type Video = {
  id: string;
  user_id: string;
  stream_uid: string;
  title: string;
  status: "processing" | "ready" | "error";
  duration: number | null;
  created_at: string;
  /** Moderación por vídeo: oculto en público hasta que un admin lo aprueba */
  revision: "pendiente" | "aprobado" | "rechazado";
};

/** Tope de galería: 10 minutos EN TOTAL entre todos los vídeos */
export const MAX_TOTAL_VIDEO_SECONDS = 600;

export const POSICIONES = [
  "Portero",
  "Lateral derecho",
  "Lateral izquierdo",
  "Central",
  "Mediocentro defensivo",
  "Mediocentro",
  "Mediapunta",
  "Extremo derecho",
  "Extremo izquierdo",
  "Delantero",
] as const;

export const PIERNAS = ["Derecha", "Izquierda", "Ambidiestro"] as const;
