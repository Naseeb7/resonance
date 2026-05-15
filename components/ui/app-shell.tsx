import type { ReactNode } from "react";
import { MobileContainer } from "@/components/ui/mobile-container";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-app-base">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-[#cde3e1] opacity-70 blur-3xl" />
        <div className="absolute bottom-[-9rem] right-[-5rem] h-80 w-80 rounded-full bg-[#cedceb] opacity-65 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(242,248,248,0.7)_0%,rgba(219,229,234,0.78)_100%)]" />
      </div>
      <main className="relative min-h-dvh safe-px safe-pt safe-pb">
        <MobileContainer>{children}</MobileContainer>
      </main>
    </div>
  );
}
