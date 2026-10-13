import Image from "next/image";
import clsx from "clsx";
import { Bot, Check, Database, FileScan, Globe, KeyRound, LayoutTemplate, Search, ShieldCheck } from "lucide-react";
import type { Project } from "@/content/content";

/** Soft, warm studio backdrop shared by every mockup so the six cards read as one set. */
function Backdrop({ tint, children, className }: { tint: string; children: React.ReactNode; className?: string }) {
  return (
    <div
      className={clsx("relative h-full w-full overflow-hidden", className)}
      style={{
        background: `radial-gradient(120% 90% at 85% 10%, color-mix(in oklab, ${tint} 22%, #fbf3ea), transparent 65%), radial-gradient(90% 80% at 10% 100%, color-mix(in oklab, ${tint} 14%, #f6ece2), transparent 70%), #f7efe6`,
      }}
    >
      {children}
    </div>
  );
}

/** CSS laptop holding a real screenshot of the site. */
export function LaptopShot({ src, alt, tint, sizes }: { src: string; alt: string; tint: string; sizes: string }) {
  return (
    <Backdrop tint={tint}>
      <div className="absolute inset-x-[9%] top-1/2 -translate-y-[46%]">
        <div className="rounded-[10px] bg-[#111] p-[1.6%] pb-[2.2%] shadow-[0_24px_40px_-18px_rgb(60_30_10/0.45)]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[4px] bg-[#222]">
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              className="object-cover object-top transition-transform duration-500 ease-out group-hover/card:scale-[1.04]"
            />
          </div>
        </div>
        <div className="relative mx-[-6%] h-[10px] rounded-b-[12px] bg-[linear-gradient(#cfcfd4,#9c9ca3)] shadow-[0_10px_18px_-8px_rgb(60_30_10/0.5)]">
          <span className="absolute top-0 left-1/2 h-[4px] w-[16%] -translate-x-1/2 rounded-b-[6px] bg-[#8d8d94]" />
        </div>
      </div>
    </Backdrop>
  );
}

function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={clsx("absolute top-3 left-3 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-medium tracking-wide text-[#3d3d3d]", className)}>
      {children}
    </span>
  );
}

const card = "rounded-xl bg-white shadow-[0_10px_30px_-12px_rgb(40_20_10/0.35)] ring-1 ring-black/5";

/** eKYC: identity document under a scan pass, with the pipeline checks beside it. */
function EkycScene() {
  const checks = ["Metadata", "Pixels", "OCR · MRZ", "Homography"];
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-[5%] px-[7%]">
      <div className={clsx(card, "relative w-[56%] max-w-[230px] overflow-hidden p-[4%]")}>
        <div className="flex gap-[6%]">
          <div className="aspect-[3/4] w-[30%] rounded-md bg-[linear-gradient(160deg,#d9dcf2,#9aa0d6)]" />
          <div className="flex flex-1 flex-col gap-[7px] pt-1">
            {[90, 70, 80, 55].map((w, i) => (
              <span key={i} className="h-[5px] rounded-full bg-[#e3e3ea]" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
        <div className="mt-[7%] font-mono text-[7px] leading-[1.5] tracking-[0.12em] text-[#3d3d4a] sm:text-[8px]">
          <p>P&lt;MEX&lt;&lt;SAMPLE&lt;&lt;DOCUMENT&lt;&lt;&lt;&lt;</p>
          <p>X0000000&lt;0MEX0000000M0000000&lt;</p>
        </div>
        <span className="absolute inset-x-0 top-[38%] h-[2px] bg-[#000080]/70 shadow-[0_0_14px_4px_rgb(0_0_128/0.25)]" />
        <span className="absolute top-[12%] left-[6%] h-[46%] w-[34%] rounded-md border-2 border-dashed border-[#000080]/60" />
      </div>
      <ul className="flex w-[34%] max-w-[140px] flex-col gap-[6px]">
        {checks.map((c) => (
          <li key={c} className={clsx(card, "flex items-center gap-1.5 px-2 py-1.5 text-[9px] font-medium text-[#1a1a1a] sm:text-[10px]")}>
            <span className="grid size-3.5 shrink-0 place-items-center rounded-full bg-[#000080] text-white">
              <Check size={9} strokeWidth={3} />
            </span>
            {c}
          </li>
        ))}
      </ul>
      <FileScan className="absolute right-[6%] bottom-[8%] text-[#000080]/25" size={44} strokeWidth={1.2} aria-hidden />
    </div>
  );
}

/** Agentic RAG loop: crawl → embed → retrieve → answer. */
function AgentScene() {
  const steps = [
    { icon: Globe, label: "Crawl" },
    { icon: Database, label: "FAISS" },
    { icon: Search, label: "Rank" },
    { icon: Bot, label: "LLaMA 3.3" },
  ];
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[7%] px-[8%]">
      <div className={clsx(card, "flex w-full max-w-[300px] items-center gap-2 px-3 py-2 text-[10px] text-[#555555]")}>
        <Globe size={12} className="text-[#000080]" aria-hidden />
        <span className="truncate">https://any-site.example/docs</span>
      </div>
      <ol className="flex w-full max-w-[320px] items-center justify-between">
        {steps.map(({ icon: Icon, label }, i) => (
          <li key={label} className="flex items-center">
            <span className="flex flex-col items-center gap-1">
              <span className={clsx(card, "grid size-10 place-items-center text-[#000080]")}>
                <Icon size={18} strokeWidth={1.8} aria-hidden />
              </span>
              <span className="text-[9px] font-medium text-[#3d3d3d]">{label}</span>
            </span>
            {i < steps.length - 1 && <span className="mx-1.5 mb-4 h-px w-4 bg-[#000080]/40 sm:w-6" />}
          </li>
        ))}
      </ol>
      <div className={clsx(card, "w-full max-w-[300px] rounded-2xl rounded-bl-sm px-3 py-2.5")}>
        {[95, 82, 60].map((w, i) => (
          <span key={i} className="mb-1.5 block h-[5px] rounded-full bg-[#e3e3ea] last:mb-0" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

/** Pets-Ride: React client → JWT/RBAC REST API → PostgreSQL. */
function PetsScene() {
  const nodes = [
    { icon: LayoutTemplate, title: "React · Vite", sub: "MUI · Axios" },
    { icon: KeyRound, title: "REST API", sub: "JWT · RBAC" },
    { icon: Database, title: "PostgreSQL", sub: "Normalized" },
  ];
  return (
    <div className="absolute inset-0 flex items-center justify-center px-[7%]">
      <ol className="flex w-full max-w-[360px] items-center justify-between">
        {nodes.map(({ icon: Icon, title, sub }, i) => (
          <li key={title} className="flex items-center">
            <span className={clsx(card, "flex w-[86px] flex-col items-center gap-1 px-2 py-3 text-center sm:w-[96px]")}>
              <Icon size={20} strokeWidth={1.7} className="text-[#000080]" aria-hidden />
              <span className="text-[10px] font-bold text-[#1a1a1a]">{title}</span>
              <span className="text-[9px] text-[#555555]">{sub}</span>
            </span>
            {i < nodes.length - 1 && (
              <span className="relative mx-1 h-px w-3 bg-[#000080]/40 sm:w-5">
                <span className="absolute -top-[3px] right-0 size-[7px] rotate-45 border-t border-r border-[#000080]/50" />
              </span>
            )}
          </li>
        ))}
      </ol>
      <ShieldCheck className="absolute right-[6%] bottom-[8%] text-[#000080]/25" size={40} strokeWidth={1.2} aria-hidden />
    </div>
  );
}

const scenes = { ekyc: EkycScene, agent: AgentScene, petsride: PetsScene } as const;

/** Picks the screenshot (when one exists) or the schematic scene for a project. */
export function ProjectVisual({
  project,
  alt,
  illustrationLabel,
  sizes,
}: {
  project: Project;
  alt: string;
  illustrationLabel: string;
  sizes: string;
}) {
  if (project.image) return <LaptopShot src={project.image} alt={alt} tint={project.tint} sizes={sizes} />;
  const Scene = scenes[project.id as keyof typeof scenes];
  return (
    <Backdrop tint={project.tint}>
      <div role="img" aria-label={`${alt} (${illustrationLabel})`} className="absolute inset-0 transition-transform duration-500 ease-out group-hover/card:scale-[1.04]">
        {Scene ? <Scene /> : null}
      </div>
      <Tag>{illustrationLabel}</Tag>
    </Backdrop>
  );
}
