"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionCard } from "@/components/ui/section-card";

type StepId =
  | "welcome"
  | "listen-repeat"
  | "word-recognition"
  | "mirror-mode"
  | "reflection"
  | "completion";

type LessonStep = {
  id: StepId;
  title: string;
  subtitle: string;
};

const LESSON_STEPS: LessonStep[] = [
  {
    id: "welcome",
    title: "Welcome back",
    subtitle: "A steady four-minute session to strengthen R articulation with calm repetition.",
  },
  {
    id: "listen-repeat",
    title: "Listen & Repeat",
    subtitle: "Hear the focus word, then record a short attempt in your own pace.",
  },
  {
    id: "word-recognition",
    title: "Word Recognition",
    subtitle: "Choose the clearest R-sound example and tune your ear for articulation detail.",
  },
  {
    id: "mirror-mode",
    title: "Mirror Mode",
    subtitle: "Use the front camera for self-awareness and mouth placement confidence.",
  },
  {
    id: "reflection",
    title: "Reflection Check-In",
    subtitle: "Notice how today felt. Consistency and awareness matter more than perfection.",
  },
  {
    id: "completion",
    title: "Session Complete",
    subtitle: "You showed up today. Every repetition supports stronger articulation.",
  },
];

const recognitionOptions = ["river", "lotion", "rocket"];
const reflectionOptions = ["Calm and focused", "Getting closer", "Needed more time"];

export function LessonEngine() {
  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = LESSON_STEPS[stepIndex];
  const progressValue = Math.round((stepIndex / (LESSON_STEPS.length - 1)) * 100);

  const [isListening, setIsListening] = useState(false);
  const [hasListened, setHasListened] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [showWordFeedback, setShowWordFeedback] = useState(false);

  const [reflection, setReflection] = useState<string | null>(null);

  const [cameraState, setCameraState] = useState<"idle" | "granted" | "denied">("idle");
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stepNumber = useMemo(() => `${stepIndex + 1} of ${LESSON_STEPS.length}`, [stepIndex]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const moveNext = () => {
    setStepIndex((prev) => Math.min(prev + 1, LESSON_STEPS.length - 1));
  };

  const playFocusAudio = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setHasListened(true);
    }, 1700);
  };

  const recordAttempt = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setHasRecorded(true);
    }, 2200);
  };

  const enableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraState("granted");
      setCameraReady(true);
    } catch {
      setCameraState("denied");
    }
  };

  const showNextCta = currentStep.id !== "completion";

  const canProceed =
    currentStep.id === "welcome" ||
    currentStep.id === "completion" ||
    (currentStep.id === "listen-repeat" && hasListened && hasRecorded) ||
    (currentStep.id === "word-recognition" && selectedWord !== null) ||
    (currentStep.id === "mirror-mode" && cameraReady) ||
    (currentStep.id === "reflection" && reflection !== null);

  return (
    <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col gap-5 p-5 sm:min-h-[44rem]">
      <header className="space-y-3 pt-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5c728a]">Resonance</p>
        <h1 className="text-[1.75rem] font-semibold leading-9 tracking-[-0.015em] text-app-heading">
          {currentStep.title}
        </h1>
        <p className="text-sm leading-6 text-[#566b82]">{currentStep.subtitle}</p>
      </header>

      <SectionCard title={`Daily flow • ${stepNumber}`} description="Calm progression with supportive practice cues.">
        <ProgressBar value={progressValue} />
      </SectionCard>

      <AnimatePresence mode="wait">
        <motion.section
          key={currentStep.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.35, ease: [0.25, 0.9, 0.3, 1] }}
          className="space-y-4"
        >
          {currentStep.id === "welcome" ? (
            <WelcomeStep />
          ) : null}

          {currentStep.id === "listen-repeat" ? (
            <ListenRepeatStep
              isListening={isListening}
              isRecording={isRecording}
              hasListened={hasListened}
              hasRecorded={hasRecorded}
              onPlay={playFocusAudio}
              onRecord={recordAttempt}
            />
          ) : null}

          {currentStep.id === "word-recognition" ? (
            <WordRecognitionStep
              selectedWord={selectedWord}
              showFeedback={showWordFeedback}
              onSelect={(word) => {
                setSelectedWord(word);
                setShowWordFeedback(true);
              }}
            />
          ) : null}

          {currentStep.id === "mirror-mode" ? (
            <MirrorModeStep
              cameraState={cameraState}
              videoRef={videoRef}
              onEnableCamera={enableCamera}
            />
          ) : null}

          {currentStep.id === "reflection" ? (
            <ReflectionStep selected={reflection} onSelect={setReflection} />
          ) : null}

          {currentStep.id === "completion" ? <CompletionStep /> : null}
        </motion.section>
      </AnimatePresence>

      <div className="mt-auto space-y-3 pb-1">
        {showNextCta ? (
          <PrimaryButton type="button" onClick={moveNext} disabled={!canProceed}>
            Continue
          </PrimaryButton>
        ) : (
          <PrimaryButton
            type="button"
            onClick={() => {
              setStepIndex(0);
              setHasListened(false);
              setHasRecorded(false);
              setSelectedWord(null);
              setShowWordFeedback(false);
              setReflection(null);
            }}
          >
            Begin tomorrow&apos;s session
          </PrimaryButton>
        )}
        <p className="px-1 text-center text-xs leading-5 text-[#5c7188]">
          {currentStep.id === "completion"
            ? "Consistency strengthens articulation. You are building it one session at a time."
            : "Try again slowly when needed. A calm pace helps articulation settle in."}
        </p>
      </div>
    </div>
  );
}

function WelcomeStep() {
  return (
    <SectionCard
      title="Today&apos;s focus set"
      description="Listen, repeat, notice placement, and reflect. This session is built to feel steady."
    >
      <div className="rounded-2xl border border-[#d7e2e7] bg-[#edf4f7] p-4">
        <p className="text-sm font-medium text-app-heading">R-word set: river, warm, grow</p>
        <p className="mt-1 text-sm text-[#5e7288]">Estimated time: 4 minutes</p>
      </div>
    </SectionCard>
  );
}

function ListenRepeatStep({
  isListening,
  isRecording,
  hasListened,
  hasRecorded,
  onPlay,
  onRecord,
}: {
  isListening: boolean;
  isRecording: boolean;
  hasListened: boolean;
  hasRecorded: boolean;
  onPlay: () => void;
  onRecord: () => void;
}) {
  return (
    <SectionCard title="Focus word" description="Listen once, then record one slow attempt.">
      <div className="space-y-4">
        <div className="rounded-2xl border border-[#d7e4e8] bg-[#f2f7f8] px-4 py-6 text-center">
          <p className="text-4xl font-semibold tracking-[-0.02em] text-app-heading">River</p>
        </div>
        <WavePulse active={isListening || isRecording} />
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onPlay}
            disabled={isListening}
            className="rounded-2xl border border-[#cbdbe1] bg-[#f4f9fa] px-4 py-3 text-sm font-medium text-[#365469] transition-colors hover:bg-[#ebf4f7] disabled:opacity-60"
          >
            {isListening ? "Playing..." : hasListened ? "Replay audio" : "Play audio"}
          </button>
          <button
            type="button"
            onClick={onRecord}
            disabled={isRecording || !hasListened}
            className="rounded-2xl border border-[#cbdbe1] bg-[#f4f9fa] px-4 py-3 text-sm font-medium text-[#365469] transition-colors hover:bg-[#ebf4f7] disabled:opacity-60"
          >
            {isRecording ? "Recording..." : hasRecorded ? "Record again" : "Record attempt"}
          </button>
        </div>
        <p className="text-sm text-[#5c7188]">
          {hasRecorded
            ? "That sounded stronger. Keep your jaw relaxed and tongue steady on the next pass."
            : "Try again slowly. Clarity improves when you leave a short pause before the R sound."}
        </p>
      </div>
    </SectionCard>
  );
}

function WordRecognitionStep({
  selectedWord,
  showFeedback,
  onSelect,
}: {
  selectedWord: string | null;
  showFeedback: boolean;
  onSelect: (word: string) => void;
}) {
  const bestAnswer = "rocket";
  const supportive =
    selectedWord === bestAnswer
      ? "That sounded stronger. You picked the clearest R onset."
      : "Getting closer. Try listening for a steadier R at the beginning of the word.";

  return (
    <SectionCard title="Choose the clearest R-sound" description="Select the option with the strongest opening R.">
      <div className="space-y-3">
        {recognitionOptions.map((option) => (
          <motion.button
            key={option}
            whileTap={{ scale: 0.99 }}
            type="button"
            onClick={() => onSelect(option)}
            className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
              selectedWord === option
                ? "border-[#8eb0c4] bg-[#eaf3f8] text-[#2e4b62]"
                : "border-[#d3e1e6] bg-[#f8fbfc] text-[#486076] hover:bg-[#f0f6f9]"
            }`}
          >
            {option}
          </motion.button>
        ))}
        {showFeedback ? <p className="pt-1 text-sm text-[#5c7188]">{supportive}</p> : null}
      </div>
    </SectionCard>
  );
}

function MirrorModeStep({
  cameraState,
  videoRef,
  onEnableCamera,
}: {
  cameraState: "idle" | "granted" | "denied";
  videoRef: RefObject<HTMLVideoElement | null>;
  onEnableCamera: () => Promise<void>;
}) {
  return (
    <SectionCard
      title="Mirror awareness"
      description="This is for self-awareness only. No scoring, no judgment, just guided observation."
    >
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-2xl border border-[#cedde4] bg-[#dfe8ee]">
          <video ref={videoRef} autoPlay muted playsInline className="h-56 w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-36 w-28 rounded-[2rem] border-2 border-white/80 shadow-[0_0_0_999px_rgba(29,53,71,0.22)]" />
          </div>
          {cameraState === "idle" ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[#dce6eb]">
              <p className="text-sm text-[#4f657c]">Enable camera to begin mirror guidance.</p>
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onEnableCamera}
          className="w-full rounded-2xl border border-[#c9d9df] bg-[#f4f9fa] px-4 py-3 text-sm font-medium text-[#365469] transition-colors hover:bg-[#ebf4f7]"
        >
          {cameraState === "granted" ? "Camera ready" : "Enable front camera"}
        </button>
        <p className="text-sm text-[#5c7188]">
          {cameraState === "denied"
            ? "Camera access is off. You can continue after allowing permission and trying again."
            : "Keep lips relaxed, then softly shape the R sound while watching tongue and jaw stability."}
        </p>
      </div>
    </SectionCard>
  );
}

function ReflectionStep({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (option: string) => void;
}) {
  return (
    <SectionCard title="How did this practice feel?" description="Choose the response that matches your session.">
      <div className="space-y-3">
        {reflectionOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
              selected === option
                ? "border-[#8ea9bc] bg-[#eaf2f7] text-[#2e4b62]"
                : "border-[#d3e1e6] bg-[#f8fbfc] text-[#4b6278] hover:bg-[#f0f6f9]"
            }`}
          >
            {option}
          </button>
        ))}
        {selected ? <p className="pt-1 text-sm text-[#5c7188]">Thank you. This check-in helps pace future sessions.</p> : null}
      </div>
    </SectionCard>
  );
}

function CompletionStep() {
  return (
    <SectionCard
      title="You showed up today"
      description="Consistency strengthens articulation. Every repetition builds muscle memory."
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-[#d1dfe5] bg-[#eef4f8] p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-[#6a7f94]">Streak</p>
          <p className="mt-1 text-2xl font-semibold text-app-heading">6 days</p>
        </div>
        <div className="rounded-2xl border border-[#d1dfe5] bg-[#edf5f3] p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-[#6a7f94]">Session XP</p>
          <p className="mt-1 text-2xl font-semibold text-app-heading">+120</p>
        </div>
      </div>
    </SectionCard>
  );
}

function WavePulse({ active }: { active: boolean }) {
  return (
    <div className="flex h-10 items-center justify-center gap-1 rounded-2xl border border-[#d6e3e8] bg-[#f3f8fa] px-4">
      {[0, 1, 2, 3, 4, 5, 6].map((bar) => (
        <motion.span
          key={bar}
          className="w-1.5 rounded-full bg-[#7fa0b5]"
          animate={{
            height: active ? [8, 18, 10, 22, 9] : 8,
            opacity: active ? [0.45, 0.9, 0.65, 0.8, 0.5] : 0.45,
          }}
          transition={{
            duration: 1.2,
            repeat: active ? Infinity : 0,
            ease: "easeInOut",
            delay: bar * 0.07,
          }}
        />
      ))}
    </div>
  );
}
