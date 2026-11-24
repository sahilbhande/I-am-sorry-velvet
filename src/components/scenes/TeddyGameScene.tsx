import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import type { SurpriseConfig } from '../../config/personalization';
import {
  createInitialGameState,
  resizeGameState,
  setBasketTarget,
  stepGameState,
  type FallingBear,
  type GamePhase,
  type TeddyGameState,
} from '../../game/teddyEngine';
import { playCatchTeddyChime } from '../../utils/soundFx';
import { TeddyEmblemIcon } from '../CoquetteIcons';

interface TeddyGameSceneProps {
  config: SurpriseConfig;
  globalMuted: boolean;
  autostart?: boolean;
  onWin: (finalTimeLeft: number) => void;
}

const BEAR_PALETTES: Record<
  FallingBear['variant'],
  { fur: string; ear: string; snout: string; bow: string }
> = {
  cream: { fur: '#F3D9BF', ear: '#F8C8DC', snout: '#FFF7F0', bow: '#FF8FBD' },
  blush: { fur: '#F9D6E3', ear: '#FFF0F5', snout: '#FFFBFD', bow: '#D94F91' },
  lavender: { fur: '#E8DCF7', ear: '#F8C8DC', snout: '#FAF6FF', bow: '#D94F91' },
  golden: { fur: '#F6DFB8', ear: '#FFD4E5', snout: '#FFFBF2', bow: '#E25B9D' },
};

function drawCanvasTeddy(ctx: CanvasRenderingContext2D, bear: FallingBear) {
  const palette = BEAR_PALETTES[bear.variant];
  const r = bear.radius;

  ctx.save();
  ctx.translate(bear.x, bear.y);
  ctx.rotate(bear.rotation);

  // Soft drop shadow
  ctx.fillStyle = 'rgba(181, 53, 116, 0.14)';
  ctx.beginPath();
  ctx.ellipse(0, r * 0.92, r * 0.72, r * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  const earOffset = r * 0.64;
  [-earOffset, earOffset].forEach((ex) => {
    ctx.fillStyle = palette.fur;
    ctx.strokeStyle = '#70445C';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ex, -r * 0.62, r * 0.36, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = palette.ear;
    ctx.beginPath();
    ctx.arc(ex, -r * 0.62, r * 0.18, 0, Math.PI * 2);
    ctx.fill();
  });

  // Round Plush Head
  ctx.fillStyle = palette.fur;
  ctx.strokeStyle = '#70445C';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Snout
  ctx.fillStyle = palette.snout;
  ctx.beginPath();
  ctx.ellipse(0, r * 0.22, r * 0.36, r * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();

  // Rosy cheeks
  ctx.fillStyle = 'rgba(255, 143, 189, 0.55)';
  ctx.beginPath();
  ctx.arc(-r * 0.46, r * 0.14, r * 0.13, 0, Math.PI * 2);
  ctx.arc(r * 0.46, r * 0.14, r * 0.13, 0, Math.PI * 2);
  ctx.fill();

  // Eyes with tiny specular sparkle
  ctx.fillStyle = '#5B3449';
  [-r * 0.28, r * 0.28].forEach((ex) => {
    ctx.beginPath();
    ctx.arc(ex, -r * 0.12, r * 0.11, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(ex - r * 0.03, -r * 0.15, r * 0.038, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5B3449';
  });

  // Nose & smile
  ctx.fillStyle = '#70445C';
  ctx.beginPath();
  ctx.ellipse(0, r * 0.12, r * 0.13, r * 0.09, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#70445C';
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(0, r * 0.2, r * 0.16, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();

  // Cute pink satin bow at chin
  ctx.fillStyle = palette.bow;
  ctx.beginPath();
  ctx.ellipse(-r * 0.24, r * 0.78, r * 0.22, r * 0.13, -0.2, 0, Math.PI * 2);
  ctx.ellipse(r * 0.24, r * 0.78, r * 0.22, r * 0.13, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#B53574';
  ctx.beginPath();
  ctx.arc(0, r * 0.78, r * 0.09, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawBasket(ctx: CanvasRenderingContext2D, state: TeddyGameState) {
  const bx = state.basketX;
  const by = state.height - state.basketHeight / 2 - 22;
  const w = state.basketWidth;
  const h = state.basketHeight;

  ctx.save();
  ctx.translate(bx, by);
  ctx.scale(state.basketScaleX, state.basketScaleY);

  // Soft ground shadow
  ctx.fillStyle = 'rgba(181, 53, 116, 0.16)';
  ctx.beginPath();
  ctx.ellipse(0, h * 0.56, w * 0.44, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Basket handle arch
  ctx.strokeStyle = '#D94F91';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, -h * 0.2, w * 0.36, Math.PI, 0);
  ctx.stroke();

  // Scalloped woven pink basket body (trapezoid with rounded bottom)
  ctx.fillStyle = '#FF9EC7';
  ctx.strokeStyle = '#C73E80';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(-w * 0.48, -h * 0.22);
  ctx.lineTo(w * 0.48, -h * 0.22);
  ctx.lineTo(w * 0.36, h * 0.42);
  ctx.quadraticCurveTo(0, h * 0.54, -w * 0.36, h * 0.42);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Delicate lattice criss-cross lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.lineWidth = 1.6;
  for (let i = -2; i <= 2; i++) {
    const xTop = i * (w * 0.16);
    ctx.beginPath();
    ctx.moveTo(xTop, -h * 0.18);
    ctx.lineTo(xTop * 0.78, h * 0.42);
    ctx.stroke();
  }

  // Cream lace rim
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#E26A9E';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-w * 0.52, -h * 0.34, w * 1.04, 15, 8);
  ctx.fill();
  ctx.stroke();

  // Cute bow on front of basket
  ctx.fillStyle = '#D94F91';
  ctx.beginPath();
  ctx.ellipse(-11, 2, 10, 6.5, -0.2, 0, Math.PI * 2);
  ctx.ellipse(11, 2, 10, 6.5, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFF0F5';
  ctx.beginPath();
  ctx.arc(0, 2, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawCanvasScene(ctx: CanvasRenderingContext2D, state: TeddyGameState) {
  const { width, height } = state;

  // Soft pastel blush sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#FFF8FB');
  grad.addColorStop(0.55, '#FFF0F6');
  grad.addColorStop(1, '#FDE3EE');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Subtle decorative pastel clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
  const cloudDrift = (state.elapsed * 8) % (width + 120);
  const drawCloud = (cx: number, cy: number, s: number) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 20 * s, 0, Math.PI * 2);
    ctx.arc(cx + 18 * s, cy - 6 * s, 24 * s, 0, Math.PI * 2);
    ctx.arc(cx + 38 * s, cy, 18 * s, 0, Math.PI * 2);
    ctx.fill();
  };
  drawCloud((cloudDrift % (width + 80)) - 40, 58, 0.85);
  drawCloud(((cloudDrift + width * 0.52) % (width + 80)) - 40, 108, 0.7);

  // Subtle scalloped floor ribbon line
  ctx.fillStyle = 'rgba(248, 200, 220, 0.45)';
  ctx.fillRect(0, height - 18, width, 18);

  // Draw falling teddy bears
  for (let i = 0; i < state.bears.length; i++) {
    drawCanvasTeddy(ctx, state.bears[i]);
  }

  // Draw pink basket
  drawBasket(ctx, state);

  // Draw pooled particles (hearts, sparkles, dots)
  for (let i = 0; i < state.particles.length; i++) {
    const p = state.particles[i];
    if (!p.active) continue;
    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(p.x, p.y);
    ctx.fillStyle = p.color;

    if (p.kind === 'heart') {
      const s = p.size * 0.6;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(-s, -s * 0.4, -s * 1.1, s * 0.6, 0, s * 1.25);
      ctx.bezierCurveTo(s * 1.1, s * 0.6, s, -s * 0.4, 0, s * 0.3);
      ctx.fill();
    } else if (p.kind === 'sparkle') {
      const s = p.size * 0.65;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(s * 0.32, -s * 0.32);
      ctx.lineTo(s, 0);
      ctx.lineTo(s * 0.32, s * 0.32);
      ctx.lineTo(0, s);
      ctx.lineTo(-s * 0.32, s * 0.32);
      ctx.lineTo(-s, 0);
      ctx.lineTo(-s * 0.32, -s * 0.32);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.38, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Draw floating "+1" score pops
  for (let i = 0; i < state.scorePops.length; i++) {
    const pop = state.scorePops[i];
    if (!pop.active) continue;
    const alpha = Math.max(0, pop.life / pop.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = '700 18px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#D94F91';
    ctx.fillText(pop.text, pop.x, pop.y);
    ctx.restore();
  }
}

export function TeddyGameScene({
  config,
  globalMuted,
  autostart = false,
  onWin,
}: TeddyGameSceneProps) {
  const reducedMotion = useReducedMotion();

  const canvasWrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<TeddyGameState>(
    createInitialGameState(
      520,
      460,
      config.gameWinningScore,
      config.gameDurationSeconds,
      autostart ? 'playing' : 'ready'
    )
  );
  const keysRef = useRef<Set<string>>(new Set());
  const mutedRef = useRef(globalMuted);
  const onWinRef = useRef(onWin);
  const winTimeoutRef = useRef<number | null>(null);

  mutedRef.current = globalMuted;
  onWinRef.current = onWin;

  // Discrete React HUD state (only updated when integer score, integer second, or phase changes)
  const [hudScore, setHudScore] = useState(0);
  const [hudTime, setHudTime] = useState(config.gameDurationSeconds);
  const [phase, setPhase] = useState<GamePhase>(autostart ? 'playing' : 'ready');

  const syncBodyState = useCallback((p: GamePhase) => {
    if (typeof document === 'undefined') return;
    if (p === 'ready') document.body.dataset.state = 'title';
    else if (p === 'playing') document.body.dataset.state = 'playing';
    else if (p === 'paused') document.body.dataset.state = 'paused';
    else document.body.dataset.state = 'gameover';
  }, []);

  useEffect(() => {
    syncBodyState(phase);
    return () => {
      if (typeof document !== 'undefined') {
        delete document.body.dataset.state;
      }
    };
  }, [phase, syncBodyState]);

  const startOrRestartGame = useCallback(() => {
    if (winTimeoutRef.current !== null) {
      window.clearTimeout(winTimeoutRef.current);
      winTimeoutRef.current = null;
    }
    const wrap = canvasWrapRef.current;
    const w = wrap ? wrap.clientWidth : stateRef.current.width;
    const h = wrap ? wrap.clientHeight : stateRef.current.height;
    keysRef.current.clear();

    stateRef.current = createInitialGameState(
      w,
      h,
      config.gameWinningScore,
      config.gameDurationSeconds,
      'playing'
    );
    setHudScore(0);
    setHudTime(config.gameDurationSeconds);
    setPhase('playing');
    syncBodyState('playing');
  }, [config.gameDurationSeconds, config.gameWinningScore, syncBodyState]);

  const togglePause = useCallback(() => {
    const curr = stateRef.current.phase;
    if (curr === 'playing') {
      stateRef.current.phase = 'paused';
      keysRef.current.clear();
      setPhase('paused');
    } else if (curr === 'paused') {
      stateRef.current.phase = 'playing';
      setPhase('playing');
    }
  }, []);

  // ResizeObserver for crisp high-DPI canvas projection
  useEffect(() => {
    const wrap = canvasWrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const updateCanvasSize = () => {
      const rect = wrap.getBoundingClientRect();
      const cssW = Math.max(280, Math.round(rect.width));
      const cssH = Math.max(360, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resizeGameState(stateRef.current, cssW, cssH);
    };

    updateCanvasSize();
    const ro = new ResizeObserver(updateCanvasSize);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  // Keyboard controls + focus-loss key cleanup
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (
        key === 'ArrowLeft' ||
        key === 'ArrowRight' ||
        key === 'a' ||
        key === 'A' ||
        key === 'd' ||
        key === 'D'
      ) {
        keysRef.current.add(key);
        if (stateRef.current.phase === 'playing') {
          e.preventDefault();
        }
      } else if ((key === 'Enter' || key === ' ') && stateRef.current.phase === 'ready') {
        e.preventDefault();
        startOrRestartGame();
      } else if (key === 'Escape' || key === 'p' || key === 'P') {
        if (stateRef.current.phase === 'playing' || stateRef.current.phase === 'paused') {
          e.preventDefault();
          togglePause();
        }
      } else if ((key === 'r' || key === 'R') && stateRef.current.phase !== 'ready') {
        e.preventDefault();
        startOrRestartGame();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };

    const clearHeld = () => {
      keysRef.current.clear();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', clearHeld);
    document.addEventListener('visibilitychange', clearHeld);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clearHeld);
      document.removeEventListener('visibilitychange', clearHeld);
    };
  }, [startOrRestartGame, togglePause]);

  // Isolated 60fps requestAnimationFrame simulation & Canvas2D render loop
  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();
    let prevScore = stateRef.current.score;
    let prevTimeInt = Math.ceil(stateRef.current.timeRemaining);

    const frame = (now: number) => {
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;

      const state = stateRef.current;
      const keys = keysRef.current;
      const left = keys.has('ArrowLeft') || keys.has('a') || keys.has('A');
      const right = keys.has('ArrowRight') || keys.has('d') || keys.has('D');
      const dir: -1 | 0 | 1 = left && !right ? -1 : right && !left ? 1 : 0;

      const result = stepGameState(state, rawDt, dir);

      if (result.caughtCount > 0) {
        playCatchTeddyChime(state.streak, mutedRef.current);
      }

      if (state.score !== prevScore) {
        prevScore = state.score;
        setHudScore(state.score);
      }

      const timeInt = Math.ceil(state.timeRemaining);
      if (timeInt !== prevTimeInt) {
        prevTimeInt = timeInt;
        setHudTime(timeInt);
      }

      if (result.wonJustNow) {
        setPhase('victory');
        const remaining = Math.ceil(state.timeRemaining);
        winTimeoutRef.current = window.setTimeout(() => {
          onWinRef.current(remaining);
        }, 420);
      } else if (result.timedOutJustNow) {
        setPhase('timeout');
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        drawCanvasScene(ctx, state);
      }

      rafId = window.requestAnimationFrame(frame);
    };

    rafId = window.requestAnimationFrame(frame);
    return () => {
      window.cancelAnimationFrame(rafId);
      if (winTimeoutRef.current !== null) {
        window.clearTimeout(winTimeoutRef.current);
      }
    };
  }, []);

  const handlePointerMove = (clientX: number) => {
    if (stateRef.current.phase !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setBasketTarget(stateRef.current, clientX - rect.left);
  };

  return (
    <section
      aria-label="Catch the Teddy Bears mini-game"
      className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col items-center justify-center px-4 py-12 sm:px-6"
    >
      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="stationery-card w-full overflow-hidden rounded-[2rem] p-4 sm:p-7"
      >
        {/* Top Game Header & Live HUD */}
        <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#70445C] sm:text-3xl">
              {config.game.title}
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-[#8E6279] sm:text-sm">
              {config.game.intro}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <div className="flex items-center gap-4 text-sm font-semibold text-[#70445C] tabular-nums">
              <div
                aria-label={`Teddy bears caught: ${hudScore} of ${config.gameWinningScore}`}
                data-testid="teddy-score-display"
              >
                <span className="text-xs font-medium text-[#9C7087] block">
                  Caught
                </span>
                <span className="font-display text-xl font-bold text-[#D94F91] whitespace-nowrap">
                  {hudScore} / {config.gameWinningScore}
                </span>
              </div>

              <div
                className="h-8 w-px bg-[#F8C8DC]"
                aria-hidden="true"
              />

              <div aria-label={`Time left: ${hudTime} seconds`}>
                <span className="text-xs font-medium text-[#9C7087] block">
                  Time
                </span>
                <span className="font-display text-xl font-bold text-[#70445C]">
                  {hudTime}s
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {(phase === 'playing' || phase === 'paused') && (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.currentTarget.blur();
                    togglePause();
                  }}
                  aria-label={phase === 'paused' ? 'Resume game' : 'Pause game'}
                  title={phase === 'paused' ? 'Resume (P)' : 'Pause (P)'}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#F8C8DC] bg-[#FFF0F5] text-[#70445C] transition-colors hover:bg-[#F8C8DC]/50 cursor-pointer"
                >
                  {phase === 'paused' ? (
                    <Play className="h-4 w-4" />
                  ) : (
                    <Pause className="h-4 w-4" />
                  )}
                </button>
              )}

              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  startOrRestartGame();
                }}
                aria-label="Restart teddy bear game"
                title="Restart (R)"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#F8C8DC] bg-[#FFF0F5] text-[#70445C] transition-colors hover:bg-[#F8C8DC]/50 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dedicated 2D Canvas Stage (zero backdrop-blur over live canvas) */}
        <div
          ref={canvasWrapRef}
          className="relative h-[420px] w-full overflow-hidden rounded-[1.5rem] border-2 border-[#F4B9D4] bg-[#FFF6FA] select-none touch-none sm:h-[460px]"
        >
          <canvas
            ref={canvasRef}
            data-testid="teddy-game-canvas"
            onPointerMove={(e) => handlePointerMove(e.clientX)}
            onPointerDown={(e) => handlePointerMove(e.clientX)}
            onTouchMove={(e) => {
              if (e.touches[0]) handlePointerMove(e.touches[0].clientX);
            }}
            onTouchStart={(e) => {
              if (e.touches[0]) handlePointerMove(e.touches[0].clientX);
            }}
            className="block h-full w-full cursor-ew-resize"
          />

          {/* Ready Start Overlay */}
          {phase === 'ready' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FFF0F5]/92 p-6 text-center">
              <TeddyEmblemIcon className="mb-3 h-16 w-16" />
              <h2 className="font-display text-2xl font-bold text-[#70445C]">
                Ready to catch {config.gameWinningScore} teddy bears?
              </h2>
              <p className="mt-2 max-w-sm text-sm text-[#8E6279]">
                Slide your finger or move your mouse (or use Arrow / A &amp; D keys)
                to move your pink basket. You have {config.gameDurationSeconds}{' '}
                seconds!
              </p>
              <button
                type="button"
                data-start="true"
                onClick={(e) => {
                  e.currentTarget.blur();
                  startOrRestartGame();
                }}
                className="ribbon-cta mt-6 inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full px-8 py-3 text-base font-semibold cursor-pointer"
              >
                <span>Start Catching 🧸</span>
              </button>
            </div>
          )}

          {/* Paused Overlay */}
          {phase === 'paused' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FFF0F5]/92 p-6 text-center">
              <h2 className="font-display text-2xl font-bold text-[#70445C]">
                Quick breather 🎀
              </h2>
              <p className="mt-1 text-sm text-[#8E6279] tabular-nums">
                {hudScore} of {config.gameWinningScore} teddy bears caught ·{' '}
                {hudTime}s left
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    togglePause();
                  }}
                  className="ribbon-cta inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full px-7 py-2.5 text-sm font-semibold cursor-pointer"
                >
                  <Play className="h-4 w-4" />
                  <span>Resume</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    startOrRestartGame();
                  }}
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-[#F2A8C9] bg-white px-6 py-2.5 text-sm font-semibold text-[#B53574] cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Restart</span>
                </button>
              </div>
            </div>
          )}

          {/* Timeout Retry Overlay */}
          {phase === 'timeout' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FFF0F5]/94 p-6 text-center">
              <TeddyEmblemIcon className="mb-3 h-14 w-14" />
              <h2 className="font-display text-2xl font-bold text-[#70445C]">
                So close, princess!
              </h2>
              <p className="mt-2 max-w-sm text-sm text-[#8E6279] tabular-nums">
                You caught {hudScore} of {config.gameWinningScore} teddy bears. Your
                Barbie contract is still waiting — try again!
              </p>
              <button
                type="button"
                data-start="true"
                onClick={(e) => {
                  e.currentTarget.blur();
                  startOrRestartGame();
                }}
                className="ribbon-cta mt-6 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-8 py-3 text-base font-semibold cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Try Again 🧸</span>
              </button>
            </div>
          )}
        </div>

        {/* Clean single-line control hint */}
        <p className="mt-3 text-center text-xs text-[#9C7087]">
          Slide finger or move mouse to steer · Arrow / A–D keys supported · P Pause · R Restart
        </p>
      </motion.div>
    </section>
  );
}
