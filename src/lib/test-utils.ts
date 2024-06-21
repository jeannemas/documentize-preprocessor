import { randomInt } from 'node:crypto';

export { randomInt } from 'node:crypto';

/**
 * Generate a random string.
 *
 * @param alphabeat The alphabeat to use. Default is [a-zA-Z0-9].
 * @param length The length of the string. Default is `16`.
 * @returns The random string.
 */
export function generateRandomString(
  alphabeat: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  length: number = 16,
): string {
  const chars = [...new Set(alphabeat.split('')).values()];
  const string = Array.from({ length }, () => chars[randomInt(0, chars.length)]).join('');

  return string;
}
