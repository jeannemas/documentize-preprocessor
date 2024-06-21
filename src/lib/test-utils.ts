import { randomInt } from 'node:crypto';

export { randomInt } from 'node:crypto';

/**
 * Generate a random string.
 *
 * @param alphabeat The alphabeat to use. Default is [a-zA-Z].
 * @param length The length of the string. Default is `16`.
 * @returns The random string.
 */
export function generateRandomString(
  alphabeat: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  length: number = 16,
): string {
  const chars = [...new Set(alphabeat.split('')).values()];
  const string = Array.from({ length }, () => chars[randomInt(0, chars.length)]).join('');

  return string;
}
