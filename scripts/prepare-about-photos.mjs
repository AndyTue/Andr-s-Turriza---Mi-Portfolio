// Optimizes the About carousel photos from `public/images/about me/` (originals,
// untouched) into `public/images/about/NN-slug.jpg`, in carousel order.
// Order and alt texts must stay in sync with `aboutPhotos` (content.ts) and
// `about.carousel.alts` (messages).
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const SRC = "public/images/about me";
const OUT = "public/images/about";
const at = (time, n = "") => `${SRC}/WhatsApp Image 2026-10-${time}${n ? ` (${n})` : ""}.jpeg`;

const PHOTOS = [
  ["uady-council", at("12 at 3.59.12 PM")],
  ["yucatan-colonial", at("12 at 3.58.02 PM")],
  ["unm-certificate", at("12 at 3.58.02 PM", 1)],
  ["colombia-flag", at("11 at 8.26.00 PM")],
  ["colombia-group", at("11 at 8.26.02 PM")],
  ["llama", at("11 at 8.26.04 PM", 1)],
  ["mexico-flag-group", at("11 at 8.26.04 PM")],
  ["google-office", at("12 at 3.58.01 PM")],
  ["neoclassical-campus", at("11 at 8.26.06 PM", 1)],
  ["city-terrace", at("11 at 8.26.04 PM", 2)],
  ["canada-legislature", at("11 at 8.26.05 PM", 2)],
  ["niagara-window", at("11 at 8.26.05 PM", 1)],
  ["niagara-falls", at("11 at 8.26.05 PM")],
  ["ballpark-leones", at("11 at 8.26.06 PM")],
  ["infosys-dome", at("11 at 8.26.08 PM")],
  ["infosys-badge", at("11 at 8.26.09 PM")],
  ["uady-banner-pyramid", at("11 at 8.26.10 PM")],
  ["campus-bench", at("11 at 8.26.11 PM")],
  ["palace-group", at("11 at 8.26.07 PM", 1)],
  ["palace", at("11 at 8.26.07 PM")],
  ["golden-temple", at("11 at 8.26.10 PM", 1)],
  ["white-temple", at("11 at 8.26.11 PM", 1)],
  ["taj-mahal", at("11 at 8.26.12 PM", 1)],
  ["taj-mahal-bench", at("11 at 8.26.13 PM")],
  ["taj-mahal-view", at("11 at 8.26.12 PM")],
];

await mkdir(OUT, { recursive: true });
let i = 1;
for (const [slug, file] of PHOTOS) {
  const name = `${String(i).padStart(2, "0")}-${slug}.jpg`;
  await sharp(file).rotate().resize({ width: 1080, height: 1080, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toFile(`${OUT}/${name}`);
  console.log(name);
  i++;
}
