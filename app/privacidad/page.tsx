import type { Metadata } from "next";
import LegalPage from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Política de privacidad — Turepresentante",
  description: "Cómo tratamos tus datos personales en Turepresentante.com.",
};

export default function PrivacidadPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacidad" updated="Julio 2026">
      <h2>1. Responsable del tratamiento</h2>
      <p>
        El responsable del tratamiento de tus datos es{" "}
        <strong>[NOMBRE Y APELLIDOS o RAZÓN SOCIAL]</strong>, con NIF/CIF{" "}
        <strong>[NIF/CIF]</strong> y domicilio en <strong>[DIRECCIÓN]</strong>{" "}
        (en adelante, «Turepresentante»). Para cualquier cuestión sobre tus
        datos puedes escribir a{" "}
        <a href="mailto:info@turepresentante.com">info@turepresentante.com</a>.
      </p>

      <h2>2. Qué datos tratamos</h2>
      <ul>
        <li>
          Datos de identificación y contacto: nombre y apellidos, email,
          teléfono y ciudad.
        </li>
        <li>
          Datos deportivos: posición, pierna dominante, club, categoría, año de
          nacimiento, trayectoria y los vídeos que subes.
        </li>
        <li>
          Datos de cuenta: los necesarios para el registro y el inicio de sesión
          (incluido el inicio de sesión con Google).
        </li>
        <li>
          Datos técnicos de navegación imprescindibles para que la web funcione.
          No usamos cookies de publicidad ni de seguimiento.
        </li>
      </ul>

      <h2>3. Con qué finalidad y base legal</h2>
      <ul>
        <li>
          Valorar tu perfil deportivo y responderte — base legal: tu
          consentimiento al enviar el formulario o crear tu cuenta.
        </li>
        <li>
          Gestionar tu cuenta y tu galería de vídeos — base legal: la ejecución
          de la relación que solicitas al registrarte.
        </li>
        <li>
          Mostrar tu perfil público a clubes y agentes cuando tú lo publicas —
          base legal: tu consentimiento.
        </li>
        <li>
          Gestionar la representación, si te seleccionamos — base legal: la
          ejecución del acuerdo de representación que se firma aparte.
        </li>
      </ul>

      <h2>4. Cuánto tiempo conservamos tus datos</h2>
      <p>
        Conservamos tus datos mientras tu cuenta o tu perfil estén activos, o
        durante el tiempo necesario para atender tu solicitud. Después los
        bloqueamos durante los plazos legales que puedan aplicar y, pasados
        estos, los eliminamos. Puedes pedir su supresión en cualquier momento.
      </p>

      <h2>5. A quién comunicamos tus datos</h2>
      <p>
        No vendemos tus datos. Solo los compartimos con clubes o agentes
        interesados en tu perfil cuando tú lo autorizas al publicarlo, y con los
        proveedores tecnológicos que necesitamos para operar la web, que actúan
        como encargados del tratamiento por cuenta nuestra:
      </p>
      <ul>
        <li>
          Supabase — base de datos, autenticación y almacenamiento de fotos.
        </li>
        <li>
          Cloudflare — alojamiento de la web y de los vídeos (Cloudflare
          Stream).
        </li>
        <li>Vercel — alojamiento del entorno de la web.</li>
        <li>
          Google — inicio de sesión con tu cuenta de Google, si lo eliges.
        </li>
        <li>
          Web3Forms — envío de los formularios de contacto a nuestro correo.
        </li>
      </ul>

      <h2>6. Transferencias internacionales</h2>
      <p>
        Algunos de estos proveedores están ubicados fuera del Espacio Económico
        Europeo o pueden tratar datos en servidores fuera de él. En esos casos
        las transferencias se amparan en las garantías previstas por el RGPD,
        principalmente las Cláusulas Contractuales Tipo aprobadas por la Comisión
        Europea. Puedes pedirnos más información sobre estas garantías en{" "}
        <a href="mailto:info@turepresentante.com">info@turepresentante.com</a>.
      </p>

      <h2>7. Menores de edad</h2>
      <p>
        Si eres menor de edad, para tratar tus datos y, sobre todo, para publicar
        tu imagen o tus vídeos necesitamos el consentimiento expreso de tu padre,
        madre o tutor legal. No publicamos perfiles ni vídeos de menores de forma
        abierta sin ese consentimiento. Si detectamos datos de un menor sin la
        autorización correspondiente, los eliminamos.
      </p>

      <h2>8. Tus derechos</h2>
      <p>
        Puedes ejercer en cualquier momento tus derechos de acceso,
        rectificación, supresión, oposición, limitación del tratamiento y
        portabilidad, así como retirar el consentimiento que hayas dado,
        escribiendo a{" "}
        <a href="mailto:info@turepresentante.com">info@turepresentante.com</a>.
        También puedes borrar tu foto o tu cuenta desde tu propio panel.
      </p>
      <p>
        Si consideras que no hemos atendido bien tus derechos, puedes reclamar
        ante la Agencia Española de Protección de Datos (
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
          aepd.es
        </a>
        ).
      </p>

      <h2>9. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas razonables para proteger tus
        datos: conexión cifrada (HTTPS), control de acceso a la base de datos y
        acceso restringido a la información de contacto. Ningún sistema es
        infalible, pero trabajamos para minimizar los riesgos.
      </p>

      <h2>10. Cambios en esta política</h2>
      <p>
        Podemos actualizar esta política para adaptarla a cambios legales o de la
        plataforma. Si el cambio es relevante, lo indicaremos en esta página con
        la nueva fecha de actualización.
      </p>
    </LegalPage>
  );
}
