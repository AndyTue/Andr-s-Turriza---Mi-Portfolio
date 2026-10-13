// Crops local screenshots of client sites (repos-snap/*.png) to 16:10 web JPEGs.
import sharp from "sharp";
const ids = process.argv.slice(2);
for (const id of ids) {
  await sharp(`repos-snap/${id}-1440.png`)
    .extract({ left: 0, top: 0, width: 1424, height: 890 })
    .resize({ width: 1280, height: 800 })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(`public/projects/${id}.jpg`);
  console.log("ok", id);
}
