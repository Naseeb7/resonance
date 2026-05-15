import type { ReactNode } from "react";

type MobileContainerProps = {
  children: ReactNode;
};

export function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="mx-auto w-full max-w-[28rem] px-3 py-4 sm:px-5 sm:py-7">
      <div className="overflow-hidden rounded-[2rem] border border-[#c9d7dd] bg-app-surface shadow-[var(--app-shadow-strong)]">
        {children}
      </div>
    </div>
  );
}
