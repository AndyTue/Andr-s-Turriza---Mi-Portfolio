"use client";

import { useSafeReducedMotion } from "@/lib/motion";
import { AnimatePresence, m } from "motion/react";
import { ArrowLeft, ChevronRight, Mail, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useRef, useState } from "react";
import clsx from "clsx";
import { contactOptions, profile, type ContactOption } from "@/content/content";

const TOTAL = 3;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Fields = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

function StepDots({ step }: { step: number }) {
  return (
    <span aria-hidden className="flex items-center gap-1.5">
      {Array.from({ length: TOTAL }, (_, i) => (
        <span
          key={i}
          className={clsx(
            "h-2 rounded-full transition-[width,background-color,opacity] duration-300 ease-out",
            i === step ? "w-6 bg-white" : "w-2 bg-white/45",
          )}
        />
      ))}
    </span>
  );
}

export function ContactWizard() {
  const t = useTranslations("contact");
  const reduce = useSafeReducedMotion();
  const uid = useId();
  const [[step, dir], setStep] = useState<[number, 1 | -1]>([0, 1]);
  const [need, setNeed] = useState<ContactOption | null>(null);
  const [fields, setFields] = useState<Fields>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const titles = [t("steps.need"), t("steps.details"), t("steps.review")];

  const validate = (f: Fields): Errors => {
    const e: Errors = {};
    if (f.name.trim().length < 2) e.name = t("errors.name");
    if (!EMAIL_RE.test(f.email.trim())) e.email = t("errors.email");
    if (f.message.trim().length < 10) e.message = t("errors.message");
    return e;
  };

  const goTo = (next: number) => {
    setStep(([s]) => [next, next > s ? 1 : -1]);
    // Move focus to the new step's heading for keyboard and screen-reader users.
    requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
  };

  const onNext = () => {
    if (step === 0 && need) goTo(1);
    if (step === 1) {
      setTried(true);
      const e = validate(fields);
      setErrors(e);
      if (Object.keys(e).length === 0) goTo(2);
    }
  };

  const update = (key: keyof Fields) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...fields, [key]: ev.target.value };
    setFields(next);
    if (tried) setErrors(validate(next));
  };

  const needTitle = need ? t(`options.${need}.title`) : "";
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(t("mail.subject", { need: needTitle }))}&body=${encodeURIComponent(
    t("mail.body", { message: fields.message.trim(), name: fields.name.trim(), email: fields.email.trim() }),
  )}`;

  const canAdvance = step === 0 ? Boolean(need) : step === 1;

  const restart = () => {
    setSent(false);
    setNeed(null);
    setFields({ name: "", email: "", message: "" });
    setErrors({});
    setTried(false);
    goTo(0);
  };

  const field = (key: keyof Fields, type: "text" | "email" | "textarea") => {
    const id = `${uid}-${key}`;
    const errId = `${id}-err`;
    const common = {
      id,
      name: key,
      value: fields[key],
      onChange: update(key),
      "aria-invalid": Boolean(errors[key]) || undefined,
      "aria-describedby": errors[key] ? errId : undefined,
      placeholder: t(`fields.${key}Placeholder`),
      className: clsx(
        "w-full rounded-xl border bg-bg px-3.5 py-2.5 text-[15px] text-fg transition-[border-color,box-shadow] duration-200 outline-none",
        "focus:border-accent-ink focus:shadow-[0_0_0_3px_var(--accent-soft)]",
        errors[key] ? "border-[#ef4444]" : "border-line",
      ),
    };
    return (
      <div>
        <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-body">
          {t(`fields.${key}`)}
        </label>
        {type === "textarea" ? (
          <textarea {...common} rows={4} className={clsx(common.className, "resize-none")} />
        ) : (
          <input {...common} type={type} autoComplete={key === "email" ? "email" : "name"} />
        )}
        {errors[key] && (
          <p id={errId} className="mt-1.5 text-[12px] text-[#ef4444] dark:text-[#f87171]">
            {errors[key]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#000080,#0000a0)] shadow-card">
      {/* Header */}
      <div className="flex items-start justify-between px-6 pt-6 pb-12 text-white">
        <div>
          <h3 ref={headingRef} tabIndex={-1} className="text-[22px] leading-tight font-medium outline-none md:text-[24px]">
            {titles[step]}
          </h3>
          <p className="mt-1.5 text-[12px] text-white/80">{t("stepOf", { current: step + 1, total: TOTAL })}</p>
        </div>
        <span className="pt-2">
          <StepDots step={step} />
        </span>
      </div>

      {/* Body: its rounded top "cuts" into the gradient header */}
      <div className="relative -mt-6 rounded-t-[32px] bg-surface px-5 pt-6 pb-6 md:px-6">
        <div className="relative min-h-[330px]">
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <m.div
              key={step}
              custom={dir}
              initial={reduce ? { opacity: 0 } : { x: dir * 48, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { x: dir * -48, opacity: 0 }}
              transition={{ duration: reduce ? 0.12 : 0.35, ease: [0.25, 1, 0.5, 1] }}
            >
              {step > 0 && !sent && (
                <button
                  type="button"
                  onClick={() => goTo(step - 1)}
                  className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-fg"
                >
                  <ArrowLeft size={14} aria-hidden />
                  {t("back")}
                </button>
              )}

              {step === 0 && (
                <fieldset>
                  <legend className="sr-only">{titles[0]}</legend>
                  <div className="space-y-3">
                    {contactOptions.map((opt) => {
                      const selected = need === opt;
                      return (
                        <label
                          key={opt}
                          className={clsx(
                            "flex cursor-pointer gap-3 rounded-2xl border px-5 py-4 transition-[border-color,background-color] duration-200",
                            selected ? "border-accent-ink bg-accent-soft" : "border-line hover:border-muted/50",
                          )}
                        >
                          <input
                            type="radio"
                            name={`${uid}-need`}
                            value={opt}
                            checked={selected}
                            onChange={() => setNeed(opt)}
                            className="peer sr-only"
                          />
                          <span
                            aria-hidden
                            className={clsx(
                              "mt-1.5 size-2.5 shrink-0 rounded-full transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-ink",
                              selected ? "bg-accent-ink" : "bg-muted/60",
                            )}
                          />
                          <span>
                            <span className={clsx("block text-[15px] font-semibold", selected ? "text-accent-ink" : "text-fg")}>
                              {t(`options.${opt}.title`)}
                            </span>
                            <span className="mt-1 block text-[13px] leading-[1.5] text-body">{t(`options.${opt}.description`)}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              {step === 1 && (
                <form
                  id={`${uid}-form`}
                  noValidate
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    onNext();
                  }}
                >
                  {field("name", "text")}
                  {field("email", "email")}
                  {field("message", "textarea")}
                </form>
              )}

              {step === 2 && (
                <div>
                  {!sent ? (
                    <>
                      <p className="text-[14px] text-muted">{t("review.intro")}</p>
                      <dl className="mt-5 space-y-3 rounded-2xl border border-line p-4 text-[14px]">
                        <div className="flex gap-3">
                          <dt className="w-20 shrink-0 text-muted">{t("review.need")}</dt>
                          <dd className="text-fg">{needTitle}</dd>
                        </div>
                        <div className="flex gap-3">
                          <dt className="w-20 shrink-0 text-muted">{t("review.from")}</dt>
                          <dd className="min-w-0 break-words text-fg">
                            {fields.name.trim()} · {fields.email.trim()}
                          </dd>
                        </div>
                        <div className="flex gap-3">
                          <dt className="w-20 shrink-0 text-muted">{t("review.message")}</dt>
                          <dd className="line-clamp-4 min-w-0 break-words whitespace-pre-line text-body">{fields.message.trim()}</dd>
                        </div>
                      </dl>
                      <a
                        href={mailto}
                        onClick={() => setSent(true)}
                        className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-accent px-5 text-[15px] font-medium text-white transition-[transform,background-color] duration-200 hover:bg-accent-hover active:scale-[0.98] dark:shadow-[inset_0_0_0_1px_rgb(107_107_245/0.45)]"
                      >
                        <Mail size={16} aria-hidden />
                        {t("send")}
                      </a>
                    </>
                  ) : (
                    <div role="status" className="py-6 text-center">
                      <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent-soft text-accent-ink">
                        <Mail size={20} aria-hidden />
                      </span>
                      <p className="mx-auto mt-4 max-w-[300px] text-[15px] text-body">
                        {t.rich("sent", {
                          email: profile.email,
                          link: (chunks) => (
                            <a href={`mailto:${profile.email}`} className="text-accent-ink underline underline-offset-4">
                              {chunks}
                            </a>
                          ),
                        })}
                      </p>
                      <button
                        type="button"
                        onClick={restart}
                        className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-[13px] text-body transition-colors hover:bg-widget hover:text-fg"
                      >
                        <RotateCcw size={14} aria-hidden />
                        {t("restart")}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </m.div>
          </AnimatePresence>
        </div>

        {step < 2 && (
          <div className="mt-6 flex justify-center">
            <button
              type={step === 1 ? "submit" : "button"}
              form={step === 1 ? `${uid}-form` : undefined}
              onClick={step === 1 ? undefined : onNext}
              disabled={!canAdvance}
              aria-label={t("next")}
              className="grid size-14 place-items-center rounded-full bg-accent text-white transition-[background-color,transform,opacity] duration-200 hover:bg-accent-hover active:scale-95 disabled:cursor-not-allowed disabled:bg-chip-strong disabled:text-muted dark:shadow-[inset_0_0_0_1px_rgb(107_107_245/0.45)] dark:disabled:shadow-none"
            >
              <ChevronRight size={22} strokeWidth={2.2} aria-hidden />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
