/** Reglas del vídeo, delante del subidor: que nadie suba nada sin saber
 *  qué aprobamos. Tono de PRODUCT.md: directo, sin humo. */

const SI = [
  "Imagen nítida y estable, grabada en horizontal y con buena luz.",
  "Editado: tus mejores jugadas seguidas, sin relleno ni paseos por el campo.",
  "Se te distingue en todo momento. Si hace falta, márcate con un círculo o una flecha.",
  "Máximo 10 minutos entre todos tus vídeos. Mejor 4 minutos buenos que 10 flojos.",
];

const NO = [
  "Partidos enteros sin editar, o grabados desde la grada a lo lejos.",
  "Vídeo pixelado, vertical, oscuro o con la cámara temblando.",
  "Clips en los que no se sepa cuál eres.",
  "Fotos, collages o vídeos con la marca de agua de otra aplicación.",
];

export default function VideoRules() {
  return (
    <div className="bio-cell px-6 py-6 md:px-8 md:py-7 mb-6">
      <div className="inline-flex items-center gap-2.5 border border-[#e8ff00]/25 rounded-full px-4 py-[7px]">
        <span className="bio-node" aria-hidden="true" />
        <span className="font-mono text-[12px] tracking-[0.2em] uppercase text-[#e8ff00]">
          Qué vídeo aprobamos
        </span>
      </div>

      <p className="mt-4 text-[16px] text-white/85 leading-[1.75] max-w-[620px]">
        Revisamos <strong className="font-semibold text-[#f0f0ee]">a mano</strong> cada
        vídeo antes de publicarlo. Solo aprobamos los que un club vería
        enteros: si el tuyo no da el nivel, te lo decimos y puedes volver a
        intentarlo.
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#e8ff00]">
            Sí
          </span>
          <ul className="mt-3 flex flex-col gap-2.5">
            {SI.map((t) => (
              <li key={t} className="flex gap-3 text-[15px] text-white/80 leading-[1.65]">
                <span className="text-[#e8ff00] flex-shrink-0" aria-hidden="true">
                  ✓
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/50">
            No
          </span>
          <ul className="mt-3 flex flex-col gap-2.5">
            {NO.map((t) => (
              <li key={t} className="flex gap-3 text-[15px] text-white/65 leading-[1.65]">
                <span className="text-white/40 flex-shrink-0" aria-hidden="true">
                  ✕
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-6 text-[15px] text-white/70 leading-[1.7] max-w-[620px] border-l-2 border-[#e8ff00]/40 pl-4">
        Buscamos jugadores que se lo tomen en serio. Un vídeo cuidado dice de
        ti tanto como una buena jugada.
      </p>
    </div>
  );
}
