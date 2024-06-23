import { generateAlphabeat, randomInteger } from './index.js';

/**
 * The options for generating a random string.
 */
type Options = {
  /**
   * The alphabeat to use.
   *
   * @default 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
   */
  alphabeat?: string;
  /**
   * The length of the string.
   *
   * @default 16
   */
  length?: number;
};

/**
 * Generate a random string.
 *
 * @param options The options.
 * @param options.alphabeat The alphabeat to use. Default is `'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'`.
 * @param options.length The length of the string. Default is `16`.
 */
export function randomString({
  alphabeat = `${generateAlphabeat('a', 'z')}${generateAlphabeat('A', 'Z')}`,
  length = 16,
}: Options = {}): string {
  const alphabeatChars = [...new Set(alphabeat.split('')).values()]; // Filter out duplicates.
  const chars: string[] = [];

  for (let i = 0; i <= length; i += 1) {
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
