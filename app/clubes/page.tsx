import type { Metadata } from "next";
import SiteNav from "@/components/layout/site-nav";
import SiteFooter from "@/components/layout/site-footer";
import LeadForm, { type Field } from "@/components/forms/lead-form";

export const metadata: Metadata = {
  title: "Clubes y agentes — Turepresentante",
  description:
    "Acceso para clubes, directores deportivos y agentes: te presentamos jugadores verificados que encajan con lo que buscas.",
};

const FIELDS: Field[] = [
  { name: "nombre", label: "Nombre y apellidos", required: true, placeholder: "Tu nombre" },
  { name: "email", label: "Email profesional", type: "email", required: true, placeholder: "tu@club.com" },
  { name: "organizacion", label: "Club / agencia", required: true, placeholder: "Nombre de tu organización" },
  {
    name: "rol",
    label: "Tu rol",
    type: "select",
    required: true,
    options: ["Director deportivo", "Secretaría técnica / scout", "Entrenador", "Agente / representante", "Otro"],
  },
  {
    name: "busca",
    label: "Qué estás buscando",
    type: "textarea",
    full: true,
    required: true,
    placeholder: "Posiciones, edades, categoría, presupuesto orientativo… cuanto más concreto, mejor te podremos ayudar.",
  },
];

export default function ClubesPage() {
  return (
    <main className="bg-[#0a0a0a] min-h-dvh">
      <SiteNav />

      <header className="px-5 md:px-10 pt-16 md:pt-24 pb-10 md:pb-14">
        <div className="inline-flex items-center gap-2.5 mb-5 border border-[#e8ff00]/25 rounded-full px-4 py-[7px]">
          <span className="bio-node" aria-hidden="true" />
          <span className="font-mono text-[12px] tracking-[0.2em] uppercase text-[#e8ff00]">
            Clubes · Scouts · Agentes
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
          Talento <span className="text-[#e8ff00]">verificado.</span>
        </h1>
        <p className="mt-5 max-w-[480px] text-[17px] leading-[1.75] text-white/80">
          Cada jugador de nuestra cartera ha pasado una revisión manual: vídeo,
          trayectoria y referencias. Dinos qué buscas y te presentamos perfiles
          que encajan, sin ruido.
        </p>
      </header>

      <section className="px-5 md:px-10 pb-10 grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            t: "Filtrado real",
            d: "No te mandamos listados masivos. Solo perfiles que cumplen lo que nos pides.",
          },
          {
            t: "Material listo",
            d: "Vídeo, datos y trayectoria de cada jugador ya ordenados para decidir rápido.",
          },
          {
            t: "Un interlocutor",
            d: "Negocias con nosotros de principio a fin. Sin cadenas de intermediarios.",
          },
        ].map((c) => (
          <div key={c.t} className="bio-cell px-7 py-8">
            <h2
              className="uppercase text-[#f0f0ee] text-[22px] leading-[1.1]"
              style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 900 }}
            >
              {c.t}
            </h2>
            <p className="mt-2.5 text-[15px] text-white/80 leading-[1.75] max-w-[300px]">
              {c.d}
            </p>
          </div>
        ))}
      </section>

      <section className="px-5 md:px-10 pt-14 pb-24 max-w-[760px]">
        <h2
          className="uppercase text-[#f0f0ee] text-[28px] leading-[1.1] mb-8"
          style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 900 }}
        >
          Cuéntanos qué buscas
        </h2>
        <LeadForm
          tipo="club"
          fields={FIELDS}
          submitLabel="Enviar solicitud"
          successTitle="Recibido."
          successBody="Gracias por el interés. Revisamos tu petición y te contactamos en 24-48 horas laborables con los primeros perfiles o para afinar la búsqueda."
        />
      </section>

      <SiteFooter />
    </main>
  );
}
