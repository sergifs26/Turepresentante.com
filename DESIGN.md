# DESIGN.md — Turepresentante.com

## Dirección: "electro-biomorfo"
El talento es un organismo vivo. La web respira, late y conduce electricidad.
Identidad heredada (no tocar): fondo negro `#0a0a0a`, acento ácido `#e8ff00`
(bioluminiscencia), tipografía Barlow Condensed 900 itálica para display.
Lo biomorfo se añade encima: membranas curvas, células, nervios de luz, pulso.

## Tokens
- Fondo: `#0a0a0a` · superficie: `#111` / `white/[0.02-0.04]`
- Tinta: `#f0f0ee` · secundario: `white/45` · terciario: `white/25`
- Acento único: `#e8ff00` (glow: `rgba(232,255,0,x)`)
- Fuentes: Barlow Condensed (display, var `--font-barlow-condensed`),
  Barlow (body), Geist Mono (labels/datos)
- Radios orgánicos: células asimétricas (`border-radius` 4 esquinas distintas),
  botones píldora (`rounded-full`), inputs `rounded-2xl`

## Lenguaje de motion (pulso biológico)
- `bio-breathe`: escala 1→1.04, 4-5s, ease-in-out, infinito (auras, blobs)
- `blob-morph`: border-radius morfando lento (8-12s) en blobs decorativos
- Glow en hover: `box-shadow 0 0 24-40px rgba(232,255,0,.2-.35)`
- Nervio de scroll en la home: SVG path que se dibuja con el scroll
- Easing de entrada: `[0.16, 1, 0.3, 1]` (expo-out). Nada de bounce.
- `prefers-reduced-motion`: todo estático (obligatorio)

## Gramática de secciones
- NO usar el eyebrow mono-uppercase repetido en cada sección (era la v1).
- Cada sección abre con titular display grande; los marcadores son "nodos"
  (punto de luz + texto) solo donde aportan.
- Los números 01/02/03 SOLO en el proceso (es una secuencia real).

## Componentes fx
- `components/fx/synapse-field.tsx`: red orgánica decorativa (nodos + curvas)
- `components/fx/nerve-line.tsx`: nervio vertical dibujado por scroll (home)
- `.bio-cell` (globals.css): tarjeta-membrana con radio orgánico y glow hover

## Reglas duras
- Legibilidad primero: el contenido va sobre fondos limpios; lo orgánico decora.
- Solo `transform`/`opacity`/`filter` en animación. Nada de layout props.
- Contraste AA: body `white/45` mínimo sobre `#0a0a0a` para texto largo.
- Un solo acento. El amarillo no se mezcla con otros colores de marca.
