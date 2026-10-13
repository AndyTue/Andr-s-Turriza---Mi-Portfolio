// Writes one SVG per technology logo to public/tech/<slug>.svg (from simple-icons),
// so the marquee can paint them with CSS masks instead of inlining ~90KB of paths.
// Run after changing marqueeRows in src/content/content.ts.
import { mkdir, writeFile } from "node:fs/promises";
import * as icons from "simple-icons";

const slugs = [
  "python", "typescript", "javascript", "openjdk", "c", "cplusplus", "dart", "html5", "css", "postgresql",
  "nodedotjs", "express", "fastapi", "jsonwebtokens", "gradio", "react", "vite", "tailwindcss", "threedotjs",
  "pytorch", "opencv", "langchain", "ollama", "linux", "git", "github", "mui", "axios", "numpy", "meta",
];

const bySlug = Object.fromEntries(Object.values(icons).filter((i) => i && i.slug).map((i) => [i.slug, i]));
await mkdir("public/tech", { recursive: true });
const colors = {};
for (const slug of slugs) {
  const icon = bySlug[slug];
  if (!icon) throw new Error(`simple-icons has no "${slug}"`);
  await writeFile(`public/tech/${slug}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${icon.path}"/></svg>`);
  colors[slug] = `#${icon.hex}`;
}
await writeFile("src/content/tech-colors.json", JSON.stringify(colors, null, 2) + "\n");
console.log(`wrote ${slugs.length} icons`);
