import { describe, expect, it } from 'vitest';

import { generateAlphabeat } from './alphabeat.js';

describe(generateAlphabeat.name, () => {
  it('Should generate an alphabeat from "a" to "z"', () => {
    // Arrange
    const fromChar = 'a';
    const toChar = 'z';

    // Act
    const alphabeat = generateAlphabeat(fromChar, toChar);

    // Assert
    expect(alphabeat).toBeInstanceOf(Array);

    for (const char of alphabeat) {
      expect(char).toBeTypeOf('string');
      expect(char).toHaveLength(1);
    }
  });

  it('Should throw an error if the `fromChar` is not a single character', () => {
    // Arrange
    const fromChar = 'aa';
    const toChar = 'z';

    // Act
    const action = () => generateAlphabeat(fromChar, toChar);

    // Assert
    expect(action).toThrowError(Error);
  });

  it('Should throw an error if the `toChar` is not a single character', () => {
    // Arrange
    const fromChar = 'a';
    const toChar = 'zz';

    // Act
    const action = () => generateAlphabeat(fromChar, toChar);

    // Assert
    expect(action).toThrowError(Error);
  });

  it('Should throw an error if the `fromChar` ASCII code is greater than the `toChar` one', () => {
    // Arrange
    const fromChar = 'z';
    const toChar = 'a';

    // Act
    const action = () => generateAlphabeat(fromChar, toChar);

    // Assert
    expect(action).toThrowError(Error);
  });
});
