import type { Metadata } from "next";
import LegalPage from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Política de cookies — Turepresentante",
  description: "Qué cookies usa Turepresentante.com y para qué.",
};

export default function CookiesPage() {
  return (
    <LegalPage eyebrow="Legal" title="Cookies" updated="Julio 2026">
      <h2>1. Qué es una cookie</h2>
      <p>
        Una cookie es un pequeño archivo que un sitio web guarda en tu navegador
        para recordar información, por ejemplo que has iniciado sesión.
      </p>

      <h2>2. Qué cookies usamos</h2>
      <p>
        En Turepresentante solo usamos <strong>cookies técnicas o esenciales</strong>,
        imprescindibles para que la web funcione:
      </p>
      <ul>
        <li>
          Cookies de sesión que mantienen tu inicio de sesión mientras usas tu
          cuenta (gestionadas por nuestro proveedor de autenticación, Supabase).
        </li>
      </ul>
      <p>
        <strong>No usamos</strong> cookies de publicidad, de analítica ni de
        seguimiento de terceros, ni compartimos tu navegación con anunciantes.
      </p>

      <h2>3. Por qué no mostramos un banner de cookies</h2>
      <p>
        Las cookies estrictamente necesarias para prestar el servicio que
        solicitas (como mantener tu sesión iniciada) están exentas del deber de
        consentimiento, por lo que no es necesario un banner de aceptación. Si en
        el futuro incorporáramos cookies de analítica o de terceros, te pediríamos
        tu consentimiento antes de usarlas.
      </p>

      <h2>4. Cómo gestionarlas</h2>
      <p>
        Puedes borrar o bloquear las cookies desde la configuración de tu
        navegador en cualquier momento. Ten en cuenta que, si bloqueas las cookies
        de sesión, no podrás mantener tu inicio de sesión en la plataforma.
      </p>
    </LegalPage>
  );
}
