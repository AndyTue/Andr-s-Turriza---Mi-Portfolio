import clsx from "clsx";
import type { Tech } from "@/content/content";
import { techIcon } from "@/lib/tech-icons";

function monogram(name: string) {
  const words = name.replace(/[^A-Za-z ]/g, "").split(" ").filter(Boolean);
  return words.length > 1 ? (words[0][0] + words[1][0]).toUpperCase() : name.slice(0, 2);
}

function Tile({ tech }: { tech: Tech }) {
  const icon = techIcon(tech.icon);
  return (
    <li
      title={tech.name}
      className="group/tile mr-[27px] grid size-14 shrink-0 place-items-center rounded-2xl bg-tile md:size-16"
      style={{ "--brand": icon?.color ?? "var(--fg)" } as React.CSSProperties}
    >
      {icon ? (
        <span
          className="tech-logo size-7 bg-[var(--muted)] opacity-70 transition-[background-color,opacity] duration-300 group-hover/tile:bg-[var(--brand)] group-hover/tile:opacity-100 md:size-[34px]"
          style={{ "--logo": `url(${icon.url})` } as React.CSSProperties}
        />
      ) : (
        <span className="text-[15px] font-bold tracking-tight text-muted opacity-80 transition-[color,opacity] duration-300 group-hover/tile:text-fg group-hover/tile:opacity-100 md:text-[17px]">
          {monogram(tech.name)}
        </span>
      )}
    </li>
  );
}

/**
 * Infinite logo row: the list is rendered twice and translated by -50%.
 * Pure CSS; pauses on hover; reduced motion freezes it (global rule).
 */
export function Marquee({ items, direction, seconds }: { items: Tech[]; direction: "left" | "right"; seconds: number }) {
  return (
    <div
      aria-hidden
      className="group/marquee overflow-hidden py-1"
      style={{
        maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <ul
        className={clsx("flex w-max group-hover/marquee:[animation-play-state:paused]")}
        style={{ animation: `marquee-${direction} ${seconds}s linear infinite` }}
      >
        {[...items, ...items].map((tech, i) => (
          <Tile key={`${tech.name}-${i}`} tech={tech} />
        ))}
      </ul>
    </div>
  );
}
