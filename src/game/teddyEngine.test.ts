import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialGameState,
  setBasketTarget,
  spawnBear,
  stepGameState,
} from './teddyEngine';

test('catching a bear increments score, triggers squash-and-stretch, and spawns pooled particles', () => {
  const state = createInitialGameState(400, 520, 10, 60, 'playing');
  setBasketTarget(state, 200);
  state.basketX = 200;

  const basketY = state.height - state.basketHeight / 2 - 22;
  const bear = spawnBear(state, () => 0.5);
  bear.x = 200;
  bear.y = basketY - 12;
  bear.vx = 0;
  bear.vy = 40;

  const res = stepGameState(state, 0.03, 0, () => 0.5);
  assert.equal(res.caughtCount, 1);
  assert.equal(state.score, 1);
  assert.equal(state.bears.length, 0);
  assert.ok(state.basketScaleX > 1.05);
  assert.ok(state.particles.some((p) => p.active));
});

test('winning condition triggers immediately upon reaching targetScore (10)', () => {
  const state = createInitialGameState(400, 520, 10, 60, 'playing');
  state.score = 9;
  state.basketX = 200;
  state.basketTargetX = 200;

  const basketY = state.height - state.basketHeight / 2 - 22;
  const bear = spawnBear(state, () => 0.5);
  bear.x = 200;
  bear.y = basketY - 10;
  bear.vx = 0;
  bear.vy = 20;

  const res = stepGameState(state, 0.02, 0, () => 0.5);
  assert.equal(state.score, 10);
  assert.equal(res.wonJustNow, true);
  assert.equal(state.phase, 'victory');
});

test('timeout triggers cleanly when timer reaches 0 before targetScore', () => {
  const state = createInitialGameState(400, 520, 10, 60, 'playing');
  state.timeRemaining = 0.02;
  state.spawnTimer = 10;

  const res = stepGameState(state, 0.05, 0, () => 0.5);
  assert.equal(state.timeRemaining, 0);
  assert.equal(res.timedOutJustNow, true);
  assert.equal(state.phase, 'timeout');
});

test('dt is clamped so huge frame pauses do not drain the whole 60s timer at once', () => {
  const state = createInitialGameState(400, 520, 10, 60, 'playing');
  stepGameState(state, 15.0, 0, () => 0.5);
  assert.ok(state.timeRemaining >= 59.9);
  assert.equal(state.phase, 'playing');
});
