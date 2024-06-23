/**
 * Generate an alphabeat as string from a char to another char.
 * The alphabeat is generated in the ASCII order.
 *
 * @param fromChar The first char of the alphabeat.
 * @param toChar The last char of the alphabeat.
 * @returns The alphabeat.
 * @throws When the `fromChar` is not a single character.
 * @throws When the `toChar` is not a single character.
 * @throws When the `fromChar` ASCII code is greater than the `toChar` one.
 */
export function generateAlphabeat(fromChar: string, toChar: string): string {
  if (fromChar.length !== 1) {
    throw new Error('The `fromChar` must be a single character.');
  }

  if (toChar.length !== 1) {
    throw new Error('The `toChar` must be a single character.');
  }

  const chars: string[] = [];
  const fromCode = fromChar.charCodeAt(0);
  const toCode = toChar.charCodeAt(0);

  if (fromCode > toCode) {
    throw new Error('The `fromChar` ASCII code must be less than the `toChar` one.');
  }

  for (let code = fromCode; code <= toCode; code += 1) {
    const char = String.fromCharCode(code);

    chars.push(char);
  }

  return chars.join('');
}
