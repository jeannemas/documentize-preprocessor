import { describe, expect, it } from 'vitest';

import * as Markdown from '$lib/markdown/index.js';
import { generateRandomString } from '$lib/test-utils.js';

describe(Markdown.Text.name, () => {
  describe('constructor', () => {
    it('Should create a new instance', () => {
      // Arrange

      // Act
      const action = () => new Markdown.Text(generateRandomString());

      // Assert
      expect(action).not.toThrowError();

      const maybeText = action();

      expect(maybeText).toBeInstanceOf(Markdown.Text);
    });
  });

  describe('asString' satisfies keyof Markdown.Text, () => {
    it('Should return a string', () => {
      // Arrange
      const text = new Markdown.Text(generateRandomString());

      // Act
      const markdown = text.asString();

      // Assert
      expect(markdown).toBeTypeOf('string');
    });
  });
});
