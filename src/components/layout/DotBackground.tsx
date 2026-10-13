/** Fixed dotted field, faded out toward the centre of the viewport. */
export function DotBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 opacity-30">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, var(--dot) 1px, transparent 1px)",
          backgroundSize: "25px 25px",
          maskImage: "radial-gradient(ellipse at center, transparent 0%, transparent 20%, black 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, transparent 0%, transparent 20%, black 80%)",
        }}
      />
    </div>
  );
}
