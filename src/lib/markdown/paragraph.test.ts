import { describe, expect, it } from 'vitest';

import * as Markdown from '$lib/markdown/index.js';
import { randomString } from '$lib/test-utils/index.js';

describe(Markdown.Paragraph.name, () => {
  describe('constructor', () => {
    it('Should create a new instance', () => {
      // Arrange

      // Act
      const action = () => new Markdown.Paragraph();

      // Assert
      expect(action).not.toThrowError();

      const maybeParagraph = action();

      expect(maybeParagraph).toBeInstanceOf(Markdown.Paragraph);
    });
  });

  describe('add' satisfies keyof Markdown.Paragraph, () => {
    it('Should return the instance', () => {
      // Arrange
      const paragraph = new Markdown.Paragraph();
      const text = new Markdown.Text(randomString());

      // Act
      const maybeParagraph = paragraph.add(text);

      // Assert
      expect(maybeParagraph).toBeInstanceOf(Markdown.Paragraph);
      expect(maybeParagraph).toBe(paragraph);
    });
  });

  describe('asString' satisfies keyof Markdown.Paragraph, () => {
    it('Should return a string', () => {
      // Arrange
      const paragraph = new Markdown.Paragraph();

      // Act
      const markdown = paragraph.asString();

      // Assert
      expect(markdown).toBeTypeOf('string');
    });
  });
});
