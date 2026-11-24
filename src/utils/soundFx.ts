/**
 * Synthesized Web Audio sound effects & graceful fallback concert track.
 * Everything unlocks cleanly on the first user gesture and never throws
 * on mobile Safari or restricted audio contexts.
 */

let sharedAudioCtx: AudioContext | null = null;

export function getAudioContext(allowBeforeGesture = false): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const userActivation = (
    navigator as Navigator & { userActivation?: { hasBeenActive?: boolean } }
  ).userActivation;
  if (!allowBeforeGesture && !sharedAudioCtx && userActivation && !userActivation.hasBeenActive) {
    return null;
  }
  if (!sharedAudioCtx) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return null;
    try {
      sharedAudioCtx = new AudioCtx();
    } catch {
      return null;
    }
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

export function unlockAudioOnGesture(): void {
  getAudioContext(true);
}

export function playButtonChime(muted = false): void {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(587.33, now); // D5
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.09); // A5

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.09, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.17);
}

export function playDodgeBoing(muted = false): void {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(340, now);
  osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);
  osc.frequency.exponentialRampToValueAtTime(480, now + 0.14);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.17);
}

export function playEnvelopeOpen(muted = false): void {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5];
  const now = ctx.currentTime;
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const start = now + idx * 0.07;
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.exponentialRampToValueAtTime(0.065, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.3);
  });
}

export function playCatchTeddyChime(streak = 1, muted = false): void {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const scale = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
  const baseFreq = scale[Math.min(streak - 1, scale.length - 1)] || 523.25;
  const jitter = 1 + (Math.random() - 0.5) * 0.04;
  const now = ctx.currentTime;

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'sine';
  osc2.type = 'triangle';
  osc1.frequency.setValueAtTime(baseFreq * jitter, now);
  osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.25 * jitter, now + 0.1);
  osc2.frequency.setValueAtTime(baseFreq * 1.5 * jitter, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.1, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);
  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.24);
  osc2.stop(now + 0.24);
}

export function playVictoryFanfare(muted = false): void {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const melody = [
    { freq: 523.25, t: 0, d: 0.14 },
    { freq: 659.25, t: 0.12, d: 0.14 },
    { freq: 783.99, t: 0.24, d: 0.14 },
    { freq: 1046.5, t: 0.36, d: 0.42 },
    { freq: 880.0, t: 0.52, d: 0.16 },
    { freq: 1046.5, t: 0.68, d: 0.52 },
  ];

  const now = ctx.currentTime;
  melody.forEach((n) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(n.freq, now + n.t);

    gain.gain.setValueAtTime(0.001, now + n.t);
    gain.gain.exponentialRampToValueAtTime(0.11, now + n.t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + n.t);
    osc.stop(now + n.t + n.d + 0.02);
  });
}

/**
 * Playful music-box karaoke backing loop used ONLY if /public/audio/sister-song.mp3
 * is not provided yet, so the scene plays, animates, supports volume/mute, and
 * fires onEnded accurately when its duration completes.
 */
export class FallbackConcertSynth {
  private timerId: number | null = null;
  private startMs = 0;
  private stepIdx = 0;
  private volume = 0.75;
  private muted = false;
  private durationSec: number;
  private onTick: (currentTime: number, intensity: number) => void;
  private onEnded: () => void;
  private stopped = false;

  private readonly notes = [
    523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880.0, 698.46,
    659.25, 783.99, 987.77, 783.99, 659.25, 587.33, 523.25, 659.25,
  ];

  constructor(
    durationSec: number,
    onTick: (currentTime: number, intensity: number) => void,
    onEnded: () => void
  ) {
    this.durationSec = Math.max(8, durationSec);
    this.onTick = onTick;
    this.onEnded = onEnded;
  }

  public setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
  }

  public setMuted(m: boolean): void {
    this.muted = m;
  }

  public start(): void {
    this.stop();
    this.stopped = false;
    this.startMs = performance.now();
    this.stepIdx = 0;

    const tick = () => {
      if (this.stopped) return;
      const elapsedSec = (performance.now() - this.startMs) / 1000;
      if (elapsedSec >= this.durationSec) {
        this.onTick(this.durationSec, 0);
        this.stop();
        this.onEnded();
        return;
      }

      const beatPulse = this.muted
        ? 0.15
        : 0.4 + 0.55 * Math.abs(Math.sin(elapsedSec * 5.2));
      this.onTick(elapsedSec, beatPulse);

      const expectedStep = Math.floor(elapsedSec / 0.38);
      if (expectedStep >= this.stepIdx) {
        this.stepIdx = expectedStep + 1;
        this.playNote(this.notes[expectedStep % this.notes.length]);
      }

      this.timerId = window.setTimeout(tick, 90);
    };

    tick();
  }

  private playNote(freq: number): void {
    if (this.muted || this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    const peak = 0.065 * this.volume;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.36);
  }

  public stop(): void {
    this.stopped = true;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
