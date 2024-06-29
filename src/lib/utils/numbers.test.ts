import { describe, expect, it } from 'vitest';

import { randomBoolean } from './booleans.js';
import { randomInteger, type RandomIntegerOptions } from './numbers.js';

describe(randomInteger.name, () => {
  it('Should generate a random integer between the provided range', () => {
    // Arrange
    const count = 10_000;
    const options = {
      max: 3,
      min: 1,
    } satisfies RandomIntegerOptions;
    const map = new Map<RandomIntegerOptions, number>();

    // Act
    for (let i = 0; i < count; i += 1) {
      const opts = {
        ...options,
        lowerBoundary: randomBoolean() ? 'exclude' : 'include',
        upperBoundary: randomBoolean() ? 'exclude' : 'include',
      } satisfies RandomIntegerOptions;
      const int = randomInteger(opts);

      map.set(opts, int);
    }

    // Assert
    for (const [options, int] of map.entries()) {
      if (options.lowerBoundary === 'exclude') {
        expect(int).toBeGreaterThan(options.min);
      } else {
        expect(int).toBeGreaterThanOrEqual(options.min);
      }

      if (options.upperBoundary === 'exclude') {
        expect(int).toBeLessThan(options.max);
      } else {
        expect(int).toBeLessThanOrEqual(options.max);
      }
    }
  });

  it('Should throw an error when an invalid lower boundary is provided', () => {
    // Arrange
    // @ts-expect-error Invalid value
    const options = {
      max: 3,
      min: 1,
      lowerBoundary: 'invalid',
    } as RandomIntegerOptions;

    // Act
    const action = () => randomInteger(options);

    // Assert
    expect(action).toThrowError(Error);
  });

  it('Should throw an error when an invalid upper boundary is provided', () => {
    // Arrange
    // @ts-expect-error Invalid value
    const options = {
      max: 3,
      min: 1,
      upperBoundary: 'invalid',
    } as RandomIntegerOptions;

    // Act
    const action = () => randomInteger(options);

    // Assert
    expect(action).toThrowError(Error);
  });

  it('Should generate a random integer with the default boundaries', () => {
    // Arrange
    const count = 10_000;
    const options = {
      max: 3,
      min: 1,
    } satisfies RandomIntegerOptions;
    const map = new Map<RandomIntegerOptions, number>();

    // Act
    for (let i = 0; i < count; i += 1) {
      const int = randomInteger(options);

      map.set(options, int);
    }

    // Assert
    for (const [options, int] of map.entries()) {
      expect(int).toBeGreaterThanOrEqual(options.min);
      expect(int).toBeLessThanOrEqual(options.max);
    }
  });
});
