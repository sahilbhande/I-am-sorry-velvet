export type StoryScene =
  | 'entrance'
  | 'loading'
  | 'prank'
  | 'apology'
  | 'letter'
  | 'contract'
  | 'game'
  | 'victory'
  | 'certificate';

export const STORY_SCENES: readonly StoryScene[] = [
  'entrance',
  'loading',
  'prank',
  'apology',
  'letter',
  'contract',
  'game',
  'victory',
  'certificate',
] as const;

export function getSceneIndex(scene: StoryScene): number {
  return STORY_SCENES.indexOf(scene);
}

export function getNextScene(scene: StoryScene): StoryScene {
  const index = getSceneIndex(scene);
  if (index < 0 || index >= STORY_SCENES.length - 1) {
    return STORY_SCENES[STORY_SCENES.length - 1];
  }
  return STORY_SCENES[index + 1];
}

export function getStoryProgressPercent(scene: StoryScene): number {
  const index = getSceneIndex(scene);
  if (index <= 0) return 0;
  return Math.round((index / (STORY_SCENES.length - 1)) * 100);
}

export function isValidStoryScene(value: string | null): value is StoryScene {
  if (!value) return false;
  return (STORY_SCENES as readonly string[]).includes(value);
}

/**
 * Resolves the initial scene from URL search parameters.
 * - `?autostart=1` jumps straight to the interactive teddy bear game for quick testing.
 * - `?scene=<sceneName>` opens a specific valid scene directly.
 * - Defaults to `'entrance'`.
 */
export function resolveInitialScene(search: string): {
  scene: StoryScene;
  autostartGame: boolean;
} {
  const params = new URLSearchParams(search);
  const autostart = params.get('autostart') === '1';
  const requestedScene = params.get('scene');

  if (isValidStoryScene(requestedScene)) {
    return {
      scene: requestedScene,
      autostartGame: autostart && requestedScene === 'game',
    };
  }

  if (autostart) {
    return {
      scene: 'game',
      autostartGame: true,
    };
  }

  return {
    scene: 'entrance',
    autostartGame: false,
  };
}
