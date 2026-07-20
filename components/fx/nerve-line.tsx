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

// Trozo mínimo siempre dibujado: la raíz que asoma bajo la bota
const DRAW_MIN = 0.08;

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
 * El nervio: nace en la bota, termina en el botón de crear perfil, y su
 * punta (con el impulso) viaja SIEMPRE a la altura del centro de la
 * pantalla mientras haces scroll: te acompaña de principio a fin.
 * Anclado a #nerve-origin y #nerve-end. Decorativo, solo escritorio.
 */
export default function NerveLine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const totalLength = useRef(0);
  // Muestreo longitud→Y para invertir "¿qué fracción del nervio está a
  // esta altura?" (la Y del trazado siempre crece, así que es biyectivo)
  const samples = useRef<{ len: number; x: number; y: number }[]>([]);
  const contTopAbs = useRef(0);
  const [d, setD] = useState<string | null>(null);
  const [startPt, setStartPt] = useState<Pt | null>(null);
  const [endPt, setEndPt] = useState<Pt | null>(null);

  const { scrollY } = useScroll();
  const rawDrawn = useMotionValue(DRAW_MIN);
  const drawn = useSpring(rawDrawn, { stiffness: 75, damping: 21 });

  // La sinapsis final se enciende cuando el impulso llega al botón
  const endOpacity = useTransform(drawn, [0.9, 0.99], [0, 1]);
  const endScale = useTransform(drawn, [0.9, 0.99], [0.5, 1]);

  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);

  const yToFraction = (y: number) => {
    const s = samples.current;
    const total = totalLength.current;
    if (!s.length || !total) return DRAW_MIN;
    if (y <= s[0].y) return DRAW_MIN;
    if (y >= s[s.length - 1].y) return 1;
    let lo = 0;
    let hi = s.length - 1;
    while (lo < hi - 1) {
      const mid = (lo + hi) >> 1;
      if (s[mid].y < y) lo = mid;
      else hi = mid;
    }
    const a = s[lo];
    const b = s[hi];
    const t = (y - a.y) / (b.y - a.y || 1);
    const len = a.len + t * (b.len - a.len);
    return Math.min(1, Math.max(DRAW_MIN, len / total));
  };

  // La punta del nervio persigue el centro del viewport
  const update = useCallback(
    (sy: number) => {
      const targetY = sy + window.innerHeight * 0.5 - contTopAbs.current;
      rawDrawn.set(yToFraction(targetY));
    },
    [rawDrawn]
  );

  useMotionValueEvent(scrollY, "change", update);

  const measure = useCallback(() => {
    const cont = containerRef.current;
    const origin = document.getElementById("nerve-origin");
    const end = document.getElementById("nerve-end");
    if (!cont || !origin || !end) return;
    const c = cont.getBoundingClientRect();
    const o = origin.getBoundingClientRect();
    const e = end.getBoundingClientRect();
    if (!c.width || !c.height) return;
    contTopAbs.current = c.top + window.scrollY;

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
    const t = setTimeout(measure, 400);
    return () => {
      ro.disconnect();
      clearTimeout(t);
    };
  }, [measure]);

  // El punto viaja interpolando los puntos ya muestreados: getPointAtLength
  // en cada frame del scroll era carísimo (re-calcula la geometría del path)
  // y era la causa principal del tirón en escritorio.
  const placeDot = (frac: number) => {
    const s = samples.current;
    const N = s.length - 1;
    if (N < 1) return;
    const pos = Math.min(Math.max(frac, 0), 1) * N;
    const i = Math.floor(pos);
    const t = pos - i;
    const a = s[i];
    const b = s[Math.min(i + 1, N)];
    dotX.set(a.x + (b.x - a.x) * t);
    dotY.set(a.y + (b.y - a.y) * t);
  };

  useMotionValueEvent(drawn, "change", placeDot);

  // Al (re)generarse el trazado: medir longitud, muestrear y colocar todo
  useEffect(() => {
    const path = pathRef.current;
    if (!path || !d) return;
    const total = path.getTotalLength();
    totalLength.current = total;
    const N = 240;
    const s: { len: number; x: number; y: number }[] = [];
    for (let i = 0; i <= N; i++) {
      const len = (total * i) / N;
      const pt = path.getPointAtLength(len);
      s.push({ len, x: pt.x, y: pt.y });
    }
    samples.current = s;
    update(window.scrollY);
    placeDot(drawn.get());
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
          {/* El nervio se dibuja conforme bajas (pathLength). Lo que era
              carísimo no era esto, sino el getPointAtLength del punto en
              cada frame (ya sustituido por interpolación). */}
          <svg className="w-full h-full" fill="none">
            <motion.path
              d={d}
              stroke="#e8ff00"
              strokeWidth="7"
              strokeLinecap="round"
              style={{ pathLength: drawn, opacity: 0.07 }}
            />
            <motion.path
              ref={pathRef}
              d={d}
              stroke="#e8ff00"
              strokeWidth="1.4"
              strokeLinecap="round"
              style={{ pathLength: drawn, opacity: 0.32 }}
            />
          </svg>

          {/* Origen: la señal nace en la bota. Posición inline porque
              .bio-node (CSS sin capa) pisaría la utilidad `absolute` */}
          <span
            className="bio-node"
            style={{ position: "absolute", left: startPt.x - 3.5, top: startPt.y - 3.5 }}
          />

          {/* El impulso: siempre a la altura del centro de tu pantalla */}
          <motion.div
            data-nerve-dot
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
