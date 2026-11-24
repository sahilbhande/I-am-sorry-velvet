import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import type { SurpriseConfig } from '../../config/personalization';
import { CoquetteBowIcon } from '../CoquetteIcons';

interface ApologyTransitionSceneProps {
  config: SurpriseConfig;
  onContinue: () => void;
}

export function ApologyTransitionScene({
  config,
  onContinue,
}: ApologyTransitionSceneProps) {
  const reducedMotion = useReducedMotion();
  const [showSecondLine, setShowSecondLine] = useState(Boolean(reducedMotion));

  useEffect(() => {
    if (reducedMotion) {
      setShowSecondLine(true);
      return;
    }
    const timer = window.setTimeout(() => {
      setShowSecondLine(true);
    }, 1100);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  return (
    <section
      aria-label="Transition to heartfelt letter"
      className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col items-center justify-center px-4 py-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="stationery-card flex w-full flex-col items-center rounded-[2rem] px-7 py-12 text-center sm:px-12 sm:py-16"
      >
        <CoquetteBowIcon className="mb-6 h-10 w-16" />

        <h1 className="font-display text-3xl font-semibold leading-snug text-[#70445C] sm:text-4xl">
          {config.prank.apologyFirstLine}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={showSecondLine ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.55 }}
          className="mt-5 flex flex-col items-center"
        >
          <p className="max-w-md text-lg leading-relaxed text-[#8E6279] sm:text-xl">
            {config.prank.apologySecondLine}
          </p>

          <button
            type="button"
            onClick={onContinue}
            className="ribbon-cta mt-9 inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-full px-8 py-3 text-base font-semibold whitespace-nowrap cursor-pointer"
          >
            <span>See what I actually made</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
