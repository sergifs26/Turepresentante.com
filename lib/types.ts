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
  created_at: string;
};

export type Video = {
  id: string;
  user_id: string;
  stream_uid: string;
  title: string;
  status: "processing" | "ready" | "error";
  duration: number | null;
  created_at: string;
};

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
