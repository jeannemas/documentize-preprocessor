import { describe, expect, it } from 'vitest';

import { randomBoolean } from './booleans.js';

describe(randomBoolean.name, () => {
  it('Should generate a random boolean', () => {
    // Arrange
    const count = 10_000;
    const map = new Map<boolean, null>();

    // Act
    for (let i = 0; i < count; i += 1) {
      const boolean = randomBoolean();

      map.set(boolean, null);
    }

    // Assert
    expect(map.size).toEqual(2);
  });
});
