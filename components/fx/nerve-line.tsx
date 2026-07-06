"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * El nervio: una sinapsis vertical que recorre la home y se va
 * dibujando con el scroll, conectando jugador → evaluación → club.
 * Puramente decorativo (aria-hidden), solo transform/stroke en GPU.
 */
export default function NerveLine() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 55, damping: 22 });
  // Always partially visible so the page never depends on JS/scroll to show it
  const pathLength = useTransform(progress, [0, 1], [0.12, 1]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none hidden md:block"
      style={{ zIndex: 1 }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <filter id="nerve-glow" x="-50%" y="-2%" width="200%" height="104%">
            <feGaussianBlur stdDeviation="1.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path
          d="M 82 0
             C 82 60, 30 90, 26 150
             S 70 240, 74 300
             S 22 390, 20 450
             S 78 540, 80 600
             S 28 690, 26 750
             S 72 840, 74 900
             C 75 940, 50 970, 50 1000"
          stroke="#e8ff00"
          strokeWidth="1.1"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          filter="url(#nerve-glow)"
          style={{ pathLength, opacity: 0.16 }}
        />
      </svg>
    </div>
  );
}
