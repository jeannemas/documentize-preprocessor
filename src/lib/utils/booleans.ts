import { randomInteger } from './index.js';

/**
 * Generate a random boolean.
 */
export function randomBoolean(): boolean {
  const boolean =
    randomInteger({
      max: 1,
      min: 0,
    }) === 0;

  return boolean;
}
