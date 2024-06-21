import { describe, expect, it } from 'vitest';

import * as Markdown from '$lib/markdown/index.js';
import { generateRandomString, randomInt } from '$lib/test-utils.js';

function generateRandomHeadingLevel(): Markdown.HeadingLevel {
  const index = randomInt(0, Markdown.headingLevels.length);
  const headingLevel = Markdown.headingLevels[index];

  return headingLevel;
}

describe(Markdown.Section.name, () => {
  describe('constructor', () => {
    it('Should create a new instance', () => {
      // Arrange
      const heading = new Markdown.Heading(generateRandomHeadingLevel());

      // Act
      const action = () => new Markdown.Section(heading);

      // Assert
      expect(action).not.toThrowError();

      const maybeSection = action();

      expect(maybeSection).toBeInstanceOf(Markdown.Section);
    });
  });

  describe('add' satisfies keyof Markdown.Section, () => {
    it('Should return the instance', () => {
      // Arrange
      const heading = new Markdown.Heading(generateRandomHeadingLevel());
      const section = new Markdown.Section(heading);
      const text = new Markdown.Text(generateRandomString());

      // Act
      const maybeSection = section.add(text);

      // Assert
      expect(maybeSection).toBeInstanceOf(Markdown.Section);
      expect(maybeSection).toBe(section);
    });
  });

  describe('asString' satisfies keyof Markdown.Section, () => {
    it('Should return a string', () => {
      // Arrange
      const heading = new Markdown.Heading(generateRandomHeadingLevel());
      const section = new Markdown.Section(heading);

      // Act
      const markdown = section.asString();

      // Assert
      expect(markdown).toBeTypeOf('string');
    });
  });
});
