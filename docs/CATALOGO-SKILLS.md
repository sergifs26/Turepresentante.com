# 🗂️ Catálogo de Skills (real, verificado)

Todas las skills viven en **UNA sola carpeta**: `C:\Users\sergi\.claude\skills\`.
Se cargan **solas** en todos los proyectos al arrancar Claude Code — **sin panel, sin plugins**.
Total: **35 skills**. Para usarlas solo hay que invocarlas con la herramienta Skill (o `/nombre`).

> Regla de trabajo: en cada petición, Claude elige la skill más adecuada de esta lista y la usa.

---

## 🎨 Diseño · Frontend · Web
| Skill | Para qué sirve |
|---|---|
| **adrian-saenz-hostinger-premium-website** | Webs estáticas premium (HTML/CSS/JS) listas para subir a Hostinger o cualquier host estático. Diseño editorial, animaciones 2026, 3D, parallax. **La principal para la web.** |
| **generative-ui** | Sistema de diseño de la UI generativa de Claude: widgets HTML/SVG interactivos inline. |

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
- Los antiguos paquetes de diseño del catálogo previo (taste-skill, ui-ux-pro-max, impeccable, frontend-design) **no estaban instalados** en el equipo; si se quieren, hay que instalarlos aparte.
