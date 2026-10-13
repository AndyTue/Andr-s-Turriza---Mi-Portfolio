# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS 4 + `motion`, `next-intl` for `/en` and `/es`. Deploy target: Vercel or Netlify. Chosen by the owner in the brief.

## Users

Recruiters and hiring managers evaluating Andrés for full-time software roles (including roles that require relocation), and small clients (DJs, local businesses, teams) looking for a freelance engineer to build a website or an AI/full-stack project. They arrive from a CV, LinkedIn or GitHub and scan for proof in a couple of minutes.

## Product Purpose

A one-page bilingual portfolio for Andrés de Jesús Turriza Euan, Software Engineer (Applied AI & Full-Stack). Success: a visitor understands what he builds, trusts the evidence, downloads the CV or starts a contact message.

## Positioning

An engineer who delivers end to end, from the first question to the shipped product, with real work in applied AI (eKYC fraud detection on MOSIP, agentic RAG) and real freelance production sites, plus international experience in India, Colombia, Canada and the USA.

## Brand Commitments

- Visual model is pinned by the owner: replicate the structure, layout and micro-interactions of https://zolt-portfolio.framer.website/ as closely as possible; all content is Andrés's own. No assets from framerusercontent.com.
- Accent navy `#000080`, dark theme by default plus a light theme. Typefaces: Satoshi, Fragment Mono, Delicious Handrawn.
- English is canonical; Spanish is Mexican Spanish, first person, technical terms untranslated.
- Section eyebrows (`// About me` …) and timeline indices (01–04) are explicitly requested by the owner.

## Evidence on Hand

- Portrait: `Hero.JPEG` (derived crops in `public/images`).
- Content: CV-derived copy in `messages/en.json` / `messages/es.json`; repos listed in `src/content/content.ts`.
- Absent (must not be fabricated): testimonials, prices or rates, carousel and country photos, CV PDFs, production URLs of client sites. These stay as labelled placeholders/TODOs.

## Product Principles

1. Proof over adjectives: every claim maps to a CV fact, a repo or an award.
2. Bilingual parity: no layout may break in the longer Spanish copy.
3. Motion serves the reference's personality but always respects reduced motion and degrades without JS.

## Accessibility & Inclusion

WCAG 2.2 AA contrast in both themes (navy is a fill, never thin text on dark), visible focus, accessible carousel/accordion, alt text in both languages, Lighthouse ≥ 90 for performance and accessibility.
