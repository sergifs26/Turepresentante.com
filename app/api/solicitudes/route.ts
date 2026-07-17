import { NextResponse } from "next/server";

const TIPOS = {
  jugador: "Nueva solicitud de JUGADOR",
  club: "Nuevo contacto de CLUB / AGENTE",
  contacto: "Nuevo mensaje de CONTACTO",
} as const;

type Tipo = keyof typeof TIPOS;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Datos no válidos." },
      { status: 400 }
    );
  }

  // Honeypot: bots fill every field; humans never see this one
  if (typeof body._empresa === "string" && body._empresa.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const tipo = body.tipo as Tipo;
  const nombre = typeof body.nombre === "string" ? body.nombre.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!TIPOS[tipo] || nombre.length < 2 || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Revisa el nombre y el email: son obligatorios." },
      { status: 400 }
    );
  }

  // La clave de Web3Forms es pública por diseño (solo permite enviar al
  // buzón asociado). Va en el código como respaldo porque las variables
  // del dashboard de Cloudflare ya se han perdido una vez en un deploy.
  const accessKey =
    process.env.WEB3FORMS_ACCESS_KEY ?? "15408549-f732-41cc-a42f-57ce1d6dcf64";
  if (!accessKey) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "El envío no está activado todavía. Escríbenos a info@turepresentante.com.",
      },
      { status: 503 }
    );
  }

  // Flatten the submission into readable lines for the notification email
  const detalles = Object.entries(body)
    .filter(([k, v]) => !k.startsWith("_") && k !== "tipo" && v !== "" && v != null)
    .map(([k, v]) => `${k}: ${String(v)}`)
    .join("\n");

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `${TIPOS[tipo]} — ${nombre}`,
      from_name: "Turepresentante.com",
      email,
      message: detalles,
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { ok: false, error: "No hemos podido enviar tu solicitud. Inténtalo de nuevo." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
