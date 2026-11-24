export type GamePhase = 'ready' | 'playing' | 'paused' | 'victory' | 'timeout';

export interface FallingBear {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  rotationSpeed: number;
  variant: 'cream' | 'blush' | 'lavender' | 'golden';
  wobblePhase: number;
}

export interface CatchParticle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  kind: 'heart' | 'sparkle' | 'dot';
  color: string;
}

export interface FloatingScorePop {
  active: boolean;
  x: number;
  y: number;
  vy: number;
  life: number;
  maxLife: number;
  text: string;
}

export interface TeddyGameState {
  phase: GamePhase;
  width: number;
  height: number;
  score: number;
  targetScore: number;
  timeRemaining: number;
  durationSeconds: number;
  basketX: number;
  basketTargetX: number;
  basketWidth: number;
  basketHeight: number;
  basketScaleX: number;
  basketScaleY: number;
  bears: FallingBear[];
  nextBearId: number;
  spawnTimer: number;
  streak: number;
  particles: CatchParticle[];
  particleCursor: number;
  scorePops: FloatingScorePop[];
  popCursor: number;
  elapsed: number;
}

export interface StepResult {
  caughtCount: number;
  wonJustNow: boolean;
  timedOutJustNow: boolean;
}

const PARTICLE_POOL_SIZE = 72;
const POP_POOL_SIZE = 16;
const PARTICLE_COLORS = ['#FF8FBD', '#D94F91', '#F8C8DC', '#C9A7EB', '#FFD166'];

function createParticlePool(): CatchParticle[] {
  return Array.from({ length: PARTICLE_POOL_SIZE }, () => ({
    active: false,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    life: 0,
    maxLife: 0.6,
    size: 8,
    kind: 'heart',
    color: '#FF8FBD',
  }));
}

function createPopPool(): FloatingScorePop[] {
  return Array.from({ length: POP_POOL_SIZE }, () => ({
    active: false,
    x: 0,
    y: 0,
    vy: -55,
    life: 0,
    maxLife: 0.75,
    text: '+1 🧸',
  }));
}

export function createInitialGameState(
  width: number,
  height: number,
  targetScore = 10,
  durationSeconds = 60,
  initialPhase: GamePhase = 'playing'
): TeddyGameState {
  const safeW = Math.max(280, width);
  const safeH = Math.max(360, height);
  const basketWidth = Math.min(126, Math.max(96, Math.round(safeW * 0.27)));

  return {
    phase: initialPhase,
    width: safeW,
    height: safeH,
    score: 0,
    targetScore,
    timeRemaining: durationSeconds,
    durationSeconds,
    basketX: safeW / 2,
    basketTargetX: safeW / 2,
    basketWidth,
    basketHeight: 54,
    basketScaleX: 1,
    basketScaleY: 1,
    bears: [],
    nextBearId: 1,
    spawnTimer: 0.35, // First bear arrives promptly
    streak: 0,
    particles: createParticlePool(),
    particleCursor: 0,
    scorePops: createPopPool(),
    popCursor: 0,
    elapsed: 0,
  };
}

export function resizeGameState(
  state: TeddyGameState,
  width: number,
  height: number
): void {
  const prevW = state.width || 1;
  const safeW = Math.max(280, width);
  const safeH = Math.max(360, height);
  const ratio = safeW / prevW;

  state.width = safeW;
  state.height = safeH;
  state.basketWidth = Math.min(126, Math.max(96, Math.round(safeW * 0.27)));
  state.basketX = clampBasketX(state.basketX * ratio, state.width, state.basketWidth);
  state.basketTargetX = clampBasketX(
    state.basketTargetX * ratio,
    state.width,
    state.basketWidth
  );
}

export function clampBasketX(x: number, width: number, basketWidth: number): number {
  const half = basketWidth / 2 + 8;
  return Math.max(half, Math.min(width - half, x));
}

export function setBasketTarget(state: TeddyGameState, x: number): void {
  state.basketTargetX = clampBasketX(x, state.width, state.basketWidth);
}

export function spawnBear(state: TeddyGameState, rng: () => number = Math.random): FallingBear {
  const radius = 24;
  const margin = radius + 24;
  const usableW = Math.max(40, state.width - margin * 2);
  // Gently bias spawns toward reachable central playfield so game feels cozy & super winnable
  const rawX = margin + rng() * usableW;
  const variants: FallingBear['variant'][] = ['cream', 'blush', 'lavender', 'golden'];
  const roll = rng();
  const variant: FallingBear['variant'] =
    roll > 0.86 ? 'golden' : variants[Math.floor(rng() * 3)];

  // Gentle, cozy falling speed so catching 10 in 60s is fun and genuinely winnable
  const baseSpeed = 108 + rng() * 52;

  const bear: FallingBear = {
    id: state.nextBearId++,
    x: rawX,
    y: -radius - 10,
    vx: (rng() - 0.5) * 18,
    vy: baseSpeed,
    radius,
    rotation: (rng() - 0.5) * 0.22,
    rotationSpeed: (rng() - 0.5) * 0.7,
    variant,
    wobblePhase: rng() * Math.PI * 2,
  };

  state.bears.push(bear);
  return bear;
}

function emitCatchBurst(
  state: TeddyGameState,
  x: number,
  y: number,
  rng: () => number
): void {
  const count = 10;
  for (let i = 0; i < count; i++) {
    const p = state.particles[state.particleCursor];
    state.particleCursor = (state.particleCursor + 1) % state.particles.length;

    const angle = -Math.PI + (i / (count - 1)) * Math.PI + (rng() - 0.5) * 0.45;
    const speed = 75 + rng() * 115;

    p.active = true;
    p.x = x + (rng() - 0.5) * 18;
    p.y = y - 8;
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed - 45;
    p.maxLife = 0.5 + rng() * 0.35;
    p.life = p.maxLife;
    p.size = 6 + rng() * 6;
    p.kind = i % 3 === 0 ? 'heart' : i % 3 === 1 ? 'sparkle' : 'dot';
    p.color = PARTICLE_COLORS[i % PARTICLE_COLORS.length];
  }

  const pop = state.scorePops[state.popCursor];
  state.popCursor = (state.popCursor + 1) % state.scorePops.length;
  pop.active = true;
  pop.x = x;
  pop.y = y - 28;
  pop.vy = -58;
  pop.maxLife = 0.75;
  pop.life = pop.maxLife;
  pop.text = state.streak >= 3 ? '+1 ♡' : '+1 🧸';
}

export function stepGameState(
  state: TeddyGameState,
  rawDt: number,
  keyboardDirection: -1 | 0 | 1 = 0,
  rng: () => number = Math.random
): StepResult {
  const dt = Math.min(Math.max(rawDt, 0), 0.05);

  if (state.phase !== 'playing') {
    return { caughtCount: 0, wonJustNow: false, timedOutJustNow: false };
  }

  state.elapsed += dt;
  state.timeRemaining = Math.max(0, state.timeRemaining - dt);

  // Move basket smoothly via keyboard or pointer target
  if (keyboardDirection !== 0) {
    const keySpeed = 460;
    state.basketTargetX = clampBasketX(
      state.basketTargetX + keyboardDirection * keySpeed * dt,
      state.width,
      state.basketWidth
    );
  }

  const followLerp = 1 - Math.exp(-18 * dt);
  state.basketX += (state.basketTargetX - state.basketX) * followLerp;

  // Exponentially damp squash-and-stretch back to (1, 1)
  const damp = 1 - Math.exp(-14 * dt);
  state.basketScaleX += (1 - state.basketScaleX) * damp;
  state.basketScaleY += (1 - state.basketScaleY) * damp;

  // Spawn teddy bears at a generous, relaxed pace (~1 bear every 0.95s, max 5 onscreen)
  state.spawnTimer -= dt;
  if (state.spawnTimer <= 0 && state.bears.length < 5) {
    spawnBear(state, rng);
    state.spawnTimer = 0.85 + rng() * 0.45;
  }

  const basketY = state.height - state.basketHeight / 2 - 22;
  const catchHalfW = state.basketWidth * 0.56;
  const catchTop = basketY - state.basketHeight * 0.46;
  const catchBottom = basketY + state.basketHeight * 0.42;

  let caughtCount = 0;

  // Update bears & check catches
  for (let i = state.bears.length - 1; i >= 0; i--) {
    const bear = state.bears[i];
    bear.wobblePhase += dt * 2.8;
    bear.x += (bear.vx + Math.sin(bear.wobblePhase) * 16) * dt;
    bear.y += bear.vy * dt;
    bear.rotation += bear.rotationSpeed * dt;

    // Softly bounce off side edges
    const edgeMargin = bear.radius + 10;
    if (bear.x < edgeMargin) {
      bear.x = edgeMargin;
      bear.vx = Math.abs(bear.vx);
    } else if (bear.x > state.width - edgeMargin) {
      bear.x = state.width - edgeMargin;
      bear.vx = -Math.abs(bear.vx);
    }

    // Generous cozy catch box
    const withinX = Math.abs(bear.x - state.basketX) <= catchHalfW + bear.radius * 0.65;
    const withinY = bear.y + bear.radius * 0.6 >= catchTop && bear.y - bear.radius * 0.5 <= catchBottom;

    if (withinX && withinY) {
      state.bears.splice(i, 1);
      state.score += 1;
      state.streak += 1;
      caughtCount += 1;

      // Tactile basket squash-and-stretch
      state.basketScaleX = 1.18;
      state.basketScaleY = 0.84;
      emitCatchBurst(state, bear.x, catchTop, rng);
      continue;
    }

    // Remove bears that fell past the bottom
    if (bear.y - bear.radius > state.height + 24) {
      state.bears.splice(i, 1);
      state.streak = 0;
    }
  }

  // Update pooled particles in place (zero GC)
  for (let i = 0; i < state.particles.length; i++) {
    const p = state.particles[i];
    if (!p.active) continue;
    p.life -= dt;
    if (p.life <= 0) {
      p.active = false;
      continue;
    }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 240 * dt;
  }

  // Update pooled floating score pops
  for (let i = 0; i < state.scorePops.length; i++) {
    const pop = state.scorePops[i];
    if (!pop.active) continue;
    pop.life -= dt;
    if (pop.life <= 0) {
      pop.active = false;
      continue;
    }
    pop.y += pop.vy * dt;
  }

  let wonJustNow = false;
  let timedOutJustNow = false;

  if (state.score >= state.targetScore) {
    state.phase = 'victory';
    wonJustNow = true;
  } else if (state.timeRemaining <= 0) {
    state.phase = 'timeout';
    timedOutJustNow = true;
  }

  return { caughtCount, wonJustNow, timedOutJustNow };
}
