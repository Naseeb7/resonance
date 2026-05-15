import { AppShell } from "@/components/ui/app-shell";
import { LessonEngine } from "@/components/lesson/lesson-engine";

export default function Home() {
  return (
    <AppShell>
      <LessonEngine />
    </AppShell>
  );
}
