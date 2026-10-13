import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";

/**
 * Pill with a 28px circle: an accent dot that grows into a filled circle
 * with a white arrow on hover (transform .1s, background-color .2s).
 */
export function ConnectButton({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={clsx(
        "group/cta inline-flex h-11 items-center gap-2.5 rounded-full bg-surface py-2 pr-4 pl-2 text-[14px] font-medium text-body",
        "shadow-[0_0.5px_4px_rgb(0_0_0/0.15)] transition-[transform,background-color,color] duration-200 hover:text-fg active:scale-[0.98] md:text-[16px]",
        className,
      )}
    >
      <span className="relative grid size-7 place-items-center">
        <span className="absolute size-3 rounded-full bg-accent transition-transform duration-100 ease-out group-hover/cta:scale-[2.34] dark:bg-accent-ink" />
        <ArrowUpRight
          size={16}
          strokeWidth={2.2}
          aria-hidden
          className="relative scale-50 text-white opacity-0 transition-[opacity,transform] duration-200 group-hover/cta:scale-100 group-hover/cta:opacity-100"
        />
      </span>
      {children}
    </a>
  );
}
