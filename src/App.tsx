/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { SURPRISE_CONFIG } from './config/personalization';
import {
  resolveInitialScene,
  type StoryScene,
} from './utils/storyFlow';
import {
  playButtonChime,
  playEnvelopeOpen,
  unlockAudioOnGesture,
} from './utils/soundFx';
import { FloatingDecor } from './components/FloatingDecor';
import { StoryProgress } from './components/StoryProgress';
import { EntranceScene } from './components/scenes/EntranceScene';
import { LoadingScene } from './components/scenes/LoadingScene';
import { PrankPlayerScene } from './components/scenes/PrankPlayerScene';
import { ApologyTransitionScene } from './components/scenes/ApologyTransitionScene';
import { LetterScene } from './components/scenes/LetterScene';
import { BarbieContractScene } from './components/scenes/BarbieContractScene';
import { TeddyGameScene } from './components/scenes/TeddyGameScene';
import { VictoryScene } from './components/scenes/VictoryScene';
import { CertificateScene } from './components/scenes/CertificateScene';

export default function App() {
  const [initialState] = useState(() =>
    resolveInitialScene(
      typeof window !== 'undefined' ? window.location.search : ''
    )
  );
  const [scene, setScene] = useState<StoryScene>(initialState.scene);
  const [autostartGame, setAutostartGame] = useState(initialState.autostartGame);
  const [sessionNonce, setSessionNonce] = useState(1);
  const [globalMuted, setGlobalMuted] = useState(false);
  const [audioPulse, setAudioPulse] = useState(0);

  // Sync current story scene onto body for clean inspection & scroll to top on scene changes
  useEffect(() => {
    document.body.dataset.scene = scene;
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (scene !== 'prank') {
      setAudioPulse(0);
    }
  }, [scene]);

  const handleOpenSurprise = useCallback(() => {
    unlockAudioOnGesture();
    playButtonChime(globalMuted);
    setScene('loading');
  }, [globalMuted]);

  const handleLoadingDone = useCallback(() => {
    setScene('prank');
  }, []);

  const handlePrankFinished = useCallback(() => {
    setAudioPulse(0);
    setScene('apology');
  }, []);

  const handleApologyContinue = useCallback(() => {
    playButtonChime(globalMuted);
    setScene('letter');
  }, [globalMuted]);

  const handleOpenEnvelopeSound = useCallback(() => {
    playEnvelopeOpen(globalMuted);
  }, [globalMuted]);

  const handleLetterContinue = useCallback(() => {
    playButtonChime(globalMuted);
    setScene('contract');
  }, [globalMuted]);

  const handleAcceptContract = useCallback(() => {
    playButtonChime(globalMuted);
    setAutostartGame(false);
    setScene('game');
  }, [globalMuted]);

  const handleGameWin = useCallback(() => {
    setScene('victory');
  }, []);

  const handleClaimCertificate = useCallback(() => {
    playButtonChime(globalMuted);
    setScene('certificate');
  }, [globalMuted]);

  const handleReplay = useCallback(() => {
    playButtonChime(globalMuted);
    setAudioPulse(0);
    setAutostartGame(false);
    setSessionNonce((n) => n + 1);
    setScene('entrance');
  }, [globalMuted]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="coquette-backdrop relative min-h-dvh w-full overflow-x-hidden text-[#70445C]">
        <FloatingDecor pulseLevel={audioPulse} />

        <StoryProgress
          scene={scene}
          globalMuted={globalMuted}
          onToggleGlobalMute={() => setGlobalMuted((m) => !m)}
        />

        <main className="relative z-10 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${scene}-${sessionNonce}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {scene === 'entrance' && (
                <EntranceScene
                  config={SURPRISE_CONFIG}
                  onStart={handleOpenSurprise}
                />
              )}

              {scene === 'loading' && (
                <LoadingScene
                  config={SURPRISE_CONFIG}
                  onComplete={handleLoadingDone}
                />
              )}

              {scene === 'prank' && (
                <PrankPlayerScene
                  config={SURPRISE_CONFIG}
                  globalMuted={globalMuted}
                  onAudioPulse={setAudioPulse}
                  onFinished={handlePrankFinished}
                />
              )}

              {scene === 'apology' && (
                <ApologyTransitionScene
                  config={SURPRISE_CONFIG}
                  onContinue={handleApologyContinue}
                />
              )}

              {scene === 'letter' && (
                <LetterScene
                  config={SURPRISE_CONFIG}
                  onOpenEnvelopeSound={handleOpenEnvelopeSound}
                  onContinue={handleLetterContinue}
                />
              )}

              {scene === 'contract' && (
                <BarbieContractScene
                  config={SURPRISE_CONFIG}
                  onAcceptAndPlay={handleAcceptContract}
                />
              )}

              {scene === 'game' && (
                <TeddyGameScene
                  config={SURPRISE_CONFIG}
                  globalMuted={globalMuted}
                  autostart={autostartGame}
                  onWin={handleGameWin}
                />
              )}

              {scene === 'victory' && (
                <VictoryScene
                  config={SURPRISE_CONFIG}
                  globalMuted={globalMuted}
                  onClaimCertificate={handleClaimCertificate}
                />
              )}

              {scene === 'certificate' && (
                <CertificateScene
                  config={SURPRISE_CONFIG}
                  onReplay={handleReplay}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </MotionConfig>
  );
}
