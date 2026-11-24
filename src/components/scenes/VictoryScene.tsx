import { useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Award } from 'lucide-react';
import type { SurpriseConfig } from '../../config/personalization';
import { playVictoryFanfare } from '../../utils/soundFx';
import { CoquetteBowIcon, TeddyEmblemIcon } from '../CoquetteIcons';

interface VictorySceneProps {
  config: SurpriseConfig;
  globalMuted: boolean;
  onClaimCertificate: () => void;
}

export function VictoryScene({
  config,
  globalMuted,
  onClaimCertificate,
}: VictorySceneProps) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    playVictoryFanfare(globalMuted);
  }, [globalMuted]);

  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: `${4 + ((i * 19) % 92)}%`,
        delay: (i % 7) * 0.14,
        duration: 2.3 + (i % 4) * 0.45,
        kind: i % 3 === 0 ? 'heart' : i % 3 === 1 ? 'sparkle' : 'ribbon',
        color: ['#FF8FBD', '#D94F91', '#F8C8DC', '#C9A7EB', '#F9B8D0'][i % 5],
      })),
    []
  );

  return (
    <section
      aria-label="Mission victory celebration"
      className="relative mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col items-center justify-center px-4 py-12"
    >
      {/* Celebratory floating confetti, hearts & sparkles */}
      {!reducedMotion && (
        <div
          className="pointer-events-none fixed inset-0 overflow-hidden z-10"
          aria-hidden="true"
        >
          {confettiPieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{ y: -40, opacity: 0, rotate: 0 }}
              animate={{
                y: ['0vh', '105vh'],
                opacity: [0, 1, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: piece.duration,
                delay: piece.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ left: piece.left }}
              className="absolute top-0"
            >
              {piece.kind === 'heart' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill={piece.color}>
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : piece.kind === 'sparkle' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill={piece.color}>
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
              ) : (
                <span
                  className="block h-3 w-2 rounded-sm"
                  style={{ backgroundColor: piece.color }}
                />
              )}
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="stationery-card relative z-20 flex w-full flex-col items-center rounded-[2rem] px-6 py-11 text-center sm:px-12 sm:py-14"
      >
        <CoquetteBowIcon className="mb-3 h-11 w-16" />

        <motion.div
          animate={reducedMotion ? undefined : { scale: [1, 1.08, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-[#FFF0F5] border-2 border-[#F8C8DC]"
        >
          <TeddyEmblemIcon className="h-16 w-16" />
        </motion.div>

        <h1 className="font-display text-3xl font-bold text-[#D94F91] sm:text-5xl">
          {config.game.victoryHeading}
        </h1>

        <p className="mt-3 max-w-md text-lg font-medium text-[#70445C] sm:text-xl">
          {config.game.victorySubheading}
        </p>

        <p className="mt-2 text-sm text-[#8E6279]">
          Officially proven: {config.gameWinningScore}/{config.gameWinningScore} teddy
          bears rescued .
        </p>

        <motion.button
          type="button"
          onClick={onClaimCertificate}
          whileHover={reducedMotion ? undefined : { scale: 1.03 }}
          whileTap={reducedMotion ? undefined : { scale: 0.97 }}
          className="ribbon-cta mt-8 inline-flex min-h-[54px] items-center justify-center gap-2.5 rounded-full px-8 py-3.5 text-base font-semibold whitespace-nowrap cursor-pointer"
        >
          <Award className="h-5 w-5" />
          <span>Claim Your Barbie Certificate 💅</span>
        </motion.button>
      </motion.div>
    </section>
  );
}
