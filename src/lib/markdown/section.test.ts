import { describe, expect, it } from 'vitest';

import * as Markdown from '$lib/markdown/index.js';
import { generateAlphabeat } from '$lib/utils/alphabeat.js';
import { randomString } from '$lib/utils/strings.js';

import { generateRandomHeadingLevel } from './heading.test.js';

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
      const text = new Markdown.Text(
        randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        }),
      );

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
