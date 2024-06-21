import { describe, expect, it } from 'vitest';

import * as Markdown from '$lib/markdown/index.js';
import { generateRandomString, randomInt } from '$lib/test-utils.js';

export function generateRandomHeadingLevel(): Markdown.HeadingLevel {
  const index = randomInt(0, Markdown.headingLevels.length);
  const headingLevel = Markdown.headingLevels[index];

  return headingLevel;
}

describe(Markdown.Heading.name, () => {
  describe('constructor', () => {
    it('Should create a new instance', () => {
      // Arrange
      const headingLevel = generateRandomHeadingLevel();

      // Act
      const action = () => new Markdown.Heading(headingLevel);

      // Assert
      expect(action).not.toThrowError();

      const maybeHeading = action();

      expect(maybeHeading).toBeInstanceOf(Markdown.Heading);
    });

    it('Should throw an error for an invalid heading level', () => {
      // Arrange
      const headingLevel = -1 as Markdown.HeadingLevel;

      // Act
      const action = () => new Markdown.Heading(headingLevel);

      // Assert
      expect(action).toThrowError(Error);
    });
  });

  describe('add' satisfies keyof Markdown.Heading, () => {
    it('Should return the instance', () => {
      // Arrange
      const heading = new Markdown.Heading(generateRandomHeadingLevel());
      const text = new Markdown.Text(generateRandomString());

      // Act
      const maybeHeading = heading.add(text);

      // Assert
      expect(maybeHeading).toBeInstanceOf(Markdown.Heading);
      expect(maybeHeading).toBe(heading);
    });
  });

  describe('asString' satisfies keyof Markdown.Heading, () => {
    it('Should return a string', () => {
      // Arrange
      const heading = new Markdown.Heading(generateRandomHeadingLevel());

      // Act
      const markdown = heading.asString();

      // Assert
      expect(markdown).toBeTypeOf('string');
    });
  });
});
