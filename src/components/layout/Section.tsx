import clsx from "clsx";

/** Measured section heights (px) at 390px and 1440px, used as content-visibility placeholders. */
const ESTIMATES: Record<string, [mobile: number, desktop: number]> = {
  about: [1575, 907],
  work: [3480, 2340],
  experience: [4500, 3540],
  services: [860, 728],
  recognition: [1100, 715],
  how: [1550, 1040],
};

export function Section({
  id,
  children,
  className,
  labelledBy,
  rule = true,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  labelledBy?: string;
  /** Hairline under the section; the last one leaves it to the footer. */
  rule?: boolean;
}) {
  const estimate = ESTIMATES[id];
  return (
    <section
      id={id}
      aria-labelledby={labelledBy ?? `${id}-title`}
      className={clsx(
        "gutter relative pt-12 pb-14 md:pt-24 md:pb-20 lg:pt-[134px] lg:pb-[120px]",
        estimate && "cv-section",
        rule && "border-b border-line",
        className,
      )}
      style={estimate ? ({ "--cis-m": `${estimate[0]}px`, "--cis-d": `${estimate[1]}px` } as React.CSSProperties) : undefined}
    >
      {children}
    </section>
  );
}

export function SectionHeading({ id, eyebrow, title, className }: { id: string; eyebrow: string; title: string; className?: string }) {
  return (
    <header data-reveal className={clsx("mb-10 md:mb-14 lg:mb-[60px]", className)}>
      <p className="text-eyebrow">{eyebrow}</p>
      <h2 id={`${id}-title`} className="text-section mt-0.5">
        {title}
      </h2>
    </header>
  );
}
