"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
const softEase = [0.22, 0.85, 0.3, 1] as const;
const optionBaseClass =
  "w-full rounded-2xl border px-4 py-3 text-left text-sm transition-colors";
const optionSelectedClass =
  "border-[#8ea9bc] bg-[#eaf2f7] text-[#2e4b62] shadow-[0_8px_18px_-14px_rgba(46,75,98,0.55)]";
const optionIdleClass =
  "border-[#d3e1e6] bg-[#f8fbfc] text-[#4b6278] hover:bg-[#f0f6f9]";
const secondaryActionButtonClass =
  "rounded-2xl border border-[#cbdbe1] bg-[#f4f9fa] px-4 py-3 text-sm font-medium text-[#365469] transition-[transform,background-color,box-shadow] duration-200 hover:bg-[#ebf4f7] active:translate-y-[1px] active:bg-[#e6f1f5] disabled:opacity-60";

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
  const listenTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stepNumber = useMemo(() => `${stepIndex + 1} of ${LESSON_STEPS.length}`, [stepIndex]);
  const isMirrorStep = currentStep.id === "mirror-mode";

  const clearPracticeTimers = useCallback(() => {
    if (listenTimeoutRef.current) {
      clearTimeout(listenTimeoutRef.current);
      listenTimeoutRef.current = null;
    }
    if (recordTimeoutRef.current) {
      clearTimeout(recordTimeoutRef.current);
      recordTimeoutRef.current = null;
    }
  }, []);

  const releaseCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const stopCameraStream = useCallback(() => {
    releaseCameraStream();
    setCameraReady(false);
    setCameraState("idle");
  }, [releaseCameraStream]);

  const resetSession = useCallback(() => {
    clearPracticeTimers();
    stopCameraStream();
    setStepIndex(0);
    setHasListened(false);
    setIsListening(false);
    setHasRecorded(false);
    setIsRecording(false);
    setSelectedWord(null);
    setShowWordFeedback(false);
    setReflection(null);
  }, [clearPracticeTimers, stopCameraStream]);

  useEffect(() => {
    return () => {
      clearPracticeTimers();
      releaseCameraStream();
    };
  }, [clearPracticeTimers, releaseCameraStream]);

  useEffect(() => {
    if (!isMirrorStep) {
      releaseCameraStream();
    }
  }, [isMirrorStep, releaseCameraStream]);

  const moveNext = () => {
    if (isMirrorStep) {
      stopCameraStream();
    }
    setStepIndex((prev) => Math.min(prev + 1, LESSON_STEPS.length - 1));
  };

  const playFocusAudio = useCallback(() => {
    if (listenTimeoutRef.current) {
      clearTimeout(listenTimeoutRef.current);
    }
    setIsListening(true);
    listenTimeoutRef.current = setTimeout(() => {
      setIsListening(false);
      setHasListened(true);
      listenTimeoutRef.current = null;
    }, 1700);
  }, []);

  const recordAttempt = useCallback(() => {
    if (recordTimeoutRef.current) {
      clearTimeout(recordTimeoutRef.current);
    }
    setIsRecording(true);
    recordTimeoutRef.current = setTimeout(() => {
      setIsRecording(false);
      setHasRecorded(true);
      recordTimeoutRef.current = null;
    }, 2200);
  }, []);

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
      setCameraReady(false);
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
    <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col gap-5 p-5 min-[430px]:gap-6 min-[430px]:px-6 min-[430px]:py-6 sm:min-h-[44rem]">
      <header className="space-y-3 pt-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5c728a]">Resonance</p>
        <h1 className="text-[1.75rem] font-semibold leading-9 tracking-[-0.015em] text-app-heading">{currentStep.title}</h1>
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
          transition={{ duration: 0.42, ease: softEase }}
          className="space-y-4"
        >
          {currentStep.id === "welcome" ? <WelcomeStep /> : null}

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
            <MirrorModeStep cameraState={cameraState} videoRef={videoRef} onEnableCamera={enableCamera} />
          ) : null}

          {currentStep.id === "reflection" ? <ReflectionStep selected={reflection} onSelect={setReflection} /> : null}

          {currentStep.id === "completion" ? <CompletionStep /> : null}
        </motion.section>
      </AnimatePresence>

      <div className="mt-auto space-y-3 pb-1">
        <motion.div layout transition={{ duration: 0.3, ease: softEase }}>
          {showNextCta ? (
            <PrimaryButton type="button" onClick={moveNext} disabled={!canProceed}>
              Continue
            </PrimaryButton>
          ) : (
            <PrimaryButton type="button" onClick={resetSession}>
              Begin tomorrow&apos;s session
            </PrimaryButton>
          )}
        </motion.div>
        <p className="px-1 text-center text-xs leading-5 text-[#5c7188]">
          {currentStep.id === "completion"
            ? "Consistency strengthens articulation. You are building it one steady session at a time."
            : "Try again slowly when needed. A calm pace helps articulation settle in."}
        </p>
      </div>
    </div>
  );
}

function WelcomeStep() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: softEase }}>
      <SectionCard
        title="Today&apos;s focus set"
        description="Listen, repeat, notice placement, and reflect. This session is built to feel steady."
      >
        <div className="rounded-2xl border border-[#d7e2e7] bg-[#edf4f7] p-4">
          <p className="text-sm font-medium text-app-heading">R-word set: river, warm, grow</p>
          <p className="mt-1 text-sm text-[#5e7288]">Estimated time: 4 minutes</p>
        </div>
      </SectionCard>
    </motion.div>
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
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        className="space-y-4"
      >
        <div className="rounded-2xl border border-[#d7e4e8] bg-[#f2f7f8] px-4 py-6 text-center">
          <p className="text-4xl font-semibold tracking-[-0.02em] text-app-heading">River</p>
        </div>
        <WavePulse active={isListening || isRecording} />
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onPlay}
            disabled={isListening}
            className={secondaryActionButtonClass}
          >
            {isListening ? "Playing..." : hasListened ? "Replay audio" : "Play audio"}
          </button>
          <button
            type="button"
            onClick={onRecord}
            disabled={isRecording || !hasListened}
            className={secondaryActionButtonClass}
          >
            {isRecording ? "Recording..." : hasRecorded ? "Record again" : "Record attempt"}
          </button>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={hasRecorded ? "done" : "guide"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.28, ease: softEase }}
            className="text-sm text-[#5c7188]"
          >
            {hasRecorded
              ? "That sounded stronger. Keep your jaw relaxed and tongue steady on the next pass."
              : "Try again slowly. Clarity improves when you leave a short pause before the R sound."}
          </motion.p>
        </AnimatePresence>
      </motion.div>
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
        {recognitionOptions.map((option, index) => (
          <motion.button
            key={option}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04, ease: softEase }}
            whileTap={{ scale: 0.99 }}
            whileHover={{ y: -1 }}
            type="button"
            onClick={() => onSelect(option)}
            className={`${optionBaseClass} font-medium ${
              selectedWord === option
                ? "border-[#8eb0c4] bg-[#eaf3f8] text-[#2e4b62] shadow-[0_8px_18px_-14px_rgba(46,75,98,0.55)]"
                : "border-[#d3e1e6] bg-[#f8fbfc] text-[#486076] hover:bg-[#f0f6f9]"
            }`}
          >
            {option}
          </motion.button>
        ))}
        <AnimatePresence>
          {showFeedback ? (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.28, ease: softEase }}
              className="pt-1 text-sm text-[#5c7188]"
            >
              {supportive}
            </motion.p>
          ) : null}
        </AnimatePresence>
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
      description="A short guided check for lip shape, jaw softness, and steady R placement."
    >
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-2xl border border-[#cedde4] bg-[#dfe8ee]">
          <video ref={videoRef} autoPlay muted playsInline className="h-56 w-full object-cover" />
          <div className="pointer-events-none absolute inset-0">
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0)_62%)]"
              animate={{ opacity: [0.2, 0.35, 0.2], scale: [0.96, 1.02, 0.96] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative h-40 w-32 rounded-[2.2rem] border-2 border-white/85 shadow-[0_0_0_999px_rgba(29,53,71,0.24)]">
              <div className="absolute left-1/2 top-[56%] h-9 w-16 -translate-x-1/2 rounded-[999px] border border-white/85 bg-white/8" />
            </div>
          </div>
          {cameraState === "idle" ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[#dce6eb]/95">
              <p className="max-w-[15rem] px-4 text-center text-sm leading-6 text-[#4f657c]">
                Enable camera to begin guided mirror practice.
              </p>
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-[#d6e2e7] bg-[#f5f9fb] px-4 py-3">
          {[0, 1, 2, 3, 4].map((index) => (
            <motion.span
              key={index}
              className="h-1.5 w-1.5 rounded-full bg-[#7b99ae]"
              animate={{ opacity: [0.35, 0.9, 0.35], y: [0, -1.5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.14, ease: "easeInOut" }}
            />
          ))}
          <p className="ml-1 text-xs tracking-[0.08em] text-[#647a90]">Steady breath, gentle R rhythm</p>
        </div>
        <div className="rounded-2xl border border-[#d5e1e6] bg-[#f3f8fa] px-4 py-3">
          <p className="text-sm font-medium text-[#41596f]">Guidance</p>
          <p className="mt-1 text-sm leading-6 text-[#5d7288]">
            Keep your lips relaxed. Shape the R gently while watching for a stable jaw and smooth airflow.
          </p>
        </div>
        <button
          type="button"
          onClick={onEnableCamera}
          className="w-full rounded-2xl border border-[#c9d9df] bg-[#f4f9fa] px-4 py-3 text-sm font-medium text-[#365469] transition-[transform,background-color] duration-200 hover:bg-[#ebf4f7] active:translate-y-[1px]"
        >
          {cameraState === "granted" ? "Camera is ready" : "Enable front camera"}
        </button>
        <p className="text-sm text-[#5c7188]">
          {cameraState === "denied"
            ? "Camera access is currently off. Allow access when ready, then continue at your own pace."
            : "This check is for awareness, not scoring. Notice small improvements over repeated attempts."}
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
        {reflectionOptions.map((option, index) => (
          <motion.button
            key={option}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04, ease: softEase }}
            whileTap={{ scale: 0.995 }}
            type="button"
            onClick={() => onSelect(option)}
            className={`${optionBaseClass} ${
              selected === option ? optionSelectedClass : optionIdleClass
            }`}
          >
            {option}
          </motion.button>
        ))}
        <AnimatePresence>
          {selected ? (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.28, ease: softEase }}
              className="pt-1 text-sm text-[#5c7188]"
            >
              Thank you. This check-in helps pace future sessions.
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </SectionCard>
  );
}

function CompletionStep() {
  return (
    <SectionCard title="You showed up today" description="A calm finish to today&apos;s session. Your consistency is doing the work.">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-2 gap-3"
      >
        <div className="rounded-2xl border border-[#d1dfe5] bg-[#eef4f8] p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-[#6a7f94]">Streak</p>
          <p className="mt-1 text-2xl font-semibold text-app-heading">6 days</p>
        </div>
        <div className="rounded-2xl border border-[#d1dfe5] bg-[#edf5f3] p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-[#6a7f94]">Session XP</p>
          <p className="mt-1 text-2xl font-semibold text-app-heading">+120</p>
        </div>
      </motion.div>
      <p className="mt-3 text-sm leading-6 text-[#5d7288]">
        Every steady repetition builds speech confidence. Today&apos;s effort counts.
      </p>
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

