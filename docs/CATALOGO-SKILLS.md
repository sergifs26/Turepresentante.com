# 🗂️ Catálogo de Skills (real, verificado)

Todas las skills viven en **UNA sola carpeta**: `C:\Users\sergi\.claude\skills\`.
Se cargan **solas** en todos los proyectos al arrancar Claude Code — **sin panel, sin plugins**.
Total: **58 skills**. Para usarlas solo hay que invocarlas con la herramienta Skill (o `/nombre`).
El nombre de invocación (columna Skill) puede diferir del nombre de la carpeta.

> Regla de trabajo: en cada petición, Claude elige la skill más adecuada de esta lista y la usa.

---

## 🎨 Diseño · Frontend · Web  ← *lo que usamos para la web*
| Skill (nombre de invocación) | Para qué sirve |
|---|---|
| **design-taste-frontend** | Frontend anti-genérico para landings, portfolios y rediseños. Infiere la dirección de diseño desde el brief. **La principal para nuestra web.** |
| **redesign-existing-projects** | Audita una web existente, detecta patrones genéricos de IA y la sube a calidad premium sin romper nada. |
| **impeccable** | Diseñar/rediseñar/criticar/auditar/pulir/animar cualquier interfaz frontend con criterio. |
| **frontend-design** | Interfaces frontend distintivas de calidad producción, evitando estética "IA genérica". |
| **high-end-visual-design** (soft-skill) | Diseñar como agencia top: fuentes, espaciados, sombras, tarjetas y animaciones exactas. |
| **ui-ux-pro-max** | Inteligencia UI/UX: 50+ estilos, 161 paletas, 57 pares de fuentes, 99 guías UX, 25 tipos de gráfico. |
| **minimalist-ui** (minimalist-skill) | Estilo editorial limpio: monocromo cálido, contraste tipográfico, bento grids, sin gradientes. |
| **industrial-brutalist-ui** (brutalist-skill) | Interfaces brutalistas: rejillas rígidas, tipografía extrema, estética terminal/print suizo. |
| **gpt-taste** | UX/UI + motion GSAP avanzado; estructura AIDA, aleatorización real de layout. |
| **adrian-saenz-hostinger-premium-website** | Webs estáticas premium listas para subir a Hostinger/host estático. |
| **ckm:design** | Skill de diseño integral: identidad, tokens, UI, logos (55 estilos), CIP, presentaciones, banners, iconos. |
| **ckm:ui-styling** | UIs accesibles con shadcn/ui + Tailwind y diseños en canvas. |
| **ckm:design-system** | Arquitectura de tokens (primitive→semantic→component) y specs de componentes. |
| **ckm:brand** | Voz de marca, identidad visual, frameworks de mensaje, consistencia de marca. |
| **ckm:banner-design** | Banners para redes, ads, heroes de web, assets creativos y print. |
| **ckm:slides** | Presentaciones HTML estratégicas con Chart.js y design tokens. |
| **brandkit** | Genera tableros de marca, sistemas de logo, identidad visual (imágenes). |
| **stitch-design-taste** | Genera `DESIGN.md` con estándares de UI premium (Google Stitch). |
| **image-to-code** | Genera primero la imagen de diseño y luego la convierte a código. |
| **imagegen-frontend-web** | Referencias de diseño web premium orientadas a conversión (una imagen por sección). |
| **imagegen-frontend-mobile** | Conceptos de pantallas app-native (iOS/Android). |
| **full-output-enforcement** (output-skill) | Fuerza generación de código completa, sin placeholders ni truncados. |
| **generative-ui** | Sistema de diseño de la UI generativa de Claude: widgets HTML/SVG inline. |

## 🛠️ Desarrollo · Flujo de trabajo (superpowers)
| Skill | Para qué sirve |
|---|---|
| **brainstorming** | Explorar intención/requisitos ANTES de cualquier trabajo creativo. Obligatoria antes de crear/modificar. |
| **writing-plans** | Escribir un plan para tareas multi-paso a partir de un spec. |
| **executing-plans** | Ejecutar un plan escrito con puntos de revisión. |
| **subagent-driven-development** | Ejecutar planes con tareas independientes en la sesión actual. |
| **dispatching-parallel-agents** | Repartir 2+ tareas independientes en agentes paralelos. |
| **test-driven-development** | TDD: tests antes del código, para cualquier feature/bugfix. |
| **systematic-debugging** | Depuración sistemática ante cualquier bug o fallo, antes de proponer arreglos. |
| **verification-before-completion** | Verificar (con evidencia) antes de dar algo por terminado. |
| **requesting-code-review** | Pedir revisión de código al terminar una tarea o antes de fusionar. |
| **receiving-code-review** | Procesar feedback de revisión con rigor técnico. |
| **using-git-worktrees** | Aislar trabajo en git worktrees. |
| **finishing-a-development-branch** | Cerrar una rama: merge, PR o limpieza. |
| **using-superpowers** | Cómo encontrar y usar las skills. |
| **writing-skills** | Crear/editar/verificar skills. |
| **skill-creator** | Crear skills desde cero, mejorarlas y medir su rendimiento. |

## 📈 Finanzas · Mercados · Datos
| Skill | Para qué sirve |
|---|---|
| **yfinance-data** | Precios, históricos, estados financieros, opciones, dividendos vía yfinance. |
| **funda-data** | Datos financieros de la API Funda AI (quotes, SEC, earnings, opciones, sentimiento). |
| **finance-sentiment** | Sentimiento de una acción en Reddit, X, noticias y Polymarket. |
| **earnings-preview** | Briefing pre-resultados de una acción. |
| **earnings-recap** | Análisis post-resultados. |
| **estimate-analysis** | Estimaciones de analistas y su evolución. |
| **stock-correlation** | Correlaciones y pares de trading. |
| **stock-liquidity** | Liquidez: spreads, volumen, profundidad de mercado. |
| **etf-premium** | Prima/descuento de un ETF sobre su NAV. |
| **options-payoff** | Gráfico interactivo de payoff de opciones. |
| **sepa-strategy** | Análisis con metodología SEPA de Minervini (VCP, trend template). |
| **saas-valuation-compression** | Compresión de múltiplos de valoración SaaS entre rondas. |
| **startup-analysis** | Analizar una startup (VC, candidato, fundador). |
| **hormuz-strait** | Estado del Estrecho de Ormuz (tráfico, petróleo, riesgo). |

## 📰 Lectores sociales (research, solo lectura)
| Skill | Para qué sirve |
|---|---|
| **twitter-reader** | Leer Twitter/X para research financiero. |
| **discord-reader** | Leer canales de Discord. |
| **telegram-reader** | Leer canales/grupos de Telegram. |
| **linkedin-reader** | Leer feed/posts de LinkedIn. |
| **yc-reader** | Datos de Y Combinator (empresas, batches). |

---

### Notas de mantenimiento
- Para añadir una skill nueva: copia su carpeta (con su `SKILL.md`) dentro de `C:\Users\sergi\.claude\skills\` y reinicia Claude Code.
- Ya no se usa el panel de plugins ni `enabledPlugins` para las skills.
- Origen de las skills de diseño: `C:\Users\sergi\OneDrive\Documentos\tu representante 3\skills-library` (paquetes taste-skill, ui-ux-pro-max-skill, impeccable, frontend-design). Copiadas a la carpeta central el 2026-07-03.
- El paquete `ruflo` (100+ skills de infra/trading) NO se copió; si alguna hace falta, se copia su carpeta desde skills-library.
