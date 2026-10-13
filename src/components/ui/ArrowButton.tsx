import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";

/**
 * 44px ring holding a 39px accent disc. On hover of the parent card
 * (`group/card`) the arrow exits top-right while a twin enters from
 * bottom-left (.3s ease-out).
 */
export function ArrowButton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={clsx("grid size-11 shrink-0 place-items-center rounded-full bg-surface shadow-[0_0_0_1px_var(--line),0_2px_6px_rgb(0_0_0/0.12)]", className)}
    >
      <span className="relative grid size-[39px] place-items-center overflow-hidden rounded-full bg-accent text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18)] dark:shadow-[inset_0_0_0_1px_rgb(107_107_245/0.45),inset_0_1px_0_rgb(255_255_255/0.18)]">
        <ArrowUpRight
          size={18}
          strokeWidth={2.2}
          className="absolute transition-transform duration-300 ease-out group-hover/card:translate-x-[22px] group-hover/card:-translate-y-[22px]"
        />
        <ArrowUpRight
          size={18}
          strokeWidth={2.2}
          className="absolute -translate-x-[22px] translate-y-[22px] transition-transform duration-300 ease-out group-hover/card:translate-x-0 group-hover/card:translate-y-0"
        />
      </span>
    </span>
  );
}
