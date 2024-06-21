import { describe, expect, it } from 'vitest';

import * as Markdown from '$lib/markdown/index.js';

describe(Markdown.Table.Row.name, () => {
  describe('constructor', () => {
    it('Should create a new instance', () => {
      // Arrange

      // Act
      const action = () => new Markdown.Table.Row();

      // Assert
      expect(action).not.toThrowError();

      const maybeRow = action();

      expect(maybeRow).toBeInstanceOf(Markdown.Table.Row);
    });
  });

  describe('add' satisfies keyof Markdown.Table.Row, () => {
    it('Should return the instance', () => {
      // Arrange
      const cell = new Markdown.Table.Cell();
      const row = new Markdown.Table.Row();

      // Act
      const maybeRow = row.add(cell);

      // Assert
      expect(maybeRow).toBeInstanceOf(Markdown.Table.Row);
      expect(maybeRow).toBe(row);
    });
  });

  describe('asString' satisfies keyof Markdown.Table.Row, () => {
    it('Should return a string', () => {
      // Arrange
      const row = new Markdown.Table.Row();

      // Act
      const maybeString = row.asString();

      // Assert
      expect(maybeString).toBeTypeOf('string');
    });
  });
});
