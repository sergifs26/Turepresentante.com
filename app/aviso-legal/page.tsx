import type { Metadata } from "next";
import LegalPage from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Aviso legal — Turepresentante",
  description: "Información legal del titular de Turepresentante.com.",
};

export default function AvisoLegalPage() {
  return (
    <LegalPage eyebrow="Legal" title="Aviso legal" updated="Julio 2026">
      <h2>1. Datos identificativos</h2>
      <p>
        En cumplimiento de la Ley 34/2002 de Servicios de la Sociedad de la
        Información y de Comercio Electrónico (LSSI-CE), se informa de que el
        titular de este sitio web es:
      </p>
      <ul>
        <li>
          Titular: <strong>Grupo Intertorrent SL</strong>
        </li>
        <li>
          NIF: <strong>B67949925</strong>
        </li>
        <li>
          Domicilio:{" "}
          <strong>
            Avinguda al Vedat, 180, Planta 1, Local 1, 46900 Torrent (Valencia)
          </strong>
        </li>
        <li>
          Correo:{" "}
          <a href="mailto:info@turepresentante.com">info@turepresentante.com</a>
        </li>
        <li>Sitio web: turepresentante.com</li>
      </ul>

      <h2>2. Objeto</h2>
      <p>
        Turepresentante.com es una plataforma de scouting y representación de
        talento futbolístico. A través de ella, los jugadores pueden crear un
        perfil, subir vídeos y ponerse a disposición de clubes y agentes; y
        nuestro equipo valora esos perfiles y, si hay encaje, ofrece asumir su
        representación mediante un acuerdo firmado aparte.
      </p>

      <h2>3. Condiciones de uso</h2>
      <p>
        Al usar esta web te comprometes a facilitar información veraz, a subir
        únicamente material propio o del que tengas derechos, y a no usar la
        plataforma con fines ilícitos. Nos reservamos el derecho a retirar
        perfiles o contenidos que incumplan estas condiciones o la ley. El uso de
        las cuentas y del servicio se rige también por nuestros{" "}
        <a href="/terminos">Términos de uso</a> y por la{" "}
        <a href="/privacidad">Política de privacidad</a>.
      </p>

      <h2>4. Propiedad intelectual e industrial</h2>
      <p>
        El diseño de la web, sus textos, logotipos y demás elementos son
        titularidad de Turepresentante o de terceros que han autorizado su uso.
        El material que suben los jugadores (vídeos, fotos, datos) sigue siendo
        de su propiedad; al subirlo, autorizan su uso únicamente para las
        finalidades descritas en la política de privacidad.
      </p>

      <h2>5. Responsabilidad</h2>
      <p>
        No garantizamos la obtención de contratos, pruebas ni fichajes. La web se
        ofrece «tal cual»; haremos lo razonable para que esté disponible y
        segura, pero no respondemos de interrupciones técnicas ajenas a nosotros
        ni del contenido de sitios de terceros enlazados.
      </p>

      <h2>6. Legislación aplicable</h2>
      <p>
        Estas condiciones se rigen por la legislación española. Para cualquier
        controversia, las partes se someten a los juzgados y tribunales que
        correspondan conforme a la ley.
      </p>
    </LegalPage>
  );
}
