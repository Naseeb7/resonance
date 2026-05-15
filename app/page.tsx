import { AppShell } from "@/components/ui/app-shell";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ScreenTransition } from "@/components/ui/screen-transition";
import { SectionCard } from "@/components/ui/section-card";

export default function Home() {
  return (
    <AppShell>
      <ScreenTransition>
        <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col gap-5 p-5 sm:min-h-[44rem]">
          <header className="space-y-3.5 pt-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5c728a]">Resonance</p>
            <h1 className="text-[1.8rem] font-semibold leading-9 tracking-[-0.015em] text-app-heading">
              Daily speech practice with a calmer pace.
            </h1>
            <p className="text-sm leading-6 text-[#566b82]">
              You are building steady articulation through short guided sessions.
            </p>
          </header>

          <SectionCard
            title="Today&apos;s progress"
            description="Consistency strengthens articulation. A few focused repetitions are enough."
          >
            <ProgressBar value={36} />
          </SectionCard>

          <SectionCard
            title="Suggested practice"
            description="Try a brief Listen & Repeat cycle and focus on breathing slowly between attempts."
          >
            <div className="rounded-2xl border border-[#d7e2e7] bg-[#edf4f7] p-4">
              <p className="text-sm font-medium text-app-heading">R-sound set: warm, river, grow</p>
              <p className="mt-1 text-sm text-[#5e7288]">Estimated time: 4 minutes</p>
            </div>
          </SectionCard>

          <div className="mt-auto space-y-3 pb-1">
            <PrimaryButton type="button">Start today&apos;s session</PrimaryButton>
            <p className="px-1 text-center text-xs leading-5 text-[#5c7188]">
              Almost there. Slow, intentional repetition will make this feel easier over time.
            </p>
          </div>
        </div>
      </ScreenTransition>
    </AppShell>
  );
}
