import clsx from "clsx";
import { ImageIcon } from "lucide-react";

/**
 * Clearly-labelled stand-in for an image Andrés still has to provide.
 * TODO(andres): replace each usage with a real photo.
 */
export function Placeholder({
  label,
  className,
  tint = "#000080",
  compact = false,
}: {
  label: string;
  className?: string;
  tint?: string;
  compact?: boolean;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={clsx("relative grid place-items-center overflow-hidden", className)}
      style={{
        background: `radial-gradient(120% 80% at 20% 10%, color-mix(in oklab, ${tint} 55%, transparent), transparent 60%), radial-gradient(90% 90% at 90% 100%, color-mix(in oklab, ${tint} 35%, transparent), transparent 70%), var(--widget)`,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: "repeating-linear-gradient(135deg, currentColor 0 1px, transparent 1px 12px)",
          color: "var(--muted)",
        }}
      />
      {!compact && (
        <span className="relative flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/85 backdrop-blur-sm">
          <ImageIcon size={12} aria-hidden />
          {label}
        </span>
      )}
    </div>
  );
}
