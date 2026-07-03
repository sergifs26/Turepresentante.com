# 🗂️ Catálogo de Skills

Índice organizado **por función** de todas las skills instaladas (133 únicas, en 7 paquetes).
Están guardadas globalmente en `C:\Users\sergi\.claude\plugins\` → disponibles en **todos** los proyectos.

> Para activarlas en una sesión: actívalas en tu panel y **recarga Claude Code** (se cargan al arrancar).
> Uso: se invocan con la herramienta Skill (o escribiendo `/nombre-skill`).

---

## 🎨 Diseño · Frontend · UI/UX  ← *lo que usamos para rediseñar la web*

| Skill | Paquete | Para qué sirve |
|---|---|---|
| **design-taste-frontend** | taste-skill | Landing/portfolio/rediseños "anti-genéricos"; infiere la dirección de diseño desde el brief. **La principal para nuestra web.** |
| **redesign-existing-projects** | taste-skill | Audita una web existente, detecta patrones genéricos de IA y la sube a calidad premium. Ideal para "empezar de nuevo". |
| **high-end-visual-design** | taste-skill | Diseñar como agencia top: fuentes, espaciados, sombras, tarjetas y animaciones exactas. |
| **minimalist-ui** | taste-skill | Estilo editorial limpio: monocromo cálido, contraste tipográfico, bento grids, sin gradientes. |
| **industrial-brutalist-ui** | taste-skill | Interfaces brutalistas: rejillas rígidas, tipografía extrema, estética terminal/print suizo. |
| **gpt-taste** | taste-skill | UX/UI + motion GSAP avanzado; estructura AIDA, aleatorización real de layout. |
| **brandkit** | taste-skill | Genera tableros de marca, sistemas de logo, identidad visual (imágenes). |
| **image-to-code** | taste-skill | Genera primero la imagen de diseño y luego la convierte a código. |
| **imagegen-frontend-web** | taste-skill | Referencias de diseño web premium orientadas a conversión (imágenes). |
| **imagegen-frontend-mobile** | taste-skill | Conceptos de pantallas app-native (iOS/Android). |
| **stitch-design-taste** | taste-skill | Genera `DESIGN.md` con estándares de UI premium (Google Stitch). |
| **full-output-enforcement** | taste-skill | Fuerza generación de código completa, sin placeholders ni truncados. |
| **frontend-design** | frontend-design | Interfaces frontend distintivas de calidad producción. |
| **impeccable** | impeccable | Diseñar/rediseñar/pulir/auditar/animar UI con criterio. |
| **ui-ux-pro-max** | ui-ux-pro-max | Inteligencia UI/UX: 50+ estilos, 161 paletas, 57 pares de fuentes, 99 guías UX. |
| **ckm** | ui-ux-pro-max | Banners para redes, ads, heroes de web y assets creativos. |
| **generative-ui** | finance-skills | Sistema de diseño de la UI generativa de Claude (widgets inline). |

---

## 🛠️ Desarrollo · Flujo de trabajo (superpowers-dev)

| Skill | Para qué sirve |
|---|---|
| **brainstorming** | Explorar intención/requisitos ANTES de crear algo. Obligatoria antes de trabajo creativo. |
| **writing-plans** | Escribir un plan de implementación para tareas multi-paso. |
| **executing-plans** | Ejecutar un plan escrito con puntos de revisión. |
| **subagent-driven-development** | Ejecutar planes con tareas independientes vía subagentes. |
| **dispatching-parallel-agents** | Lanzar 2+ tareas independientes en paralelo. |
| **test-driven-development** | TDD: test antes que código. |
| **systematic-debugging** | Método para bugs/fallos antes de proponer arreglos. |
| **requesting-code-review** | Pedir revisión de código al terminar features. |
| **receiving-code-review** | Procesar feedback de revisión con rigor. |
| **verification-before-completion** | Verificar (ejecutando) antes de afirmar que algo funciona. |
| **finishing-a-development-branch** | Cerrar una rama de desarrollo (merge/PR/limpieza). |
| **using-git-worktrees** | Aislar trabajo en worktrees de git. |
| **writing-skills** | Crear/editar/verificar skills. |
| **using-superpowers** | Cómo encontrar y usar skills. |

---

## 🧩 Ingeniería · Arquitectura de código (ruflo)

| Skill | Para qué sirve |
|---|---|
| **adr-create / adr-index / adr-review** | Architecture Decision Records: crear, indexar, revisar cumplimiento. |
| **ddd-aggregate / ddd-context / ddd-validate** | Domain-Driven Design: agregados, contextos, validación de límites. |
| **sparc-spec / sparc-implement / sparc-refine** | Metodología SPARC (especificación→implementación→refinamiento). |
| **git-workflow / diff-analyze** | Flujos git avanzados; análisis de riesgo de diffs. |
| **migrate-create / migrate-validate** | Migraciones de base de datos con up/down y validación. |
| **api-docs / doc-gen** | Generar documentación (JSDoc/OpenAPI) y mantenerla. |
| **tdd-workflow / test-gaps** | TDD London School; detectar huecos de test. |
| **create-plugin / validate-plugin / discover-plugins** | Crear, validar y descubrir plugins de Claude Code. |
| **init-project / ruflo-doctor** | Inicializar proyecto ruflo; diagnóstico de instalación. |

---

## 🔒 Seguridad

| Skill | Paquete | Para qué sirve |
|---|---|---|
| **dependency-check** | ruflo | Escanear dependencias por CVEs/vulnerabilidades. |
| **security-scan** | ruflo | Escaneo de seguridad del código. |
| **safety-scan** | ruflo | Detectar prompt injection y contenido adversarial. |
| **pii-detect** | ruflo | Detectar datos personales (PII) en texto/código/config. |

---

## 🤖 Agentes · Swarm · Automatización (ruflo)

| Skill | Para qué sirve |
|---|---|
| **swarm-init / monitor-stream** | Iniciar swarm multi-agente; stream de eventos en vivo. |
| **workflow-create / workflow-run** | Crear y ejecutar workflows reutilizables. |
| **loop-worker / cron-schedule** | Workers en segundo plano (loop/cron). |
| **autopilot-loop / autopilot-predict** | Completado autónomo de tareas; predecir siguiente acción. |
| **daa-agent / cognitive-pattern** | Agentes adaptativos; patrones cognitivos. |
| **intelligence-route / neural-train** | Enrutar tareas al agente óptimo; entrenar patrones neuronales. |
| **wasm-agent / wasm-gallery** | Agentes WASM aislados; galería de la comunidad. |
| **federation-init / federation-status / federation-audit** | Federación cross-instalación (peers, salud, auditoría). |

---

## 🧠 Memoria · Vectores · Conocimiento (ruflo)

| Skill | Para qué sirve |
|---|---|
| **memory-bridge / memory-search** | Puentear/buscar memoria (RAG híbrido, Graph RAG). |
| **session-persist / rvf-manage** | Persistir sesiones; gestionar ficheros RVF de memoria portable. |
| **agentdb-query** | Consultar AgentDB (routing semántico, recall jerárquico). |
| **vector-search / vector-embed / vector-cluster / vector-hyperbolic** | Operaciones vectoriales (HNSW, embeddings, clustering, hiperbólico). |
| **kg-extract / kg-traverse** | Extraer y recorrer grafos de conocimiento. |
| **chat-format / llm-config** | Formatear prompts por proveedor; configurar inferencia local RuVLLM. |

---

## 🔬 Investigación · Objetivos (ruflo)

| Skill | Para qué sirve |
|---|---|
| **deep-research** | Investigación multi-fase (web + memoria + síntesis). |
| **research-synthesize** | Sintetizar hallazgos con grados de evidencia. |
| **dossier-collect** | Dossier en grafo sobre una entidad (fan-out paralelo). |
| **goal-plan** | Planes de acción orientados a objetivos (GOAP). |
| **horizon-track** | Objetivos de largo plazo con checkpoints entre sesiones. |

---

## 📊 Observabilidad · Costes (ruflo)

| Skill | Para qué sirve |
|---|---|
| **observe-metrics / observe-trace** | Métricas del sistema con anomalías; trazas de ejecución. |
| **cost-optimize / cost-report** | Optimizar uso de tokens; informe de costes en USD. |

---

## 🌐 Navegador · Web scraping (ruflo)

| Skill | Para qué sirve |
|---|---|
| **browser** | Automatización de navegador con snapshots para agentes. |
| **browser-scrape** | Extraer datos estructurados de páginas web. |
| **browser-test** | Testing automatizado de UI con Playwright. |

---

## 📈 Trading · Mercados (ruflo)

| Skill | Para qué sirve |
|---|---|
| **trader-signal / trader-backtest / trader-train** | Señales, backtesting y entrenamiento de modelos (neural-trader). |
| **trader-portfolio / trader-risk / trader-regime** | Optimización de cartera; riesgo (VaR/CVaR); régimen de mercado. |
| **market-ingest / market-pattern** | Ingestar OHLCV; detectar patrones de velas. |

---

## 🔌 IoT (ruflo · Cognitum Seed)

| Skill | Para qué sirve |
|---|---|
| **iot-register / iot-fleet** | Registrar dispositivos; gestionar flotas. |
| **iot-firmware** | Despliegue de firmware con canary. |
| **iot-anomalies / iot-witness-verify** | Anomalías de telemetría; integridad de cadena de testigos. |

---

## 💰 Finanzas · Mercados (finance-skills)

| Skill | Para qué sirve |
|---|---|
| **yfinance-data / funda-data** | Datos de mercado (Yahoo Finance / Funda AI API). |
| **earnings-preview / earnings-recap / estimate-analysis** | Previa y recap de resultados; estimaciones de analistas. |
| **etf-premium / options-payoff** | Premium/descuento de ETF vs NAV; curva de payoff de opciones. |
| **saas-valuation-compression / sepa-strategy** | Compresión de valoración SaaS; estrategia SEPA (Minervini). |
| **stock-correlation / stock-liquidity / finance-sentiment** | Correlaciones; liquidez; sentimiento (Reddit/X/news/Polymarket). |
| **hormuz-strait** | Estado del Estrecho de Ormuz (impacto en petróleo/comercio). |

---

## 📱 Lectores sociales (finance-skills · solo lectura)

| Skill | Para qué sirve |
|---|---|
| **twitter-reader / linkedin-reader / discord-reader / telegram-reader** | Leer redes para research financiero. |
| **yc-reader** | Consultar empresas y batches de Y Combinator. |

---

## 🚀 Startups · Meta (finance-skills)

| Skill | Para qué sirve |
|---|---|
| **startup-analysis** | Analizar una startup (VC / candidato / CEO). |
| **skill-creator** | Crear, mejorar y medir skills. |

---

*Generado automáticamente el 2026-07-03. Fuente: `C:\Users\sergi\.claude\plugins\marketplaces\`.*
