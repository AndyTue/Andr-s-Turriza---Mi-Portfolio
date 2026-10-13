// Dotted Yucatán Peninsula for the "Proudly from Tizimín" widget.
// Output: public/images/yucatan-dots.svg + src/content/hometown-map.json (pin).
import { readFile, writeFile } from "node:fs/promises";
import { feature } from "topojson-client";
import { geoContains } from "d3-geo";

const LON_MIN = -92.6;
const LON_MAX = -86.6;
const LAT_MAX = 22.0;
const LAT_MIN = 17.7;
const STEP = 0.13;
const SCALE = 40; // SVG units per degree
const TIZIMIN = { lat: 21.1425, lon: -88.1647 };

const project = (lon, lat) => [+((lon - LON_MIN) * SCALE).toFixed(1), +((LAT_MAX - lat) * SCALE).toFixed(1)];
const topo = JSON.parse(await readFile("node_modules/world-atlas/land-50m.json", "utf8"));
const land = feature(topo, topo.objects.land);

let dots = "";
let count = 0;
for (let lat = LAT_MAX - STEP / 2; lat > LAT_MIN; lat -= STEP) {
  for (let lon = LON_MIN + STEP / 2; lon < LON_MAX; lon += STEP) {
    if (geoContains(land, [lon, lat])) {
      const [x, y] = project(lon, lat);
      dots += `M${x} ${y}h0`;
      count++;
    }
  }
}

const width = +((LON_MAX - LON_MIN) * SCALE).toFixed(1);
const height = +((LAT_MAX - LAT_MIN) * SCALE).toFixed(1);
await writeFile(
  "public/images/yucatan-dots.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><path d="${dots}" stroke="#000" stroke-width="3.1" stroke-linecap="round"/></svg>`,
);
await writeFile("src/content/hometown-map.json", JSON.stringify({ width, height, pin: project(TIZIMIN.lon, TIZIMIN.lat) }, null, 2) + "\n");
console.log(`yucatan: ${count} dots`);
