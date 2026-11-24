import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  FastForward,
  Music,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { SurpriseConfig } from '../../config/personalization';
import {
  clampPositionToBounds,
  computeSafeEscapePosition,
  type Point2D,
} from '../../utils/escapeButton';
import { FallbackConcertSynth, playDodgeBoing } from '../../utils/soundFx';
import { CoquetteBowIcon } from '../CoquetteIcons';

interface PrankPlayerSceneProps {
  config: SurpriseConfig;
  globalMuted: boolean;
  onAudioPulse: (level: number) => void;
  onFinished: () => void;
}

function formatTime(sec: number): string {
  const safe = Math.max(0, Math.floor(sec));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export function PrankPlayerScene({
  config,
  globalMuted,
  onAudioPulse,
  onFinished,
}: PrankPlayerSceneProps) {
  const reducedMotion = useReducedMotion();

  // Audio playback state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackRef = useRef<FallbackConcertSynth | null>(null);
  const finishedOnceRef = useRef(false);

  const [usingFallback, setUsingFallback] = useState(false);
  const [needsTapToPlay, setNeedsTapToPlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(config.fallbackTrackDurationSec);
  const [volume, setVolume] = useState(0.8);
  const [localMuted, setLocalMuted] = useState(globalMuted);
  const [waveHeights, setWaveHeights] = useState<number[]>([
    26, 44, 62, 36, 70, 50, 32, 60, 42, 28,
  ]);
  const [albumImgFailed, setAlbumImgFailed] = useState(false);

  // Rotating funny playback messages
  const [captionIndex, setCaptionIndex] = useState(0);

  // Escaping pause button state
  const arenaRef = useRef<HTMLDivElement | null>(null);
  const pauseBtnRef = useRef<HTMLButtonElement | null>(null);
  const [pausePos, setPausePos] = useState<Point2D>({ x: 16, y: 18 });
  const [dodgeCount, setDodgeCount] = useState(0);
  const [dodgeMessage, setDodgeMessage] = useState<string>('');
  const lastDodgeTimeRef = useRef(0);

  const effectiveMuted = globalMuted || localMuted;

  const stopAllAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (fallbackRef.current) {
      fallbackRef.current.stop();
    }
    onAudioPulse(0);
  }, [onAudioPulse]);

  const completeScene = useCallback(() => {
    if (finishedOnceRef.current) return;
    finishedOnceRef.current = true;
    stopAllAudio();
    onFinished();
  }, [onFinished, stopAllAudio]);

  const startFallbackTrack = useCallback(() => {
    if (finishedOnceRef.current) return;
    setUsingFallback(true);
    setNeedsTapToPlay(false);
    setDuration(config.fallbackTrackDurationSec);
    setIsPlaying(true);

    if (fallbackRef.current) {
      fallbackRef.current.stop();
    }

    const synth = new FallbackConcertSynth(
      config.fallbackTrackDurationSec,
      (t, intensity) => {
        setCurrentTime(t);
        onAudioPulse(intensity);
        setWaveHeights((prev) =>
          prev.map((_, idx) => {
            const wave = Math.sin(t * 7.5 + idx * 0.85) * 0.5 + 0.5;
            return Math.round(18 + wave * intensity * 74);
          })
        );
      },
      () => {
        completeScene();
      }
    );
    synth.setVolume(volume);
    synth.setMuted(effectiveMuted);
    fallbackRef.current = synth;
    synth.start();
  }, [
    completeScene,
    config.fallbackTrackDurationSec,
    effectiveMuted,
    onAudioPulse,
    volume,
  ]);

  // Initialize HTML5 Audio once when Scene Two mounts (audio starts ONLY after Entrance click)
  useEffect(() => {
    finishedOnceRef.current = false;
    const audio = new Audio(config.audioFilePath);
    audio.preload = 'auto';
    audio.loop = false;
    audio.volume = volume;
    audio.muted = effectiveMuted;
    audioRef.current = audio;

    let fellBack = false;

    const handleLoadedMetadata = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      const t = audio.currentTime;
      const pulse = audio.muted ? 0.12 : 0.35 + 0.5 * Math.abs(Math.sin(t * 6.2));
      onAudioPulse(pulse);
      setWaveHeights((prev) =>
        prev.map((_, idx) => {
          const wave = Math.sin(t * 8 + idx * 0.9) * 0.5 + 0.5;
          return Math.round(16 + wave * pulse * 78);
        })
      );
    };

    const handleEnded = () => {
      completeScene();
    };

    const handleError = () => {
      if (fellBack || finishedOnceRef.current) return;
      fellBack = true;
      startFallbackTrack();
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Attempt playback (user already interacted with Entrance CTA)
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (!fellBack) {
            setIsPlaying(true);
            setNeedsTapToPlay(false);
          }
        })
        .catch((err) => {
          if (fellBack || finishedOnceRef.current) return;
          // If the source file is missing (NotSupportedError) fall back gracefully;
          // if browser blocked autoplay (NotAllowedError), show a clean tap-to-start button.
          if (err && err.name === 'NotAllowedError') {
            setNeedsTapToPlay(true);
          } else {
            fellBack = true;
            startFallbackTrack();
          }
        });
    }

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      stopAllAudio();
    };
    // Mount-only playback lifecycle so audio plays strictly once without restarting on volume changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.audioFilePath]);

  // Keep volume & mute synchronized without interrupting playback
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = effectiveMuted;
    }
    if (fallbackRef.current) {
      fallbackRef.current.setVolume(volume);
      fallbackRef.current.setMuted(effectiveMuted);
    }
  }, [volume, effectiveMuted]);

  // Rotate funny concert messages during playback
  useEffect(() => {
    const id = window.setInterval(() => {
      setCaptionIndex((prev) => (prev + 1) % config.prank.playbackMessages.length);
    }, 3600);
    return () => window.clearInterval(id);
  }, [config.prank.playbackMessages.length]);

  // Center pause button initially inside arena & keep clamped on resize
  useEffect(() => {
    const syncBounds = (centerInitially: boolean) => {
      const arena = arenaRef.current;
      const btn = pauseBtnRef.current;
      if (!arena || !btn) return;

      const container = { width: arena.clientWidth, height: arena.clientHeight };
      const button = { width: btn.offsetWidth || 124, height: btn.offsetHeight || 44 };

      setPausePos((prev) => {
        if (centerInitially) {
          return clampPositionToBounds(
            {
              x: Math.round((container.width - button.width) / 2),
              y: Math.round((container.height - button.height) / 2),
            },
            container,
            button,
            10
          );
        }
        return clampPositionToBounds(prev, container, button, 10);
      });
    };

    syncBounds(true);
    const onResize = () => syncBounds(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const triggerPauseEscape = useCallback(
    (clientX?: number, clientY?: number) => {
      const now = performance.now();
      // Gentle debounce so touchstart + click doesn't double-jump instantaneously
      if (now - lastDodgeTimeRef.current < 150) return;
      lastDodgeTimeRef.current = now;

      const arena = arenaRef.current;
      const btn = pauseBtnRef.current;
      if (!arena || !btn) return;

      const rect = arena.getBoundingClientRect();
      const pointer =
        clientX !== undefined && clientY !== undefined
          ? { x: clientX - rect.left, y: clientY - rect.top }
          : undefined;

      const nextPos = computeSafeEscapePosition({
        container: { width: arena.clientWidth, height: arena.clientHeight },
        button: { width: btn.offsetWidth || 124, height: btn.offsetHeight || 44 },
        current: pausePos,
        pointer,
        padding: 10,
      });

      setPausePos(nextPos);
      setDodgeCount((prev) => {
        const nextCount = prev + 1;
        const msg =
          config.prank.escapeMessages[
            (nextCount - 1) % config.prank.escapeMessages.length
          ];
        setDodgeMessage(msg);
        return nextCount;
      });
      playDodgeBoing(effectiveMuted);
    },
    [config.prank.escapeMessages, effectiveMuted, pausePos]
  );

  const handleManualStart = () => {
    if (audioRef.current && !usingFallback) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setNeedsTapToPlay(false);
        })
        .catch(() => {
          startFallbackTrack();
        });
    } else {
      startFallbackTrack();
    }
  };

  const progressPct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <section
      aria-label="The World Famous Singer musical player"
      className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col items-center justify-center px-4 pt-16 pb-10 sm:px-6 sm:py-14"
    >
      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="stationery-card relative w-full overflow-hidden rounded-[2rem] p-5 sm:p-8"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <CoquetteBowIcon className="mb-2 h-8 w-12 sm:h-9 sm:w-14" />
          <h1 className="font-display text-xl font-bold leading-tight text-[#70445C] sm:text-3xl lg:text-4xl">
            {config.prank.heading}
          </h1>
          <p className="mt-1.5 max-w-lg text-xs text-[#8E6279] sm:text-base">
            {config.prank.subtitle}
          </p>
        </div>

        {/* Player Core: Album Art + Track Meta + Equalizer */}
        <div className="mt-5 grid grid-cols-1 items-center gap-4 rounded-[1.5rem] bg-[#FFF5F9] p-4 border border-[#F8C8DC]/85 sm:mt-6 sm:grid-cols-12 sm:gap-6 sm:p-6">
          <div className="flex justify-center sm:col-span-4">
            <motion.div
              animate={
                isPlaying && !reducedMotion
                  ? { scale: [1, 1.03, 1], rotate: [-1.5, 1.5, -1.5] }
                  : undefined
              }
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="relative aspect-square w-24 overflow-hidden rounded-[1.15rem] border border-[#F4B9D4] bg-white shadow-sm sm:w-36"
            >
              {!albumImgFailed ? (
                <img
                  src={config.prank.albumCover}
                  alt="Vintage pink concert microphone tied with a satin ribbon bow"
                  referrerPolicy="no-referrer"
                  onError={() => setAlbumImgFailed(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#FFF0F5] text-[#D94F91]">
                  <Music className="h-12 w-12" />
                </div>
              )}
            </motion.div>
          </div>

          <div className="flex flex-col sm:col-span-8">
            <div className="text-center sm:text-left">
              <p className="font-display text-lg font-semibold text-[#70445C] sm:text-xl">
                {config.audioTrackTitle}
              </p>
              <p className="mt-0.5 text-sm text-[#9B6B84]">
                {config.audioTrackArtist} · {config.sisterNickname}
              </p>
            </div>

            {/* Animated Sound-Wave Visualization */}
            <div
              className="mt-5 flex h-12 items-end justify-center gap-1.5 sm:justify-start"
              aria-hidden="true"
            >
              {waveHeights.map((h, i) => (
                <span
                  key={i}
                  className="w-2 rounded-full bg-gradient-to-t from-[#D94F91] to-[#FF8FBD] transition-all duration-150 ease-out"
                  style={{
                    height: `${isPlaying && !effectiveMuted ? Math.max(18, h) : 18}%`,
                  }}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div
                className="h-2.5 w-full overflow-hidden rounded-full bg-[#F8C8DC]/75"
                role="progressbar"
                aria-label="Song playback progress"
                aria-valuenow={Math.round(progressPct)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FF8FBD] to-[#D94F91] transition-all duration-150"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="mt-1.5 flex items-center justify-between text-xs font-medium text-[#8E6279] tabular-nums">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Rotating funny commentary */}
            <div className="mt-3 min-h-[1.75rem] text-center sm:text-left">
              <AnimatePresence mode="wait">
                <motion.p
                  key={captionIndex}
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="text-sm font-medium italic text-[#B53574]"
                >
                  “{config.prank.playbackMessages[captionIndex]}”
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Tap to start audio fallback if browser blocked playback */}
        {needsTapToPlay && (
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={handleManualStart}
              className="ribbon-cta inline-flex min-h-[46px] items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold cursor-pointer"
            >
              <Play className="h-4 w-4" />
              <span>Start the Concert 🎤</span>
            </button>
          </div>
        )}

        {/* Bounded Escaping Pause Button Playground */}
        <div className="mt-5">
          <div className="mb-2 flex min-h-[1.75rem] flex-wrap items-center justify-between gap-2 text-xs text-[#8E6279]">
            <span>Try pausing it if you dare...</span>
            {dodgeMessage && (
              <span
                key={dodgeCount}
                className="text-sm font-bold text-[#D94F91]"
                role="status"
                aria-live="polite"
              >
                {dodgeMessage}
              </span>
            )}
          </div>

          <div
            ref={arenaRef}
            data-testid="escape-pause-arena"
            className="relative h-24 w-full overflow-hidden rounded-[1.25rem] border border-dashed border-[#F2A8C9] bg-[#FFF9FC] sm:h-28"
          >
            <button
              ref={pauseBtnRef}
              type="button"
              data-testid="escaping-pause-button"
              aria-label="Pause concert (escapes playfully)"
              onMouseEnter={(e) => triggerPauseEscape(e.clientX, e.clientY)}
              onTouchStart={(e) => {
                const touch = e.touches[0];
                triggerPauseEscape(touch?.clientX, touch?.clientY);
              }}
              onClick={(e) => triggerPauseEscape(e.clientX, e.clientY)}
              style={{
                transform: `translate3d(${pausePos.x}px, ${pausePos.y}px, 0)`,
              }}
              className="absolute top-0 left-0 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#D94F91] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-transform duration-150 ease-out cursor-pointer whitespace-nowrap"
            >
              <Pause className="h-4 w-4" />
              <span>Pause</span>
            </button>
          </div>
        </div>

        {/* Accessible Volume, Mute, and Explicit Skip Controls */}
        <div className="mt-5 flex flex-col gap-3 border-t border-[#F8C8DC]/75 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLocalMuted((m) => !m)}
              aria-label={effectiveMuted ? 'Unmute concert audio' : 'Mute concert audio'}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF0F5] text-[#70445C] border border-[#F8C8DC] transition-colors hover:bg-[#F8C8DC]/45 cursor-pointer"
            >
              {effectiveMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>

            <label className="flex items-center gap-2.5 text-xs font-medium text-[#8E6279]">
              <span>Volume</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={effectiveMuted ? 0 : volume}
                aria-label="Concert audio volume"
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  if (val > 0 && localMuted) setLocalMuted(false);
                }}
                className="pink-slider w-28 sm:w-32"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={completeScene}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[#F2A8C9] bg-white px-5 py-2 text-sm font-semibold text-[#B53574] transition-colors hover:bg-[#FFF0F5] cursor-pointer whitespace-nowrap"
          >
            <span>Skip concert</span>
            <FastForward className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
