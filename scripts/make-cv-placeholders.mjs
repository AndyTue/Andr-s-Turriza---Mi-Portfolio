// Writes minimal one-page placeholder PDFs so "Download CV" never 404s.
// TODO(andres): replace public/cv/*.pdf with the real CVs (same file names).
import { mkdir, writeFile } from "node:fs/promises";

function pdf(lines) {
  const esc = (s) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  const text = lines.map((l, i) => `BT /F1 ${i === 0 ? 20 : 12} Tf 72 ${720 - i * 28} Td (${esc(l)}) Tj ET`).join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${Buffer.byteLength(text, "latin1")} >>\nstream\n${text}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  ];
  let out = "%PDF-1.4\n";
  const offsets = [];
  objects.forEach((body, i) => {
    offsets.push(Buffer.byteLength(out, "latin1"));
    out += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xref = Buffer.byteLength(out, "latin1");
  out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  out += offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("");
  out += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(out, "latin1");
}

await mkdir("public/cv", { recursive: true });
await writeFile(
  "public/cv/Andres-Turriza-CV-EN.pdf",
  pdf(["Andrés Turriza - CV (placeholder)", "The full CV in English will be published here soon.", "Contact: andres.turrizae@hotmail.com"]),
);
await writeFile(
  "public/cv/Andres-Turriza-CV-ES.pdf",
  pdf(["Andrés Turriza - CV (provisional)", "Muy pronto estará aquí el CV completo en español.", "Contacto: andres.turrizae@hotmail.com"]),
);
console.log("placeholder CVs written");
