"use client";

import Link from "next/link";
import { useSession } from "@/lib/use-session";

/** CTA que cambia con la sesión: invita a crear cuenta al visitante
 *  y lleva a su panel a quien ya la tiene. */
export default function AuthCta({
  id,
  className,
  anonLabel,
  authLabel = "Ir a mi panel",
}: {
  id?: string;
  className: string;
  anonLabel: string;
  authLabel?: string;
}) {
  const session = useSession();
  const dentro = session.estado === "dentro";
  return (
    <Link id={id} href={dentro ? "/cuenta" : "/registro"} className={className}>
      {dentro ? authLabel : anonLabel}
    </Link>
  );
}
