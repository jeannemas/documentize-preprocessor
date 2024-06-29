import { randomInteger } from './numbers.js';

/**
 * The options for generating a random string.
 */
export type RandomStringOptions = {
  /**
   * The alphabeat to use.
   */
  alphabeat: string[];
  /**
   * The length of the string.
   */
  length: number;
};

/**
 * Generate a random string.
 *
 * @param options The options.
 * @param options.alphabeat The alphabeat to use. Default is the pattern from `'a'` to `'z'` and from `'A'` to `'Z'`.
 * @param options.length The length of the string.
 */
export function randomString(options: RandomStringOptions): string {
  const alphabeatChars = [...new Set(options.alphabeat).values()]; // Filter out duplicates.
  const chars: string[] = [];

  for (let i = 0; i < options.length; i += 1) {
    const charIndex = randomInteger({
      max: alphabeatChars.length,
      min: 0,
      upperBoundary: 'exclude',
    });
    const char = alphabeatChars[charIndex];

    chars.push(char);
  }

  return chars.join('');
}
