import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STORY_SCENES,
  getNextScene,
  getSceneIndex,
  getStoryProgressPercent,
  resolveInitialScene,
} from './storyFlow';

test('story flow follows the exact required 9-stage sequence', () => {
  let current = STORY_SCENES[0];
  const visited: string[] = [current];

  for (let i = 0; i < STORY_SCENES.length - 1; i++) {
    current = getNextScene(current);
    visited.push(current);
  }

  assert.deepEqual(visited, [
    'entrance',
    'loading',
    'prank',
    'apology',
    'letter',
    'contract',
    'game',
    'victory',
    'certificate',
  ]);
  // Calling getNextScene at final scene stays on certificate
  assert.equal(getNextScene('certificate'), 'certificate');
});

test('progress percent scales cleanly from 0 to 100', () => {
  assert.equal(getSceneIndex('entrance'), 0);
  assert.equal(getStoryProgressPercent('entrance'), 0);
  assert.equal(getStoryProgressPercent('letter'), 50);
  assert.equal(getStoryProgressPercent('certificate'), 100);
});

test('resolveInitialScene handles defaults, autostart=1, and explicit valid/invalid scene params', () => {
  assert.deepEqual(resolveInitialScene(''), {
    scene: 'entrance',
    autostartGame: false,
  });

  assert.deepEqual(resolveInitialScene('?autostart=1'), {
    scene: 'game',
    autostartGame: true,
  });

  assert.deepEqual(resolveInitialScene('?scene=letter'), {
    scene: 'letter',
    autostartGame: false,
  });

  assert.deepEqual(resolveInitialScene('?scene=invalid_scene'), {
    scene: 'entrance',
    autostartGame: false,
  });
});
