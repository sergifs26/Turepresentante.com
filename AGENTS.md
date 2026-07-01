<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:deployment-workflow -->
# Flujo de trabajo OBLIGATORIO (deploy + versiones)

Este es el procedimiento fijo del proyecto. Aplícalo SIEMPRE y de forma
automática, sin pedir que se repita. El usuario no es técnico: encárgate tú
de todos los pasos de git/deploy.

## Ramas y hosting
- `main`    → PRODUCCIÓN. Se despliega solo en **Cloudflare** (Workers, adaptador
  `@opennextjs/cloudflare`). Es el sitio real. NUNCA se trabaja directo aquí.
- `pruebas` → STAGING. Se despliega solo en **Vercel** (`turepresentante-com.vercel.app`).
  Aquí se prueba TODO antes de producción.

## Regla de oro
NUNCA hacer commit/push directo a `main`. TODO cambio va primero a `pruebas`.
Producción (`main`) solo se actualiza fusionando desde `pruebas`, y SOLO
después de que el usuario haya revisado en Vercel y dé el OK.

## Procedimiento por cada cambio
1. Asegúrate de estar en `pruebas` (`git checkout pruebas`).
2. Haz el cambio. Cada cambio = un commit con mensaje claro y descriptivo
   (cada commit es una "versión" visible en el historial).
3. `git push origin pruebas` → se despliega en Vercel automáticamente.
4. Avisa al usuario para que lo revise en la URL de Vercel.
5. Cuando el usuario apruebe → fusiona a producción:
   `git checkout main && git merge pruebas && git push origin main`
   → Cloudflare publica producción.
6. Etiqueta la versión de producción (ver abajo) y vuelve a `pruebas`.

## Versionado (tags semánticos en `main`)
En cada publicación a producción, crea y sube un tag `vMAYOR.MENOR.PARCHE`:
- PARCHE (`v1.0.1`): arreglos pequeños / retoques.
- MENOR  (`v1.1.0`): funciones o secciones nuevas.
- MAYOR  (`v2.0.0`): rediseño grande o cambios profundos.
Comando: `git tag -a vX.Y.Z -m "descripción" && git push origin vX.Y.Z`.
Versión inicial de producción: `v1.0.0`.

## Seguridad
- NUNCA commitear secretos. `.env*` y `.dev.vars` están (y deben seguir) en `.gitignore`.
- No romper `wrangler.jsonc` ni `open-next.config.ts` (config de Cloudflare).
- Verifica el build con `npx opennextjs-cloudflare build` antes de dar por bueno
  un cambio que afecte al deploy.

## Confirmación
Sí, puedes trabajar y hacer push a `pruebas` automáticamente. Pero la
fusión a `main` (publicar en producción) SIEMPRE requiere el OK explícito
del usuario tras revisar en Vercel.
<!-- END:deployment-workflow -->
