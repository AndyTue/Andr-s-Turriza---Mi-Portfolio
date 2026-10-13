import clsx from "clsx";

/** Green "available" dot. `pulse` adds the expanding ring used in the hero badge. */
export function StatusDot({ size = 6, pulse = false, className }: { size?: number; pulse?: boolean; className?: string }) {
  return (
    <span aria-hidden className={clsx("relative inline-grid shrink-0 place-items-center", className)} style={{ width: size, height: size }}>
      {pulse && (
        <span
          className="absolute rounded-full bg-green"
          style={{ width: 9, height: 9, animation: "pulse-ring 1.6s cubic-bezier(0.16, 1, 0.3, 1) infinite" }}
        />
      )}
      <span
        className="relative rounded-full bg-green"
        style={{ width: size, height: size, boxShadow: pulse ? "0 0 20px var(--green-glow)" : undefined }}
      />
    </span>
  );
}
