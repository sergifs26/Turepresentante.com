/**
 * Red sináptica decorativa: nodos y conexiones curvas a muy baja
 * opacidad, como tejido nervioso de fondo. SVG estático (server-safe),
 * con deriva lenta vía CSS. aria-hidden siempre.
 */
export default function SynapseField({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ animation: "synapse-drift 14s ease-in-out infinite" }}
    >
      <svg
        className="w-full h-full opacity-[0.05]"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g stroke="#e8ff00" strokeWidth="1">
          <path d="M 80 120 C 240 60, 380 200, 520 150 S 800 80, 950 170" />
          <path d="M 120 420 C 300 360, 420 500, 620 440 S 920 380, 1100 460" />
          <path d="M 520 150 C 560 240, 600 340, 620 440" />
          <path d="M 950 170 C 990 260, 1050 360, 1100 460" />
          <path d="M 80 120 C 90 230, 110 320, 120 420" />
        </g>
        <g fill="#e8ff00">
          <circle cx="80" cy="120" r="4" />
          <circle cx="520" cy="150" r="5" />
          <circle cx="950" cy="170" r="4" />
          <circle cx="120" cy="420" r="5" />
          <circle cx="620" cy="440" r="4" />
          <circle cx="1100" cy="460" r="5" />
        </g>
      </svg>
    </div>
  );
}
