import type { Metadata } from "next";
import SiteNav from "@/components/layout/site-nav";
import SiteFooter from "@/components/layout/site-footer";
import LeadForm, { type Field } from "@/components/forms/lead-form";

export const metadata: Metadata = {
  title: "Sube tu perfil — Turepresentante",
  description:
    "Crea tu perfil de jugador gratis. Si tu nivel nos convence, asumimos tu representación y te ponemos delante de los clubes que importan.",
};

const FIELDS: Field[] = [
  { name: "nombre", label: "Nombre y apellidos", required: true, placeholder: "Tu nombre completo" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "tu@email.com" },
  { name: "telefono", label: "Teléfono / WhatsApp", type: "tel", placeholder: "+34 600 000 000" },
  { name: "nacimiento", label: "Año de nacimiento", type: "number", required: true, placeholder: "2004" },
  {
    name: "posicion",
    label: "Posición principal",
    type: "select",
    required: true,
    options: [
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
    ],
  },
  {
    name: "pierna",
    label: "Pierna dominante",
    type: "select",
    options: ["Derecha", "Izquierda", "Ambidiestro"],
  },
  { name: "club", label: "Club actual", required: true, placeholder: "Tu equipo esta temporada" },
  {
    name: "categoria",
    label: "Categoría / división",
    required: true,
    placeholder: "Ej. Tercera RFEF, Juvenil DH…",
  },
  { name: "ciudad", label: "Ciudad / provincia", required: true, placeholder: "Dónde juegas" },
  {
    name: "video",
    label: "Enlace a tu vídeo",
    type: "url",
    required: true,
    placeholder: "https://…",
    hint: "YouTube, Veo, Instagram o similar. Highlights o partido completo reciente.",
  },
  {
    name: "trayectoria",
    label: "Trayectoria y datos",
    type: "textarea",
    full: true,
    placeholder:
      "Equipos anteriores, minutos jugados, goles/asistencias, altura, y cualquier dato que ayude a valorarte.",
  },
];

export default function PerfilPage() {
  return (
    <main className="bg-[#0a0a0a] min-h-dvh">
      <SiteNav />

      <header className="px-5 md:px-10 pt-16 md:pt-24 pb-10 md:pb-14">
        <div className="inline-flex items-center gap-2.5 mb-5 border border-[#e8ff00]/25 rounded-full px-4 py-[7px]">
          <span className="bio-node" aria-hidden="true" />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#e8ff00]">
            Jugadores · 100% gratis
          </span>
        </div>
        <h1
          className="uppercase leading-[0.9] tracking-[-0.03em] text-[#f0f0ee]"
          style={{
            fontFamily: "var(--font-barlow-condensed)",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: "clamp(52px, 9vw, 120px)",
          }}
        >
          Sube tu <span className="text-[#e8ff00]">perfil.</span>
        </h1>
        <p className="mt-5 max-w-[460px] text-[15px] font-light leading-[1.75] text-white/80">
          Rellena el formulario con tu mejor material. Lo revisamos a mano y te
          respondemos en menos de 72 horas, sí o sí.
        </p>
      </header>

      <section className="px-5 md:px-10 pb-24 grid grid-cols-1 lg:grid-cols-3 gap-14">
        <div className="lg:col-span-2">
          <LeadForm
            tipo="jugador"
            fields={FIELDS}
            submitLabel="Enviar mi perfil"
            successTitle="Ya lo tenemos."
            successBody="Vamos a revisar tu material con calma. Te escribimos al email que nos has dejado en menos de 72 horas, tanto si seguimos adelante como si no."
          />
        </div>

        <aside className="lg:pt-2">
          <h2
            className="uppercase text-[#f0f0ee] text-[22px] leading-[1.1]"
            style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 900 }}
          >
            Qué valoramos
          </h2>
          <ul className="mt-5 flex flex-col gap-4">
            {[
              "Vídeo reciente y sin editar de más: mejor 10 minutos reales que 60 segundos de música.",
              "Historial claro: equipos, categorías y minutos de las últimas 2-3 temporadas.",
              "Regularidad. Nos importa más tu temporada completa que una jugada viral.",
              "Actitud: puntualidad en la comunicación ya dice mucho de ti.",
            ].map((t) => (
              <li key={t} className="flex gap-3 text-[13px] text-white/80 font-light leading-[1.7]">
                <span className="w-4 h-px bg-[#e8ff00] block flex-shrink-0 mt-[9px]" />
                {t}
              </li>
            ))}
          </ul>

          <div className="bio-cell mt-10 px-6 py-6">
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/65 block">
              ¿Dudas antes de enviar?
            </span>
            <a
              href="mailto:info@turepresentante.com"
              className="mt-1.5 inline-block text-[13px] text-[#e8ff00] no-underline hover:opacity-80 transition-opacity"
            >
              info@turepresentante.com
            </a>
          </div>
        </aside>
      </section>

      <SiteFooter />
    </main>
  );
}
