// Derives web-sized portraits from the original photo in the project root.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "Hero.JPEG";
const OUT = "public/images";
await mkdir(OUT, { recursive: true });

const base = sharp(SRC).rotate();
const meta = await base.metadata();
console.log("source", meta.width, meta.height);

// Full portrait (2:3), used by carousel / contact card.
await sharp(SRC).rotate().resize({ width: 1200 }).jpeg({ quality: 82, mozjpeg: true }).toFile(`${OUT}/andres-portrait.jpg`);

// Head-and-shoulders crop for lanyard card, avatars and profile card.
const W = meta.width, H = meta.height;
const crop = { left: Math.round(W * 0.27), top: Math.round(H * 0.17), width: Math.round(W * 0.46), height: Math.round(W * 0.46 * 1.3) };
await sharp(SRC).rotate().extract(crop).resize({ width: 640 }).jpeg({ quality: 84, mozjpeg: true }).toFile(`${OUT}/andres-headshot.jpg`);

// Square avatar.
const sq = { left: Math.round(W * 0.3), top: Math.round(H * 0.175), width: Math.round(W * 0.4), height: Math.round(W * 0.4) };
await sharp(SRC).rotate().extract(sq).resize({ width: 256 }).jpeg({ quality: 85, mozjpeg: true }).toFile(`${OUT}/andres-avatar.jpg`);
console.log("done");
