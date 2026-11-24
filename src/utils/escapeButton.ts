export interface BoundsSize {
  width: number;
  height: number;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface EscapeOptions {
  container: BoundsSize;
  button: BoundsSize;
  current: Point2D;
  pointer?: Point2D;
  padding?: number;
  rng?: () => number;
}

/**
 * Computes a new (x, y) top-left position for the escaping Pause button
 * strictly within the visible safe bounds of its container, maximizing distance
 * from both the current position and the pointer/touch coordinate.
 */
export function computeSafeEscapePosition({
  container,
  button,
  current,
  pointer,
  padding = 12,
  rng = Math.random,
}: EscapeOptions): Point2D {
  const minX = padding;
  const minY = padding;
  const maxX = Math.max(minX, container.width - button.width - padding);
  const maxY = Math.max(minY, container.height - button.height - padding);

  const rangeX = maxX - minX;
  const rangeY = maxY - minY;

  if (rangeX <= 2 && rangeY <= 2) {
    return { x: minX, y: minY };
  }

  const avoidX = pointer ? pointer.x - button.width / 2 : current.x;
  const avoidY = pointer ? pointer.y - button.height / 2 : current.y;

  let bestCandidate: Point2D = {
    x: minX + rangeX * 0.5,
    y: minY + rangeY * 0.5,
  };
  let bestScore = -1;

  // Sample 14 candidate points inside the safe box and pick the most playful jump
  for (let i = 0; i < 14; i++) {
    const cx = minX + rng() * rangeX;
    const cy = minY + rng() * rangeY;

    const distFromCurrent = Math.hypot(cx - current.x, cy - current.y);
    const distFromPointer = Math.hypot(cx - avoidX, cy - avoidY);
    const score = distFromPointer * 0.65 + distFromCurrent * 0.35;

    if (score > bestScore) {
      bestScore = score;
      bestCandidate = { x: Math.round(cx), y: Math.round(cy) };
    }
  }

  return clampPositionToBounds(bestCandidate, container, button, padding);
}

export function clampPositionToBounds(
  point: Point2D,
  container: BoundsSize,
  button: BoundsSize,
  padding = 12
): Point2D {
  const minX = padding;
  const minY = padding;
  const maxX = Math.max(minX, container.width - button.width - padding);
  const maxY = Math.max(minY, container.height - button.height - padding);

  return {
    x: Math.min(maxX, Math.max(minX, point.x)),
    y: Math.min(maxY, Math.max(minY, point.y)),
  };
}
