import { describe, expect, it } from 'vitest';

import * as Markdown from '$lib/markdown/index.js';
import { generateRandomString } from '$lib/test-utils.js';

describe(Markdown.Builder.name, () => {
  describe('constructor', () => {
    it('Should create a new instance', () => {
      // Arrange

      // Act
      const action = () => new Markdown.Builder();

      // Assert
      expect(action).not.toThrowError();

      const maybeBuilder = action();

      expect(maybeBuilder).toBeInstanceOf(Markdown.Builder);
    });
  });

  describe('add' satisfies keyof Markdown.Builder, () => {
    it('Should return the instance', () => {
      // Arrange
      const builder = new Markdown.Builder();
      const text = new Markdown.Text(generateRandomString());

      // Act
      const maybeBuilder = builder.add(text);

      // Assert
      expect(maybeBuilder).toBeInstanceOf(Markdown.Builder);
      expect(maybeBuilder).toBe(builder);
    });
  });

  describe('asString' satisfies keyof Markdown.Builder, () => {
    it('Should return a string', () => {
      // Arrange
      const builder = new Markdown.Builder();

      // Act
      const markdown = builder.asString();

      // Assert
      expect(markdown).toBeTypeOf('string');
    });
  });
});
