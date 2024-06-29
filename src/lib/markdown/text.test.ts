import { describe, expect, it } from 'vitest';

import * as Markdown from '$lib/markdown/index.js';
import { generateAlphabeat } from '$lib/utils/alphabeat.js';
import { randomString } from '$lib/utils/strings.js';

describe(Markdown.Text.name, () => {
  describe('constructor', () => {
    it('Should create a new instance', () => {
      // Arrange

      // Act
      const action = () =>
        new Markdown.Text(
          randomString({
            alphabeat: generateAlphabeat('a', 'z'),
            length: 16,
          }),
        );

      // Assert
      expect(action).not.toThrowError();

      const maybeText = action();

      expect(maybeText).toBeInstanceOf(Markdown.Text);
    });
  });

  describe('asString' satisfies keyof Markdown.Text, () => {
    it('Should return a string', () => {
      // Arrange
      const text = new Markdown.Text(
        randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        }),
      );

      // Act
      const markdown = text.asString();

      // Assert
      expect(markdown).toBeTypeOf('string');
    });
  });
});
