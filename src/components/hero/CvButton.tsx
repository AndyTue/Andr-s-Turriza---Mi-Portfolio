"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Download, X } from "lucide-react";

type Labels = { button: string; title: string; download: string; close: string; loading: string; error: string };

/**
 * One CV button: opens the PDF in an in-page viewer first (pages drawn with pdf.js, so it
 * previews the same way in every browser), with a Download link inside.
 */
export function CvButton({ href, downloadName, labels, className }: { href: string; downloadName: string; labels: Labels; className?: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const pagesRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    const trigger = triggerRef.current;
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setStatus("loading");
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
        const pdf = await pdfjs.getDocument(href).promise;
        const host = pagesRef.current;
        if (cancelled || !host) return;
        host.replaceChildren();
        const width = host.clientWidth;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        for (let n = 1; n <= pdf.numPages; n++) {
          const page = await pdf.getPage(n);
          if (cancelled) return;
          const base = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({ scale: (width / base.width) * dpr });
          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          canvas.style.width = "100%";
          canvas.style.display = "block";
          canvas.className = "mb-3 rounded-md bg-white shadow-card last:mb-0";
          host.appendChild(canvas);
          await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
          if (n === 1) setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, href]);

  return (
    <>
      <button ref={triggerRef} type="button" onClick={() => setOpen(true)} className={className} aria-haspopup="dialog">
        <Download size={16} strokeWidth={2} aria-hidden className="text-muted" />
        {labels.button}
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[80] grid place-items-center p-3 md:p-8" role="dialog" aria-modal="true" aria-label={labels.title}>
            <button type="button" aria-label={labels.close} tabIndex={-1} onClick={() => setOpen(false)} className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm" />
            <div className="relative flex max-h-full w-full max-w-[860px] flex-col overflow-hidden rounded-3xl bg-surface shadow-card ring-1 ring-line">
              <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 md:px-5">
                <p className="text-[14px] font-medium text-fg">{labels.title}</p>
                <div className="flex items-center gap-2">
                  <a
                    href={href}
                    download={downloadName}
                    className="inline-flex h-9 items-center gap-2 rounded-full bg-accent px-4 text-[14px] font-medium text-white transition-transform duration-200 active:scale-[0.98]"
                  >
                    <Download size={15} strokeWidth={2} aria-hidden />
                    {labels.download}
                  </a>
                  <button
                    ref={closeRef}
                    type="button"
                    aria-label={labels.close}
                    onClick={() => setOpen(false)}
                    className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-widget hover:text-fg"
                  >
                    <X size={18} aria-hidden />
                  </button>
                </div>
              </div>
              <div className="relative min-h-[200px] overflow-y-auto bg-widget p-3 md:p-4">
                {status === "loading" && <p className="py-16 text-center text-muted">{labels.loading}</p>}
                {status === "error" && (
                  <p className="py-16 text-center text-muted">
                    {labels.error}{" "}
                    <a href={href} target="_blank" rel="noreferrer noopener" className="text-accent-ink underline underline-offset-4">
                      PDF
                    </a>
                  </p>
                )}
                <div ref={pagesRef} />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
