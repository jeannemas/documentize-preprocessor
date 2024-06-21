import { describe, expect, it } from 'vitest';

import { PREPROCESSOR_NAME } from './constants.js';

describe('PREPROCESSOR_NAME', () => {
  it('Should be defined as a string', () => {
    // Arrange

    // Act
    const maybeString = PREPROCESSOR_NAME;

    // Assert
    expect(maybeString).toBeTypeOf('string');
  });
});
