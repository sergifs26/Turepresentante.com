import type { Metadata } from "next";
import LegalPage from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Términos de uso — Turepresentante",
  description: "Condiciones de uso de la plataforma Turepresentante.com.",
};

export default function TerminosPage() {
  return (
    <LegalPage eyebrow="Legal" title="Términos de uso" updated="Julio 2026">
      <h2>Qué es Turepresentante</h2>
      <p>
        Turepresentante.com es una plataforma de scouting y representación de
        talento futbolístico. Los jugadores envían su perfil de forma gratuita;
        nuestro equipo lo revisa y, si hay encaje, ofrece asumir su
        representación mediante un acuerdo firmado aparte.
      </p>

      <h2>Uso de la plataforma</h2>
      <ul>
        <li>Debes facilitar información veraz y material propio o del que tengas derechos.</li>
        <li>
          Enviar tu perfil no crea ninguna relación de representación: esta
          solo existe cuando ambas partes firman el acuerdo correspondiente.
        </li>
        <li>
          Nos reservamos el derecho a rechazar o retirar perfiles que
          incumplan estas condiciones.
        </li>
      </ul>

      <h2>Coste</h2>
      <p>
        Crear y enviar tu perfil es gratuito para los jugadores. Nuestros
        honorarios, cuando existen, se acuerdan con los clubes en cada
        operación y se recogen en el acuerdo de representación.
      </p>

      <h2>Propiedad del contenido</h2>
      <p>
        El material que subes (vídeos, datos, fotos) sigue siendo tuyo. Al
        enviarlo nos autorizas a usarlo únicamente para valorar tu perfil y,
        si nos lo autorizas expresamente, para presentarte a clubes y agentes.
      </p>

      <h2>Responsabilidad</h2>
      <p>
        No garantizamos la obtención de contratos, pruebas ni fichajes. La web
        se ofrece «tal cual»; haremos lo razonable para que esté disponible,
        pero no respondemos de interrupciones técnicas ajenas a nosotros.
      </p>

      <h2>Cambios</h2>
      <p>
        Podemos actualizar estos términos. Si el cambio es relevante, lo
        indicaremos en esta página con la nueva fecha de actualización.
      </p>

      <h2>Contacto</h2>
      <p>
        Para cualquier duda sobre estas condiciones:{" "}
        <a href="mailto:info@turepresentante.com">info@turepresentante.com</a>.
      </p>
    </LegalPage>
  );
}
