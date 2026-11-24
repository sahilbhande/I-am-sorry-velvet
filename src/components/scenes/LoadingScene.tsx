import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { SurpriseConfig } from '../../config/personalization';
import { CoquetteBowIcon, TeddyEmblemIcon } from '../CoquetteIcons';

interface LoadingSceneProps {
  config: SurpriseConfig;
  onComplete: () => void;
}

export function LoadingScene({ config, onComplete }: LoadingSceneProps) {
  const reducedMotion = useReducedMotion();
  const messages = config.loadingMessages;
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const totalMs = reducedMotion ? 1600 : 3400;
    const stepMs = totalMs / messages.length;

    const msgTimer = window.setInterval(() => {
      setMsgIndex((prev) => Math.min(prev + 1, messages.length - 1));
    }, stepMs);

    const startTime = performance.now();
    const progTimer = window.setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
      setProgress(pct);
    }, 50);

    const doneTimer = window.setTimeout(() => {
      onComplete();
    }, totalMs + 180);

    return () => {
      window.clearInterval(msgTimer);
      window.clearInterval(progTimer);
      window.clearTimeout(doneTimer);
    };
  }, [messages.length, onComplete, reducedMotion]);

  return (
    <section
      aria-label="Preparing your surprise"
      aria-live="polite"
      className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-xl flex-col items-center justify-center px-4 py-12"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="stationery-card flex w-full flex-col items-center rounded-[2rem] px-6 py-10 text-center sm:px-10 sm:py-12"
      >
        <motion.div
          animate={
            reducedMotion
              ? undefined
              : { y: [0, -10, 0], rotate: [-4, 4, -4] }
          }
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#FFF0F5] border border-[#F8C8DC]"
        >
          <TeddyEmblemIcon className="h-16 w-16" />
          <CoquetteBowIcon className="absolute -top-3 -right-2 h-8 w-11" />
        </motion.div>

        <div className="min-h-[3.5rem] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="font-display text-xl font-semibold text-[#70445C] sm:text-2xl"
            >
              {messages[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Soft ribbon loading bar */}
        <div className="mt-6 w-full max-w-xs">
          <div className="h-3 w-full overflow-hidden rounded-full bg-[#F8C8DC]/60 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FF8FBD] to-[#D94F91] transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2.5 text-xs font-medium text-[#9C7087] tabular-nums">
            {progress}% ready
          </p>
        </div>
      </motion.div>
    </section>
  );
}
