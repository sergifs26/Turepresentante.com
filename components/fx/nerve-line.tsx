"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

// The drawn portion of the path: always partially visible, completes on scroll
const DRAW_MIN = 0.12;

/* Trazado en coordenadas reales del contenedor (x,y en fracciones 0-1).
   Se genera en px para que el grosor del trazo, el dibujado por dash y
   getPointAtLength compartan el mismo espacio: sin desajustes. */
function nervePath(w: number, h: number) {
  const x = (f: number) => (f * w).toFixed(1);
  const y = (f: number) => (f * h).toFixed(1);
  return `M ${x(0.82)} 0
    C ${x(0.82)} ${y(0.06)}, ${x(0.3)} ${y(0.09)}, ${x(0.26)} ${y(0.15)}
    S ${x(0.7)} ${y(0.24)}, ${x(0.74)} ${y(0.3)}
    S ${x(0.22)} ${y(0.39)}, ${x(0.2)} ${y(0.45)}
    S ${x(0.78)} ${y(0.54)}, ${x(0.8)} ${y(0.6)}
    S ${x(0.28)} ${y(0.69)}, ${x(0.26)} ${y(0.75)}
    S ${x(0.72)} ${y(0.84)}, ${x(0.74)} ${y(0.9)}
    C ${x(0.75)} ${y(0.94)}, ${x(0.5)} ${y(0.97)}, ${x(0.5)} ${y(1)}`;
}

/**
 * El nervio: una sinapsis vertical que recorre la home, se dibuja con el
 * scroll y lleva un impulso eléctrico viajando por la punta. Las secciones
 * que cruza no llevan fondo propio: la línea pasa por detrás de tarjetas,
 * fotos y la membrana amarilla, como tejido bajo la piel.
 * Decorativo (aria-hidden), solo escritorio.
 */
export default function NerveLine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const totalLength = useRef(0);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 55, damping: 22 });
  const pathLength = useTransform(progress, [0, 1], [DRAW_MIN, 1]);

  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const placeDot = (drawn: number) => {
    const path = pathRef.current;
    if (!path || !totalLength.current) return;
    const pt = path.getPointAtLength(totalLength.current * Math.min(drawn, 1));
    dotX.set(pt.x);
    dotY.set(pt.y);
  };

  useMotionValueEvent(pathLength, "change", placeDot);

  // Mide la longitud y coloca el impulso cuando el trazado (re)aparece
  useEffect(() => {
    if (!size.w) return;
    const path = pathRef.current;
    if (!path) return;
    totalLength.current = path.getTotalLength();
    placeDot(pathLength.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  const d = size.w > 0 ? nervePath(size.w, size.h) : null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none hidden md:block"
      style={{ zIndex: 1 }}
    >
      {d && (
        <>
          {/* Glow con doble trazo: un filtro SVG re-rasterizaría el path
              en cada tick de scroll; dos strokes son casi gratis */}
          <svg className="w-full h-full" fill="none">
            <motion.path
              d={d}
              stroke="#e8ff00"
              strokeWidth="7"
              strokeLinecap="round"
              style={{ pathLength, opacity: 0.07 }}
            />
            <motion.path
              ref={pathRef}
              d={d}
              stroke="#e8ff00"
              strokeWidth="1.4"
              strokeLinecap="round"
              style={{ pathLength, opacity: 0.32 }}
            />
          </svg>

          {/* El impulso: viaja por la punta del nervio siguiendo el scroll */}
          <motion.div
            className="absolute top-0 left-0 w-[10px] h-[10px] -ml-[5px] -mt-[5px] rounded-full"
            style={{
              x: dotX,
              y: dotY,
              background: "#e8ff00",
              boxShadow:
                "0 0 10px 3px rgba(232,255,0,0.6), 0 0 34px 10px rgba(232,255,0,0.18)",
            }}
          />
        </>
      )}
    </div>
  );
}
