import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Crown, Sparkles } from 'lucide-react';
import type { SurpriseConfig } from '../../config/personalization';
import { CoquetteBowIcon, LaceDivider } from '../CoquetteIcons';

interface BarbieContractSceneProps {
  config: SurpriseConfig;
  onAcceptAndPlay: () => void;
}

export function BarbieContractScene({
  config,
  onAcceptAndPlay,
}: BarbieContractSceneProps) {
  const reducedMotion = useReducedMotion();
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <section
      aria-label="The Official Barbie Contract reward announcement"
      className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-4xl flex-col items-center justify-center px-4 py-14 sm:px-6"
    >
      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="certificate-frame relative w-full overflow-hidden rounded-[2rem] p-6 sm:p-10 lg:p-12"
      >
        <div className="flex flex-col items-center text-center">
          <CoquetteBowIcon className="mb-3 h-10 w-16" />
          <p className="text-xs font-semibold tracking-wider text-[#B53574] uppercase">
            Your prize if you beat the next mini-game
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold text-[#70445C] sm:text-4xl">
            {config.barbieContract.heading}
          </h1>
        </div>

        <LaceDivider className="my-6" />

        <div className="grid grid-cols-1 items-center gap-7 lg:grid-cols-12 lg:gap-10">
          {/* Watercolor Tiara & Cushion Illustration */}
          <div className="flex flex-col items-center lg:col-span-5">
            <div className="relative aspect-[4/3] w-full max-w-xs overflow-hidden rounded-[1.5rem] border border-[#F8C8DC] bg-[#FFF5F8] shadow-sm lg:max-w-none">
              {!imgFailed ? (
                <img
                  src={config.barbieContract.emblemImage}
                  alt="A pastel pink pearl princess tiara and satin bow resting on a blush velvet cushion"
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#FFF0F5] p-6 text-[#D94F91]">
                  <Crown className="h-12 w-12" />
                  <span className="font-display text-sm font-semibold">
                    Official Barbie Universe Pass
                  </span>
                </div>
              )}
            </div>

            <p className="mt-4 text-center text-xs italic leading-relaxed text-[#8E6279]">
              Win {config.gameWinningScore} teddy bears in the next mission to unlock
              your signed, downloadable certificate!
            </p>
          </div>

          {/* Official Terms & Conditions */}
          <div className="flex flex-col lg:col-span-7">
            <p className="font-display text-lg font-medium leading-relaxed text-[#70445C] sm:text-xl">
              “{config.barbieContract.intro}”
            </p>

            <h2 className="mt-5 text-sm font-semibold tracking-wide text-[#B53574]">
              Terms and conditions:
            </h2>

            <ol className="mt-3 space-y-2.5 text-sm text-[#70445C] sm:text-base">
              {config.barbieContract.terms.map((term, idx) => (
                <li key={idx} className="flex items-baseline gap-3">
                  <span className="font-display text-sm font-bold text-[#D94F91] tabular-nums">
                    {idx + 1}.
                  </span>
                  <span className="font-medium">{term}</span>
                </li>
              ))}
            </ol>

            <p className="mt-6 rounded-2xl bg-[#FFF0F5] px-4 py-3 text-xs font-medium leading-relaxed text-[#8E6279] border border-[#F8C8DC]/80">
              {config.barbieContract.disclaimer}
            </p>

            <div className="mt-7 flex justify-center lg:justify-start">
              <motion.button
                type="button"
                onClick={onAcceptAndPlay}
                whileHover={reducedMotion ? undefined : { scale: 1.02 }}
                whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                className="ribbon-cta inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full px-8 py-3 text-base font-semibold whitespace-nowrap cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>{config.barbieContract.acceptButtonLabel}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
