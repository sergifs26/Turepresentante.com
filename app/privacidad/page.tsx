import type { Metadata } from "next";
import LegalPage from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Política de privacidad — Turepresentante",
  description:
    "Información sobre el tratamiento de datos personales en Turepresentante.com conforme al RGPD y la LOPDGDD.",
};

export default function PrivacidadPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacidad" updated="Julio 2026">
      <p>
        En Turepresentante nos comprometemos con la protección de tus datos
        personales y con la transparencia. Esta política explica, de forma clara,
        qué datos tratamos, con qué finalidad, con qué base jurídica y qué
        derechos tienes. Todo ello conforme al Reglamento (UE) 2016/679, General
        de Protección de Datos (RGPD), y a la Ley Orgánica 3/2018, de Protección
        de Datos Personales y garantía de los derechos digitales (LOPDGDD).
      </p>

      <h2>1. Responsable del tratamiento</h2>
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
            Avinguda al Vedat, 180, Planta 1, Local 1, 46900 Torrent (Valencia),
            España
          </strong>
        </li>
        <li>
          Correo:{" "}
          <a href="mailto:info@turepresentante.com">info@turepresentante.com</a>
        </li>
        <li>Sitio web: turepresentante.com</li>
      </ul>

      <h2>2. Información y consentimiento</h2>
      <p>
        Al facilitarnos tus datos a través de los formularios, del registro de tu
        cuenta o al subir contenido, declaras haber leído y entendido esta
        política y consientes el tratamiento de tus datos para las finalidades
        indicadas. Si nos facilitas datos de terceros, te comprometes a haberles
        informado y a contar con su consentimiento.
      </p>

      <h2>3. Datos que tratamos</h2>
      <ul>
        <li>
          <strong>Identificación y contacto:</strong> nombre y apellidos, email,
          teléfono y ciudad o provincia.
        </li>
        <li>
          <strong>Datos deportivos:</strong> posición, pierna dominante, club,
          categoría, año de nacimiento, trayectoria, así como las fotografías y
          vídeos que subes.
        </li>
        <li>
          <strong>Datos de cuenta:</strong> credenciales de registro e inicio de
          sesión, incluida la información básica de tu cuenta de Google si eliges
          ese método de acceso.
        </li>
        <li>
          <strong>Datos técnicos de navegación</strong> imprescindibles para el
          funcionamiento del sitio (ver la <a href="/cookies">política de cookies</a>).
        </li>
      </ul>
      <p>
        No solicitamos ni tratamos categorías especiales de datos (salud,
        ideología, origen, etc.). Te pedimos que no incluyas ese tipo de
        información en los campos de texto libre ni en tus vídeos.
      </p>

      <h2>4. Finalidades y base jurídica del tratamiento</h2>
      <ul>
        <li>
          <strong>Valorar tu perfil deportivo y responderte.</strong> Base
          jurídica: tu consentimiento (art. 6.1.a RGPD), otorgado al enviar el
          formulario o crear la cuenta.
        </li>
        <li>
          <strong>Crear y gestionar tu cuenta y tu galería de vídeos.</strong>{" "}
          Base jurídica: la ejecución de la relación que solicitas al registrarte
          (art. 6.1.b RGPD).
        </li>
        <li>
          <strong>Publicar tu perfil</strong> para que clubes y agentes puedan
          descubrirte. Base jurídica: tu consentimiento (art. 6.1.a RGPD), que
          puedes retirar en cualquier momento.
        </li>
        <li>
          <strong>Gestionar la representación</strong>, si te seleccionamos. Base
          jurídica: la ejecución del acuerdo de representación que se firma aparte
          (art. 6.1.b RGPD).
        </li>
        <li>
          <strong>Cumplir obligaciones legales</strong> (fiscales, contables o de
          otro tipo). Base jurídica: el cumplimiento de una obligación legal (art.
          6.1.c RGPD).
        </li>
      </ul>
      <p>
        No tomamos decisiones automatizadas ni elaboramos perfiles con efectos
        jurídicos sobre ti.
      </p>

      <h2>5. Plazos de conservación</h2>
      <ul>
        <li>
          Datos de tu cuenta y perfil: mientras la cuenta esté activa. Si la
          eliminas o solicitas su baja, se suprimen.
        </li>
        <li>
          Datos de solicitudes o contacto: durante el tiempo necesario para
          atenderlas y, después, el plazo preciso para atender posibles
          responsabilidades.
        </li>
        <li>
          Datos con obligación legal de conservación: durante los plazos que exija
          la normativa aplicable.
        </li>
      </ul>
      <p>
        Una vez concluidos estos plazos, los datos se bloquean y posteriormente se
        eliminan de forma segura.
      </p>

      <h2>6. Destinatarios y encargados del tratamiento</h2>
      <p>
        No vendemos ni cedemos tus datos a terceros para su explotación comercial.
        Solo se comunican:
      </p>
      <ul>
        <li>
          A los clubes o agentes interesados en tu perfil, cuando tú lo autorizas
          al publicarlo.
        </li>
        <li>
          A organismos públicos o autoridades cuando exista una obligación legal.
        </li>
        <li>
          A los proveedores tecnológicos que necesitamos para operar la web, que
          actúan como encargados del tratamiento por cuenta nuestra y bajo el
          correspondiente contrato:
        </li>
      </ul>
      <ul>
        <li>
          <strong>Supabase</strong> — base de datos, autenticación y
          almacenamiento de fotografías.
        </li>
        <li>
          <strong>Cloudflare</strong> — alojamiento del sitio y de los vídeos
          (Cloudflare Stream).
        </li>
        <li>
          <strong>Vercel</strong> — alojamiento del entorno de la aplicación.
        </li>
        <li>
          <strong>Google</strong> — inicio de sesión con tu cuenta de Google, si
          lo eliges.
        </li>
        <li>
          <strong>Web3Forms</strong> — entrega de los formularios de contacto a
          nuestro correo.
        </li>
      </ul>

      <h2>7. Transferencias internacionales</h2>
      <p>
        Algunos de estos proveedores son empresas que pueden tratar datos fuera
        del Espacio Económico Europeo. En tales casos, las transferencias se
        realizan con las garantías adecuadas previstas por el RGPD,
        fundamentalmente las Cláusulas Contractuales Tipo aprobadas por la
        Comisión Europea, o bien a países con decisión de adecuación. Puedes
        solicitarnos información adicional sobre estas garantías escribiendo a{" "}
        <a href="mailto:info@turepresentante.com">info@turepresentante.com</a>.
      </p>

      <h2>8. Menores de edad</h2>
      <p>
        Para tratar los datos de un menor y, en particular, para publicar su
        imagen o sus vídeos, se requiere el consentimiento expreso de su padre,
        madre o tutor legal. No publicamos de forma abierta perfiles ni vídeos de
        menores sin dicho consentimiento. Si detectamos datos de un menor sin la
        autorización correspondiente, procederemos a eliminarlos.
      </p>

      <h2>9. Tus derechos</h2>
      <p>
        Puedes ejercer en cualquier momento los siguientes derechos:
      </p>
      <ul>
        <li>
          <strong>Acceso:</strong> saber qué datos tuyos tratamos.
        </li>
        <li>
          <strong>Rectificación:</strong> corregir datos inexactos o incompletos.
        </li>
        <li>
          <strong>Supresión:</strong> pedir que eliminemos tus datos.
        </li>
        <li>
          <strong>Oposición</strong> y <strong>limitación</strong> del tratamiento
          en los supuestos previstos.
        </li>
        <li>
          <strong>Portabilidad:</strong> recibir tus datos en un formato
          estructurado.
        </li>
        <li>
          <strong>Retirar el consentimiento</strong> en cualquier momento, sin que
          ello afecte a la licitud del tratamiento previo.
        </li>
      </ul>
      <p>
        Para ejercerlos, escríbenos a{" "}
        <a href="mailto:info@turepresentante.com">info@turepresentante.com</a>{" "}
        indicando el derecho que deseas ejercer; podremos solicitarte que acredites
        tu identidad. Responderemos en el plazo máximo de un mes. Además, puedes
        gestionar directamente tu perfil y eliminar tu foto o tu cuenta desde tu
        panel.
      </p>
      <p>
        Si consideras que no hemos atendido correctamente tu solicitud, tienes
        derecho a presentar una reclamación, de forma gratuita, ante la Agencia
        Española de Protección de Datos (C/ Jorge Juan, 6, 28001 Madrid;{" "}
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
          aepd.es
        </a>
        ).
      </p>

      <h2>10. Veracidad y actualización de los datos</h2>
      <p>
        Los datos que nos facilitas deben ser veraces y estar actualizados. Eres
        responsable de la exactitud de la información que aportas y te comprometes
        a comunicarnos cualquier cambio. No incluyas datos de terceros sin su
        consentimiento.
      </p>

      <h2>11. Medidas de seguridad</h2>
      <p>
        Aplicamos las medidas técnicas y organizativas apropiadas para garantizar
        un nivel de seguridad adecuado al riesgo: conexión cifrada (HTTPS), control
        de acceso a la base de datos mediante políticas de seguridad a nivel de
        fila, acceso restringido a la información de contacto y revisión periódica
        de nuestras medidas. Ningún sistema es infalible, pero trabajamos para
        minimizar los riesgos.
      </p>

      <h2>12. Cambios en esta política</h2>
      <p>
        Podemos actualizar esta política para adaptarla a novedades legislativas,
        jurisprudenciales o de la propia plataforma. Cuando el cambio sea
        relevante, lo indicaremos en esta página con la nueva fecha de
        actualización.
      </p>
    </LegalPage>
  );
}
