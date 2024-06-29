import { describe, expect, it } from 'vitest';

import * as Markdown from '$lib/markdown/index.js';
import { generateAlphabeat } from '$lib/utils/alphabeat.js';
import { randomString } from '$lib/utils/strings.js';

describe(Markdown.Table.Cell.name, () => {
  describe('constructor', () => {
    it('Should create a new instance', () => {
      // Arrange

      // Act
      const action = () => new Markdown.Table.Cell();

      // Assert
      expect(action).not.toThrowError();

      const maybeCell = action();

      expect(maybeCell).toBeInstanceOf(Markdown.Table.Cell);
    });
  });

  describe('add' satisfies keyof Markdown.Table.Cell, () => {
    it('Should return the instance', () => {
      // Arrange
      const cell = new Markdown.Table.Cell();
      const text = new Markdown.Text(
        randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        }),
      );

      // Act
      const maybeCell = cell.add(text);

      // Assert
      expect(maybeCell).toBeInstanceOf(Markdown.Table.Cell);
      expect(maybeCell).toBe(cell);
    });
  });

  describe('asString' satisfies keyof Markdown.Table.Cell, () => {
    it('Should return a string', () => {
      // Arrange
      const cell = new Markdown.Table.Cell();

      // Act
      const maybeString = cell.asString();

      // Assert
      expect(maybeString).toBeTypeOf('string');
    });
  });
});
