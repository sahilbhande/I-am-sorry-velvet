import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Heart, Image as ImageIcon, MailOpen } from 'lucide-react';
import type { SurpriseConfig } from '../../config/personalization';
import { CoquetteBowIcon, LaceDivider, WaxHeartSeal } from '../CoquetteIcons';

interface LetterSceneProps {
  config: SurpriseConfig;
  onOpenEnvelopeSound: () => void;
  onContinue: () => void;
}

export function LetterScene({
  config,
  onOpenEnvelopeSound,
  onContinue,
}: LetterSceneProps) {
  const reducedMotion = useReducedMotion();
  const [stage, setStage] = useState<'sealed' | 'opening' | 'opened'>('sealed');

  const handleOpenEnvelope = () => {
    if (stage !== 'sealed') return;
    onOpenEnvelopeSound();
    if (reducedMotion) {
      setStage('opened');
      return;
    }
    setStage('opening');
    window.setTimeout(() => {
      setStage('opened');
    }, 680);
  };

  return (
    <section
      aria-label="Heartfelt letter"
      className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col items-center justify-center px-4 pt-16 pb-12 sm:px-6 sm:py-14"
    >
      <AnimatePresence mode="wait">
        {stage !== 'opened' ? (
          <motion.div
            key="envelope-view"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.45 }}
            className="stationery-card flex w-full max-w-xl flex-col items-center rounded-[2rem] px-6 py-10 text-center sm:px-10 sm:py-12"
          >
            <p className="font-display text-2xl font-semibold text-[#70445C] sm:text-3xl">
              {config.letter.envelopePrompt}
            </p>

            {/* Interactive Illustrated Envelope */}
            <div className="relative mt-9 mb-8 w-full max-w-[300px] sm:max-w-[330px]">
              <div className="relative h-52 w-full rounded-[1.25rem] border-2 border-[#F2A8C9] bg-[#FFF5F9] shadow-[0_18px_36px_-16px_rgba(217,79,145,0.28)]">
                {/* Inner letter peeking upward when opening */}
                <motion.div
                  animate={
                    stage === 'opening'
                      ? { y: -48, opacity: 1 }
                      : { y: 0, opacity: 0.95 }
                  }
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-x-4 top-5 bottom-4 rounded-xl border border-[#F8C8DC] bg-[#FFFDFB] p-4 text-left shadow-sm"
                >
                  <p className="font-hand text-xl text-[#D94F91]">
                    {config.letter.salutation}
                  </p>
                  <div className="mt-2 space-y-1.5 opacity-45">
                    <div className="h-1.5 w-5/6 rounded-full bg-[#F4B9D4]" />
                    <div className="h-1.5 w-4/6 rounded-full bg-[#F4B9D4]" />
                  </div>
                </motion.div>

                {/* Envelope front bottom pocket */}
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox="0 0 320 208"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <polygon
                    points="0,208 160,104 320,208"
                    fill="#FFE4F0"
                    stroke="#F2A8C9"
                    strokeWidth="2"
                  />
                  <polygon
                    points="0,0 120,104 0,208"
                    fill="#FFF0F5"
                    stroke="#F2A8C9"
                    strokeWidth="1.5"
                  />
                  <polygon
                    points="320,0 200,104 320,208"
                    fill="#FFF0F5"
                    stroke="#F2A8C9"
                    strokeWidth="1.5"
                  />
                </svg>

                {/* Top Flap animating open */}
                <motion.div
                  style={{ transformOrigin: 'top center' }}
                  animate={stage === 'opening' ? { rotateX: 165 } : { rotateX: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-x-0 top-0 h-28"
                >
                  <svg
                    className="h-full w-full drop-shadow-sm"
                    viewBox="0 0 320 112"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <polygon
                      points="0,0 160,106 320,0"
                      fill="#FFD7E8"
                      stroke="#F2A8C9"
                      strokeWidth="2"
                    />
                  </svg>
                </motion.div>

                {/* Wax Heart Seal */}
                <motion.div
                  animate={
                    stage === 'opening'
                      ? { scale: 0.7, opacity: 0 }
                      : { scale: 1, opacity: 1 }
                  }
                  transition={{ duration: 0.25 }}
                  className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <WaxHeartSeal className="h-14 w-14 drop-shadow" />
                </motion.div>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={handleOpenEnvelope}
              whileHover={reducedMotion ? undefined : { scale: 1.03 }}
              whileTap={reducedMotion ? undefined : { scale: 0.97 }}
              className="ribbon-cta inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full px-8 py-3 text-base font-semibold whitespace-nowrap cursor-pointer"
            >
              <MailOpen className="h-5 w-5" />
              <span>{config.letter.openButtonLabel}</span>
            </motion.button>
          </motion.div>
        ) : (
          <motion.article
            key="letter-content"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {/* Handwritten Stationery Sheet */}
            <div className="letter-paper relative rounded-[1.75rem] px-6 py-8 sm:px-11 sm:py-12">
              <div className="mb-5 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                <CoquetteBowIcon className="h-9 w-14" />
                <span className="text-xs font-medium tracking-wide text-[#A67890]">
                  from your annoying brother, {config.brotherName}
                </span>
              </div>

              <h1 className="font-hand text-3xl font-bold text-[#D94F91] sm:text-4xl">
                {config.letter.salutation}
              </h1>

              <div className="mt-5 space-y-5 font-hand text-[1.45rem] leading-[1.58] text-[#60394E] sm:text-[1.65rem]">
                {config.letter.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 flex flex-col items-end text-right">
                <p className="whitespace-pre-line font-hand text-[1.6rem] font-bold leading-snug text-[#D94F91] sm:text-[1.8rem]">
                  {config.letter.signOff}
                </p>
              </div>

              <LaceDivider className="my-8" />

              {/* Optional Customizable Memory Polaroids */}
              {config.letter.memories.length > 0 && (
                <div>
                  <p className="mb-4 text-center text-sm font-semibold text-[#8E6279]">
                    {config.letter.memoriesSectionHeading}
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {config.letter.memories.map((mem) => (
                      <figure
                        key={mem.id}
                        className="rounded-2xl border border-[#F8C8DC] bg-white p-3.5 shadow-sm"
                      >
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#FFF0F5] border border-[#F8C8DC]/70">
                          {mem.imagePath ? (
                            <img
                              src={mem.imagePath}
                              alt={mem.title}
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center text-[#B2849B]">
                              <ImageIcon className="h-7 w-7 opacity-75" />
                              <span className="text-xs font-medium">
                                {mem.title}
                              </span>
                            </div>
                          )}
                        </div>
                        <figcaption className="mt-3">
                          <div className="flex items-center justify-between gap-2 text-xs text-[#9C7087]">
                            <span className="font-semibold text-[#70445C]">
                              {mem.title}
                            </span>
                            <span>{mem.dateLabel}</span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-[#8E6279]">
                            {mem.caption}
                          </p>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              )}

              {/* Warm summary whisper + Next Scene CTA */}
              <div className="mt-9 flex flex-col items-center gap-5 text-center">
                <p className="flex items-center gap-2 text-sm font-medium text-[#9B6B84]">
                  <Heart className="h-4 w-4 fill-[#FF8FBD] text-[#D94F91] shrink-0" />
                  <span>Okay now time punishment time </span>
                </p>

                <motion.button
                  type="button"
                  onClick={onContinue}
                  whileHover={reducedMotion ? undefined : { scale: 1.02 }}
                  whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                  className="ribbon-cta inline-flex min-h-[52px] items-center justify-center rounded-full px-7 py-3 text-sm font-semibold sm:text-base cursor-pointer"
                >
                  {config.letter.nextButtonLabel}
                </motion.button>
              </div>
            </div>
          </motion.article>
        )}
      </AnimatePresence>
    </section>
  );
}
