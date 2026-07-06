"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Halo eléctrico que sigue al cursor con inercia de resorte.
 * Solo escritorio con puntero fino y sin reduced-motion.
 */
export default function ElectroCursor() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 120, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 120, damping: 18, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    const move = (e: MouseEvent) => {
      x.set(e.clientX - 14);
      y.set(e.clientY - 14);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 w-7 h-7 rounded-full pointer-events-none z-[60]"
      style={{
        x: sx,
        y: sy,
        background:
          "radial-gradient(circle, rgba(232,255,0,0.35) 0%, rgba(232,255,0,0.08) 45%, transparent 70%)",
      }}
    />
  );
}
