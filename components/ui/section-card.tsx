import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <section className="rounded-3xl border border-app-border bg-[linear-gradient(180deg,#fdfefe_0%,#f7fbfc_100%)] p-4 shadow-[var(--app-shadow)] sm:p-5">
      <header className="space-y-1.5">
        <h2 className="text-base font-semibold tracking-[-0.01em] text-app-heading">{title}</h2>
        {description ? <p className="text-sm leading-6 text-[#5a6f86]">{description}</p> : null}
      </header>
      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}
