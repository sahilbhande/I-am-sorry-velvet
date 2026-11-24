import { Volume2, VolumeX } from 'lucide-react';
import { getStoryProgressPercent, type StoryScene } from '../utils/storyFlow';

interface StoryProgressProps {
  scene: StoryScene;
  globalMuted: boolean;
  onToggleGlobalMute: () => void;
}

export function StoryProgress({
  scene,
  globalMuted,
  onToggleGlobalMute,
}: StoryProgressProps) {
  const percent = getStoryProgressPercent(scene);

  return (
    <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none">
      {/* Ultra-slim satin ribbon progress bar — zero spoilers of upcoming scenes */}
      <div className="h-1 w-full bg-[#F8C8DC]/55">
        <div
          className="h-full bg-gradient-to-r from-[#FF8FBD] to-[#D94F91] transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-label="Surprise story progress"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Subtle corner sound toggle (functional, >= 44px touch target, unobtrusive) */}
      <div className="mx-auto flex max-w-5xl items-center justify-end px-4 pt-3">
        <button
          type="button"
          onClick={onToggleGlobalMute}
          aria-label={globalMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          title={globalMuted ? 'Unmute sounds' : 'Mute sounds'}
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-[#70445C] border border-[#F8C8DC] shadow-sm transition-transform hover:scale-105 active:scale-95"
        >
          {globalMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
