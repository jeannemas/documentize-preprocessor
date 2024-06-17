import { describe, expect, it } from 'vitest';

import { Heading, type HeadingLevel } from './heading.js';

describe(Heading.name, () => {
  it("Specifying a heading level should create the appropriate amount of '#'", () => {
    // Arrange
    const levels = [1, 2, 3, 4, 5, 6] satisfies HeadingLevel[];
    const text = 'Lorem ipsum dolor sit amet';
    const headings = new Map<HeadingLevel, Heading>();

    // Act
    for (const level of levels) {
      headings.set(level, new Heading(level, text));
    }

    // Assert
    for (const [headingLevel, heading] of headings.entries()) {
      const string = heading.toString();

      expect(string.startsWith('#'.repeat(headingLevel))).toBe(true);
      expect(string.includes(text)).toBe(true);
      expect(string.endsWith('\n')).toBe(true);
    }
  });

  it('Specifying an invalid heading level should throw an error', () => {
    // Arrange
    // @ts-expect-error invalid type
    const levels = [0, 7] as HeadingLevel[];
    const text = 'Lorem ipsum dolor sit amet';
    const headings = new Map<HeadingLevel, () => Heading>();

    // Act
    for (const level of levels) {
      headings.set(level, () => new Heading(level, text));
    }

    // Assert
    for (const [, action] of headings.entries()) {
      expect(action).toThrowError(TypeError);
    }
  });

  it('Specifying an invalid heading text should throw an error', () => {
    // Arrange
    const levels = [1, 2, 3, 4, 5, 6] satisfies HeadingLevel[];
    // @ts-expect-error invalid type
    const text = null as string;
    const headings = new Map<HeadingLevel, () => Heading>();

    // Act
    for (const level of levels) {
      headings.set(level, () => new Heading(level, text));
    }

    // Assert
    for (const [, action] of headings.entries()) {
      expect(action).toThrowError(TypeError);
    }
  });
});
