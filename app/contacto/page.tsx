import type { Metadata } from "next";
import SiteNav from "@/components/layout/site-nav";
import SiteFooter from "@/components/layout/site-footer";
import LeadForm, { type Field } from "@/components/forms/lead-form";

export const metadata: Metadata = {
  title: "Contacto — Turepresentante",
  description:
    "Escríbenos: dudas sobre tu perfil, prensa, colaboraciones o cualquier otra cosa. Respondemos en 24-48 horas laborables.",
};

const FIELDS: Field[] = [
  { name: "nombre", label: "Nombre", required: true, placeholder: "Tu nombre" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "tu@email.com" },
  {
    name: "asunto",
    label: "Asunto",
    type: "select",
    required: true,
    options: ["Duda sobre mi perfil", "Soy padre/madre o tutor", "Prensa", "Colaboración", "Otro"],
  },
  { name: "mensaje", label: "Mensaje", type: "textarea", full: true, required: true, placeholder: "Cuéntanos…" },
];

export default function ContactoPage() {
  return (
    <main className="bg-[#0a0a0a] min-h-dvh">
      <SiteNav />

      <header className="px-5 md:px-10 pt-16 md:pt-24 pb-10 md:pb-14">
        <div className="inline-flex items-center gap-2.5 mb-5 border border-[#e8ff00]/25 rounded-full px-4 py-[7px]">
          <span className="bio-node" aria-hidden="true" />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#e8ff00]">
            Contacto
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
          Hablemos<span className="text-[#e8ff00]">.</span>
        </h1>
        <p className="mt-5 max-w-[440px] text-[15px] font-light leading-[1.75] text-white/45">
          Si quieres que valoremos tu juego, usa el formulario de{" "}
          <a href="/perfil" className="text-[#e8ff00] no-underline hover:opacity-80">
            sube tu perfil
          </a>
          . Para todo lo demás, este es el sitio.
        </p>
      </header>

      <section className="px-5 md:px-10 pb-24 grid grid-cols-1 lg:grid-cols-3 gap-14">
        <div className="lg:col-span-2 max-w-[760px]">
          <LeadForm
            tipo="contacto"
            fields={FIELDS}
            submitLabel="Enviar mensaje"
            successTitle="Mensaje enviado."
            successBody="Gracias por escribirnos. Te respondemos en 24-48 horas laborables al email que nos has dejado."
          />
        </div>

        <aside className="lg:pt-2">
          <div className="bio-cell px-6 py-6">
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/30 block">
              Email directo
            </span>
            <a
              href="mailto:info@turepresentante.com"
              className="mt-1.5 inline-block text-[13px] text-[#e8ff00] no-underline hover:opacity-80 transition-opacity"
            >
              info@turepresentante.com
            </a>
          </div>
          <p className="mt-5 text-[12px] text-white/25 font-light leading-[1.7]">
            Si eres menor de edad, pide a tu padre, madre o tutor que nos
            escriba o que esté en copia en el primer email.
          </p>
        </aside>
      </section>

      <SiteFooter />
    </main>
  );
}
