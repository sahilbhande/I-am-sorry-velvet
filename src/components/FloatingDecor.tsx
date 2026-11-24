import { useReducedMotion } from 'motion/react';
import { CoquetteBowIcon } from './CoquetteIcons';

interface FloatingDecorProps {
  /** 0..1 optional audio reactivity level (used during Scene Two musical prank) */
  pulseLevel?: number;
}

const DECOR_ITEMS = [
  { id: 'd1', kind: 'heart', top: '9%', left: '6%', size: 22, delay: '0s', opacity: 0.42 },
  { id: 'd2', kind: 'bow', top: '14%', left: '87%', size: 36, delay: '1.1s', opacity: 0.45 },
  { id: 'd3', kind: 'sparkle', top: '34%', left: '92%', size: 20, delay: '2.2s', opacity: 0.5 },
  { id: 'd4', kind: 'flower', top: '62%', left: '5%', size: 24, delay: '0.7s', opacity: 0.4 },
  { id: 'd5', kind: 'heart', top: '79%', left: '89%', size: 24, delay: '1.8s', opacity: 0.44 },
  { id: 'd6', kind: 'sparkle', top: '86%', left: '12%', size: 18, delay: '2.6s', opacity: 0.46 },
  { id: 'd7', kind: 'bow', top: '48%', left: '3%', size: 30, delay: '1.5s', opacity: 0.34 },
  { id: 'd8', kind: 'flower', top: '24%', left: '14%', size: 20, delay: '2.9s', opacity: 0.32 },
] as const;

export function FloatingDecor({ pulseLevel = 0 }: FloatingDecorProps) {
  const reducedMotion = useReducedMotion();
  const scaleBump = reducedMotion ? 1 : 1 + pulseLevel * 0.22;

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      aria-hidden="true"
    >
      {DECOR_ITEMS.map((item) => (
        <div
          key={item.id}
          className={reducedMotion ? 'absolute' : 'absolute animate-float-slow'}
          style={{
            top: item.top,
            left: item.left,
            opacity: Math.min(0.85, item.opacity + pulseLevel * 0.28),
            animationDelay: item.delay,
            transform: `scale(${scaleBump.toFixed(3)})`,
            transition: 'transform 160ms ease-out, opacity 160ms ease-out',
          }}
        >
          {item.kind === 'bow' && (
            <CoquetteBowIcon style={{ width: item.size, height: item.size * 0.7 }} />
          )}

          {item.kind === 'heart' && (
            <svg
              width={item.size}
              height={item.size}
              viewBox="0 0 24 24"
              fill="#FF8FBD"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}

          {item.kind === 'sparkle' && (
            <svg
              width={item.size}
              height={item.size}
              viewBox="0 0 24 24"
              fill="#D94F91"
            >
              <path d="M12 2L14.3 9.7L22 12L14.3 14.3L12 22L9.7 14.3L2 12L9.7 9.7L12 2Z" />
            </svg>
          )}

          {item.kind === 'flower' && (
            <svg
              width={item.size}
              height={item.size}
              viewBox="0 0 28 28"
              fill="none"
            >
              <circle cx="14" cy="7" r="4.5" fill="#F8C8DC" />
              <circle cx="21" cy="14" r="4.5" fill="#F8C8DC" />
              <circle cx="14" cy="21" r="4.5" fill="#F8C8DC" />
              <circle cx="7" cy="14" r="4.5" fill="#F8C8DC" />
              <circle cx="14" cy="14" r="3.6" fill="#FF8FBD" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
