/** Cinta de marca continua bajo el hero: identidad en movimiento.
 *  Dos copias del mismo contenido para un loop perfecto. */
export default function BrandMarquee() {
  const items = Array.from({ length: 4 });
  const Copy = () => (
    <div className="flex items-center flex-shrink-0">
      {items.map((_, i) => (
        <span key={i} className="flex items-center">
          <span
            className="uppercase leading-none tracking-[-0.02em] text-transparent px-6"
            style={{
              fontFamily: "var(--font-barlow-condensed)",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(56px, 8vw, 110px)",
              WebkitTextStroke: "1.5px rgba(232,255,0,0.5)",
            }}
          >
            Turepresentante®
          </span>
          <span
            className="uppercase leading-none tracking-[-0.02em] text-[#e8ff00] px-6"
            style={{
              fontFamily: "var(--font-barlow-condensed)",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(56px, 8vw, 110px)",
            }}
          >
            Hazte ver
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden py-8 md:py-10 border-y border-white/[0.06] select-none"
    >
      <div className="marquee-track">
        <Copy />
        <Copy />
      </div>
    </div>
  );
}
