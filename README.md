# Portfolio · Andrés Turriza

Portfolio personal bilingüe (ES/EN) de una sola página.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · `motion` · `next-intl` · Playwright.

## Comandos

```bash
npm install
npm run dev          # http://localhost:3000 (escribe en .next-dev, nunca pisa un build)
npm run build        # build de producción en .next
npm run start        # sirve el build
npm run typecheck
npm run test:e2e     # 18 pruebas Playwright (escritorio + móvil, incluye axe WCAG 2.1 AA); requiere build previo
```

## Dónde se edita el contenido

| Qué | Dónde |
|---|---|
| Todo el texto (EN canónico, ES de México) | `messages/en.json`, `messages/es.json` |
| Enlaces, correo, teléfono, proyectos, stack, timeline, premios, saludos, "Now playing" | `src/content/content.ts` |
| Fotos del retrato | `public/images/` (se generan desde `Hero.JPEG` con `node scripts/prepare-images.mjs`) |
| Fotos del carrusel de About | Originales en `public/images/about me/`; orden y nombres en `scripts/prepare-about-photos.mjs` → `public/images/about/`. Mantén en sync `aboutPhotos` (content.ts) y `about.carousel.alts` (mensajes) |
| Capturas de proyectos | `public/projects/*.jpg` |
| CV descargables | `public/cv/Andres-Turriza-CV-EN.pdf`, `public/cv/Andres-Turriza-CV-ES.pdf` |
| Logos del marquee | `node scripts/build-tech-icons.mjs` → `public/tech/*.svg` + `src/content/tech-colors.json` |
| Widgets de About (canción, hobbies, equipo, serie, vitrina) | Datos en `nowPlaying`, `hobbies` y `showcase` de `content.ts`; textos en `about.widgets` de los mensajes |
| Mapa del recorrido | Paradas en `scripts/build-journey-map.mjs`, luego `node scripts/build-journey-map.mjs` → `public/images/journey-dots.svg` + `src/content/journey-map.json` |
| Mapa de Tizimín (widget "Mi tierra") | `node scripts/build-hometown-map.mjs` → `public/images/yucatan-dots.svg` + `src/content/hometown-map.json` |

## Pendientes (marcados con `TODO(andres)` en el código)

- **CV reales:** los PDF actuales en `public/cv/` son provisionales; reemplázalos con los mismos nombres.
- **URLs de producción** de Mazza, Hunter y Katas (las capturas actuales se tomaron corriendo cada repo en local).
- **Deploy:** define `NEXT_PUBLIC_SITE_URL` (p. ej. `https://tu-dominio.com`) para que canonical, `hreflang`, Open Graph y el sitemap usen el dominio real.

## Detalles de implementación

- **i18n:** `/en` y `/es`; `/` redirige según la cookie `NEXT_LOCALE` o `Accept-Language`. El selector ES | EN conserva la posición de scroll y hace un cross-fade de ~0.25 s.
- **Temas:** oscuro por defecto, claro opcional (guardado en `localStorage`), con revelado circular vía View Transitions API y fade como alternativa.
- **Accesibilidad:** contraste AA en ambos temas. Sobre fondo oscuro, los acentos finos usan `#6b6bf5`, porque `#000080` queda en ~1.2:1. También hay foco visible, carrusel y acordeón con ARIA, y soporte de `prefers-reduced-motion`.
- **Sin JavaScript:** el contenido se ve igual (el revelado on-scroll tiene un respaldo CSS) y el lanyard muestra una cinta estática.
- **Rendimiento:** las secciones bajo el hero usan `content-visibility: auto`, con alturas estimadas en `src/components/layout/Section.tsx`; si cambias mucho el contenido, ajústalas. Los logos del marquee se pintan con `mask-image` desde archivos estáticos. `motion` se carga con `LazyMotion`. El clima viene de Open-Meteo (sin clave), con caché de 30 min.

## Créditos y licencias de assets

- Tipografía **Satoshi** (Indian Type Foundry, licencia ITF FFL, vía Fontshare). **Fragment Mono**, **Delicious Handrawn** e **Inter** vía Google Fonts (OFL).
- Mano 👋: SVG de [Noto Emoji](https://github.com/googlefonts/noto-emoji) v2.047 (Apache 2.0).
- Logos de tecnologías: [Simple Icons](https://simpleicons.org) (CC0). Las marcas pertenecen a sus dueños.
- Iconos de interfaz: [Lucide](https://lucide.dev) (ISC).
- Portada de *ye* (Kanye West, 2018) y escudo del FC Barcelona: © y marcas de sus titulares, usados solo para identificar la canción y el equipo favoritos.
- Mapas de puntos: [Natural Earth](https://www.naturalearthdata.com) vía [world-atlas](https://github.com/topojson/world-atlas) (dominio público).
