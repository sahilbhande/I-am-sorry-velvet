import test from 'node:test';
import assert from 'node:assert/strict';
import { clampPositionToBounds, computeSafeEscapePosition } from './escapeButton';

test('escaping pause button always stays strictly inside container safe bounds', () => {
  const container = { width: 320, height: 112 };
  const button = { width: 110, height: 44 };
  const padding = 10;

  let pos = { x: 105, y: 34 };
  let seed = 0.13;
  const deterministicRng = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = 0; i < 40; i++) {
    const next = computeSafeEscapePosition({
      container,
      button,
      current: pos,
      pointer: { x: pos.x + 55, y: pos.y + 22 },
      padding,
      rng: deterministicRng,
    });

    assert.ok(next.x >= padding, `x (${next.x}) below min`);
    assert.ok(
      next.x + button.width <= container.width - padding,
      `x+w (${next.x + button.width}) exceeded container`
    );
    assert.ok(next.y >= padding, `y (${next.y}) below min`);
    assert.ok(
      next.y + button.height <= container.height - padding,
      `y+h (${next.y + button.height}) exceeded container`
    );

    const movedDistance = Math.hypot(next.x - pos.x, next.y - pos.y);
    assert.ok(movedDistance > 25, `expected noticeable jump, got ${movedDistance}`);
    pos = next;
  }
});

test('clampPositionToBounds safely handles narrow mobile containers', () => {
  const clamped = clampPositionToBounds(
    { x: 500, y: -20 },
    { width: 260, height: 96 },
    { width: 108, height: 44 },
    10
  );

  assert.equal(clamped.x, 142);
  assert.equal(clamped.y, 10);
});
