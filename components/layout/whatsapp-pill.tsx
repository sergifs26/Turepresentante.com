// Número oficial de contacto (es público: aparece en el chat de cada visitante).
// Se puede sustituir sin tocar código con NEXT_PUBLIC_WHATSAPP_NUMBER.
const NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+34682744331";

/** Píldora flotante de WhatsApp. Solo aparece si hay número configurado
 *  (NEXT_PUBLIC_WHATSAPP_NUMBER, formato internacional sin espacios). */
export default function WhatsappPill() {
  if (!NUMBER) return null;
  const href = `https://wa.me/${NUMBER.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Hola, os escribo desde turepresentante.com"
  )}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bio-btn fixed bottom-5 right-5 z-40 flex items-center gap-2.5 bg-[#0f0f0f] border border-[#e8ff00]/35 text-[#f0f0ee] font-mono text-[12px] tracking-[0.12em] uppercase px-5 py-3 no-underline shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#e8ff00" aria-hidden="true">
        <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm5.4 14.1c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-2.9-1.3-4.8-4.2-5-4.4-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4.2.5.7 1.8.8 1.9.1.1.1.3 0 .5l-.4.6c-.1.2-.3.4-.1.7.1.3.7 1.1 1.5 1.8 1 .9 1.9 1.2 2.2 1.3.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3.1.2.1.8-.1 1.2z" />
      </svg>
      ¿Dudas? Escríbenos
    </a>
  );
}
