import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { SurpriseConfig } from '../../config/personalization';
import { CoquetteBowIcon, LaceDivider, TeddyEmblemIcon } from '../CoquetteIcons';

interface EntranceSceneProps {
  config: SurpriseConfig;
  onStart: () => void;
}

export function EntranceScene({ config, onStart }: EntranceSceneProps) {
  const reducedMotion = useReducedMotion();
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <section
      aria-label="Welcome surprise"
      className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-5xl flex-col items-center justify-center px-4 py-12 sm:px-8"
    >
      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="stationery-card relative w-full overflow-hidden rounded-[2rem] p-6 sm:p-10 lg:p-14"
      >
        {/* Top delicate bow accent */}
        <div className="mb-6 flex justify-center lg:mb-8">
          <CoquetteBowIcon className="h-10 w-16 sm:h-12 sm:w-20" />
        </div>

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Illustrated Hero Teddy Bear */}
          <div className="flex justify-center lg:col-span-5">
            <motion.div
              animate={
                reducedMotion
                  ? undefined
                  : { y: [0, -8, 0], rotate: [-1, 1.2, -1] }
              }
              transition={{
                duration: 4.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative aspect-square w-60 max-w-full overflow-hidden rounded-[1.75rem] border border-[#F8C8DC] bg-[#FFF0F5] shadow-[0_18px_36px_-18px_rgba(217,79,145,0.32)] sm:w-72 lg:w-80"
            >
              {!imgFailed ? (
                <img
                  src={config.entrance.heroImage}
                  alt="A cute fluffy teddy bear wearing a pink ribbon bow and hugging a pink heart"
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#FFF0F5] to-[#F8C8DC]/60 p-6 text-center">
                  <TeddyEmblemIcon className="h-24 w-24" />
                  <span className="font-hand text-2xl text-[#70445C]">
                    Special delivery for you ♡
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Copy & Primary CTA */}
          <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
            <p className="mb-3 text-sm font-medium tracking-wide text-[#B53574]">
              pyali behena keliye pyalasa gift hehehehe
            </p>

            <h1 className="font-display text-3xl font-semibold leading-[1.15] text-[#70445C] sm:text-4xl lg:text-[2.85rem]">
              {config.entrance.heading}
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#7E5269] sm:text-lg">
              {config.entrance.subtitle}
            </p>

            <LaceDivider className="my-6 w-full max-w-xs lg:max-w-sm" />

            <div className="flex flex-col items-center gap-3 sm:flex-row lg:items-center">
              <motion.button
                type="button"
                onClick={onStart}
                whileHover={reducedMotion ? undefined : { scale: 1.03 }}
                whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                className="ribbon-cta inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full px-8 py-3.5 text-base font-semibold whitespace-nowrap cursor-pointer"
              >
                <span>{config.entrance.ctaLabel}</span>
              </motion.button>
            </div>

            <p className="mt-4 text-xs text-[#9C7087]">
              Best experienced with your sound turned up a tiny bit
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
