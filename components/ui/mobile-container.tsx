import type { ReactNode } from "react";

type MobileContainerProps = {
  children: ReactNode;
};

export function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="mx-auto w-full max-w-[30.25rem] py-4 min-[430px]:max-w-[31.75rem] sm:max-w-[32rem] sm:py-7">
      <div className="overflow-hidden rounded-[2rem] border border-[#c9d7dd] bg-app-surface shadow-[var(--app-shadow-strong)]">
        {children}
      </div>
    </div>
  );
}
