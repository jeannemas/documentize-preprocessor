import { describe, expect, it } from 'vitest';

import { generateAlphabeat } from './alphabeat.js';
import { randomInteger } from './numbers.js';
import { randomString } from './strings.js';

describe(randomString.name, () => {
  it('Should generate a random string', () => {
    // Arrange
    const alphabeat = generateAlphabeat('0', '9');
    const length = randomInteger({
      max: 100,
      min: 10,
    });

    // Act
    const string = randomString({
      alphabeat,
      length,
    });

    // Assert
    expect(string).toHaveLength(length);
  });
});
