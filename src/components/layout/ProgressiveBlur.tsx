/**
 * Two fixed 72px bands at the top and bottom of the viewport. Each stacks
 * a 2px and a 3px backdrop blur under staggered linear masks, so content
 * softens progressively as it slides under the edges.
 */
const layers = [
  { blur: 2, mask: "transparent 0%, black 50%, black 100%" },
  { blur: 3, mask: "transparent 50%, black 100%" },
];

function Band({ edge }: { edge: "top" | "bottom" }) {
  const dir = edge === "top" ? "to top" : "to bottom";
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 z-[40] h-[72px] transition-opacity duration-300 ease-out"
      style={{ [edge]: 0 }}
    >
      {layers.map((l) => (
        <div
          key={l.blur}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${l.blur}px)`,
            WebkitBackdropFilter: `blur(${l.blur}px)`,
            maskImage: `linear-gradient(${dir}, ${l.mask})`,
            WebkitMaskImage: `linear-gradient(${dir}, ${l.mask})`,
          }}
        />
      ))}
    </div>
  );
}

export function ProgressiveBlur() {
  return (
    <>
      <Band edge="top" />
      <Band edge="bottom" />
    </>
  );
}
