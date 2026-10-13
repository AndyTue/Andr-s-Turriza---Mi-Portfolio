import "server-only";
import colors from "@/content/tech-colors.json";

/** Brand colour too dark to read on the dark tile? Then hover uses the foreground colour instead. */
function isDark(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.06;
}

/** Static logo file (public/tech, built by scripts/build-tech-icons.mjs) plus its hover colour. */
export function techIcon(slug: string | null) {
  if (!slug) return null;
  const hex = (colors as Record<string, string>)[slug];
  if (!hex) return null;
  return { url: `/tech/${slug}.svg`, color: isDark(hex) ? "var(--fg)" : hex };
}
