import type { ReactNode } from "react";

type MobileContainerProps = {
  children: ReactNode;
};

export function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="mx-auto w-full max-w-[29.75rem] px-3 py-4 min-[430px]:max-w-[31rem] min-[430px]:px-4 sm:max-w-[31.25rem] sm:px-5 sm:py-7">
      <div className="overflow-hidden rounded-[2rem] border border-[#c9d7dd] bg-app-surface shadow-[var(--app-shadow-strong)]">
        {children}
      </div>
    </div>
  );
}
