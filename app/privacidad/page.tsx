import type { Metadata } from "next";
import LegalPage from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Política de privacidad — Turepresentante",
  description: "Cómo tratamos tus datos personales en Turepresentante.com.",
};

export default function PrivacidadPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacidad" updated="Julio 2026">
      <h2>Quién es el responsable</h2>
      <p>
        Turepresentante.com (en adelante, «Turepresentante») es el responsable
        del tratamiento de los datos que nos facilitas a través de esta web.
        Puedes escribirnos para cualquier cuestión de privacidad a{" "}
        <a href="mailto:hola@turepresentante.com">hola@turepresentante.com</a>.
      </p>

      <h2>Qué datos recogemos</h2>
      <ul>
        <li>
          Los que envías en los formularios: nombre, email, teléfono, datos
          deportivos (posición, club, categoría, enlaces a vídeos) y el
          contenido de tu mensaje.
        </li>
        <li>
          Datos técnicos básicos de navegación necesarios para que la web
          funcione (no usamos cookies de publicidad).
        </li>
      </ul>

      <h2>Para qué los usamos</h2>
      <ul>
        <li>Valorar tu perfil deportivo y responderte.</li>
        <li>Ponernos en contacto contigo sobre tu solicitud.</li>
        <li>
          Si te seleccionamos, gestionar la relación de representación, previa
          firma del acuerdo correspondiente.
        </li>
      </ul>
      <p>
        La base legal es tu consentimiento al enviar el formulario y, en su
        caso, la ejecución del acuerdo de representación.
      </p>

      <h2>Menores de edad</h2>
      <p>
        Si eres menor de 18 años, necesitamos el consentimiento de tu padre,
        madre o tutor legal para tratar tus datos. Pídeles que estén en copia
        en la primera comunicación o que nos escriban directamente.
      </p>

      <h2>Con quién compartimos tus datos</h2>
      <p>
        No vendemos tus datos. Solo los compartimos con clubes o agentes
        interesados en tu perfil cuando tú nos lo autorices, y con los
        proveedores técnicos imprescindibles para operar la web (alojamiento y
        envío de emails), que actúan como encargados del tratamiento.
      </p>

      <h2>Cuánto tiempo los guardamos</h2>
      <p>
        Mientras tu perfil esté activo o durante el tiempo necesario para
        atender tu solicitud. Puedes pedirnos que los borremos en cualquier
        momento.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Puedes ejercer tus derechos de acceso, rectificación, supresión,
        oposición, limitación y portabilidad escribiendo a{" "}
        <a href="mailto:hola@turepresentante.com">hola@turepresentante.com</a>.
        También puedes reclamar ante la Agencia Española de Protección de Datos
        (aepd.es).
      </p>
    </LegalPage>
  );
}
