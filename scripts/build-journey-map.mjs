// Builds the dotted world map + route for the "My journey" widget.
// Output: public/images/journey-dots.svg (land dots) and
// src/content/journey-map.json (pins + route). Re-run after editing STOPS.
import { readFile, writeFile } from "node:fs/promises";
import { feature } from "topojson-client";
import { geoContains } from "d3-geo";

// Equirectangular crop, 1 SVG unit = 1 degree.
const LON_MIN = -125;
const LON_MAX = 95;
const LAT_MAX = 72;
const LAT_MIN = -10;
const STEP = 2.4;

// Chronological order.
const STOPS = [
  { id: "tizimin", lat: 21.1425, lon: -88.1647 },
  { id: "albuquerque", lat: 35.0844, lon: -106.6504 },
  { id: "bucaramanga", lat: 7.1193, lon: -73.1227 },
  { id: "montreal", lat: 45.5019, lon: -73.5674 },
  { id: "bengaluru", lat: 12.9716, lon: 77.5946 },
];

const project = (lon, lat) => [+(lon - LON_MIN).toFixed(2), +(LAT_MAX - lat).toFixed(2)];

const topo = JSON.parse(await readFile("node_modules/world-atlas/land-110m.json", "utf8"));
const land = feature(topo, topo.objects.land);

// Land dots as zero-length segments: one <path> with round caps draws them all.
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

const pins = Object.fromEntries(STOPS.map((s) => [s.id, project(s.lon, s.lat)]));

// One arc per leg, so each can draw in its own time slot.
const legs = [];
for (let i = 1; i < STOPS.length; i++) {
  const [x0, y0] = pins[STOPS[i - 1].id];
  const [x1, y1] = pins[STOPS[i].id];
  const dist = Math.hypot(x1 - x0, y1 - y0);
  if (dist < 4) {
    legs.push(`M${x0} ${y0}L${x1} ${y1}`);
    continue;
  }
  // Bulge perpendicular to the leg, on whichever side points up (or right for vertical legs).
  let nx = -(y1 - y0) / dist;
  let ny = (x1 - x0) / dist;
  if (ny > 0 || (ny === 0 && nx < 0)) [nx, ny] = [-nx, -ny];
  const bulge = dist * 0.28;
  const cx = (x0 + x1) / 2 + nx * bulge;
  const cy = Math.max(2, (y0 + y1) / 2 + ny * bulge);
  legs.push(`M${x0} ${y0}Q${cx.toFixed(2)} ${cy.toFixed(2)} ${x1} ${y1}`);
}

const width = LON_MAX - LON_MIN;
const height = LAT_MAX - LAT_MIN;
// Dots live in a static, cacheable file (painted through a CSS mask), not in the HTML.
await writeFile(
  "public/images/journey-dots.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><path d="${dots}" stroke="#000" stroke-width="1.15" stroke-linecap="round"/></svg>`,
);
await writeFile("src/content/journey-map.json", JSON.stringify({ width, height, pins, order: STOPS.map((s) => s.id), legs }, null, 2) + "\n");
console.log(`map: ${count} dots, ${dots.length} chars`);
