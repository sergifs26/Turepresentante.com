"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

// The drawn portion of the path: always partially visible, completes on scroll
const DRAW_MIN = 0.1;

/* Puntos de paso del zigzag (x en fracción del ancho, f en fracción del
   trayecto vertical entre la bota y el botón final) */
const WEAVE = [
  { x: 0.24, f: 0.14 },
  { x: 0.76, f: 0.3 },
  { x: 0.2, f: 0.46 },
  { x: 0.8, f: 0.62 },
  { x: 0.26, f: 0.78 },
  { x: 0.55, f: 0.9 },
];

type Pt = { x: number; y: number };

/* Cadena de cúbicas con tangente vertical en cada punto: curvas en S
   suaves, sin esquinas, construidas en píxeles reales */
function buildPath(pts: Pt[]) {
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const midY = ((a.y + b.y) / 2).toFixed(1);
    d += ` C ${a.x.toFixed(1)} ${midY}, ${b.x.toFixed(1)} ${midY}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  }
  return d;
}

/**
 * El nervio: la historia de la página hecha línea. Nace en la bota del
 * hero (tu talento), se dibuja con el scroll atravesando plataforma,
 * proceso y escaparate, y termina conectándose al botón "Crear mi
 * perfil gratis", donde la sinapsis se enciende: talento → conexión →
 * tu perfil. Anclado a los elementos reales (#nerve-origin, #nerve-end).
 * Decorativo (aria-hidden), solo escritorio.
 */
export default function NerveLine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const totalLength = useRef(0);
  const [d, setD] = useState<string | null>(null);
  const [startPt, setStartPt] = useState<Pt | null>(null);
  const [endPt, setEndPt] = useState<Pt | null>(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 55, damping: 22 });
  const pathLength = useTransform(progress, [0, 1], [DRAW_MIN, 1]);

  // La sinapsis final se enciende cuando el impulso llega al botón
  const endOpacity = useTransform(progress, [0.86, 0.98], [0, 1]);
  const endScale = useTransform(progress, [0.86, 0.98], [0.5, 1]);

  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);

  const measure = useCallback(() => {
    const cont = containerRef.current;
    const origin = document.getElementById("nerve-origin");
    const end = document.getElementById("nerve-end");
    if (!cont || !origin || !end) return;
    const c = cont.getBoundingClientRect();
    const o = origin.getBoundingClientRect();
    const e = end.getBoundingClientRect();
    if (!c.width || !c.height) return;

    // Nace bajo el empeine de la bota; muere enchufado al lateral del botón
    const start: Pt = {
      x: o.left - c.left + o.width * 0.5,
      y: o.top - c.top + o.height * 0.58,
    };
    const goal: Pt = {
      x: e.left - c.left - 13,
      y: e.top - c.top + e.height * 0.5,
    };
    const pts: Pt[] = [
      start,
      ...WEAVE.map((p) => ({
        x: p.x * c.width,
        y: start.y + (goal.y - start.y) * p.f,
      })),
      goal,
    ];
    setStartPt(start);
    setEndPt(goal);
    setD(buildPath(pts));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    // Remedición tras hidratar y cargar fuentes (el alto del hero es dvh)
    const t = setTimeout(measure, 400);
    return () => {
      ro.disconnect();
      clearTimeout(t);
    };
  }, [measure]);

  const placeDot = (drawn: number) => {
    const path = pathRef.current;
    if (!path || !totalLength.current) return;
    const pt = path.getPointAtLength(totalLength.current * Math.min(drawn, 1));
    dotX.set(pt.x);
    dotY.set(pt.y);
  };

  useMotionValueEvent(pathLength, "change", placeDot);

  useEffect(() => {
    const path = pathRef.current;
    if (!path || !d) return;
    totalLength.current = path.getTotalLength();
    placeDot(pathLength.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none hidden md:block"
      style={{ zIndex: 1 }}
    >
      {d && startPt && endPt && (
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

          {/* Origen: la señal nace en la bota. Posición inline porque
              .bio-node (CSS sin capa) pisaría la utilidad `absolute` */}
          <span
            className="bio-node"
            style={{ position: "absolute", left: startPt.x - 3.5, top: startPt.y - 3.5 }}
          />

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

          {/* Sinapsis final: el anillo se enciende al conectar con el CTA */}
          <motion.div
            className="absolute w-[26px] h-[26px] rounded-full border border-[#e8ff00]"
            style={{
              left: endPt.x - 13,
              top: endPt.y - 13,
              opacity: endOpacity,
              scale: endScale,
              boxShadow:
                "0 0 14px 2px rgba(232,255,0,0.45), inset 0 0 8px rgba(232,255,0,0.3)",
            }}
          />
        </>
      )}
    </div>
  );
}
