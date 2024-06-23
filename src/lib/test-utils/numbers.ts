import { randomInt } from 'node:crypto';

/**
 * The boundaries for generating a random integer.
 */
const boundaries = ['include', 'exclude'] as const;

/**
 * A boundary for generating a random integer.
 */
type Boundary = (typeof boundaries)[number];

/**
 * The options for generating a random integer.
 */
type Options = {
  /**
   * The maximum value.
   */
  max: number;
  /**
   * The minimum value.
   */
  min: number;
  /**
   * The lower boundary.
   *
   * @default 'include'
   */
  lowerBoundary?: Boundary;
  /**
   * The upper boundary.
   *
   * @default 'include'
   */
  upperBoundary?: Boundary;
};

/**
 * Generate a random integer.
 *
 * @param options The options.
 * @param options.max The maximum value.
 * @param options.min The minimum value.
 * @param options.lowerBoundary The lower boundary. Default is `'include'`.
 * @param options.upperBoundary The upper boundary. Default is `'include'`.
 * @throws {Error} When an invalid boundary is provided.
 */
export function randomInteger({
  max,
  min,
  lowerBoundary = 'include',
  upperBoundary = 'include',
}: Options): number {
  if (!boundaries.includes(lowerBoundary)) {
    throw new Error(
      `Invalid lower boundary: ${lowerBoundary}. Expected ${boundaries.map((boundary) => `"${boundary}"`).join(', ')}.`,
    );
  }

  if (!boundaries.includes(upperBoundary)) {
    throw new Error(
      `Invalid upper boundary: ${upperBoundary}. Expected ${boundaries.map((boundary) => `"${boundary}"`).join(', ')}.`,
    );
  }

  const int = randomInt(
    min + (lowerBoundary === 'include' ? 0 : 1),
    max + (upperBoundary === 'include' ? 1 : 0),
  );

  return int;
}
