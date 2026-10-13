// Prepares the Experience timeline logos from the originals Andrés supplied.
// Usage: node scripts/prepare-logos.mjs <folder with the originals>
// Expects: 4.webp (FMAT student council), 5.png (Infosys InStep), 6.png (UADY).
import sharp from "sharp";
const dir = process.argv[2];
const out = "public/images/logos";
const white = { r: 255, g: 255, b: 255, alpha: 1 };

// FMAT council seal: already round, just downsize.
await sharp(`${dir}/4.webp`).resize(256, 256).png({ compressionLevel: 9 }).toFile(`${out}/fmat.png`);

// Infosys | InStep lockup: trim the white margins.
await sharp(`${dir}/5.png`).trim({ background: white, threshold: 30 }).png({ compressionLevel: 9 }).toFile(`${out}/infosys-instep.png`);

// UADY: full lockup (crest + wordmark), trimmed with a little breathing room.
await sharp(`${dir}/6.png`).trim({ background: white, threshold: 30 }).extend({ top: 8, bottom: 8, left: 8, right: 8, background: white }).png({ compressionLevel: 9 }).toFile(`${out}/uady.png`);
console.log("logos ready");
