import { describe, expect, it } from 'vitest';

import * as Markdown from '$lib/markdown/index.js';
import { randomInteger, randomString } from '$lib/test-utils/index.js';

/**
 * Generate a random column alignment.
 */
export function generateRandomColumnAlignment(): Markdown.Table.ColumnAlignment {
  const index = randomInteger({
    min: 0,
    max: Markdown.Table.columnAlignments.length,
    upperBoundary: 'exclude',
  });
  const alignment = Markdown.Table.columnAlignments[index];

  return alignment;
}

describe(Markdown.Table.Column.name, () => {
  describe('constructor', () => {
    it('Should create a new instance', () => {
      // Arrange
      const alignment = generateRandomColumnAlignment();

      // Act
      const action = () => new Markdown.Table.Column(alignment);

      // Assert
      expect(action).not.toThrowError();

      const maybeColumn = action();

      expect(maybeColumn).toBeInstanceOf(Markdown.Table.Column);
    });

    it('Should throw an error for an invalid alignment', () => {
      // Arrange
      const alignment = '' as Markdown.Table.ColumnAlignment;

      // Act
      const action = () => new Markdown.Table.Column(alignment);

      // Assert
      expect(action).toThrowError(Error);
    });
  });

  describe('add' satisfies keyof Markdown.Table.Column, () => {
    it('Should return the instance', () => {
      // Arrange
      const alignment = generateRandomColumnAlignment();
      const column = new Markdown.Table.Column(alignment);
      const text = new Markdown.Text(randomString());

      // Act
      const maybeColumn = column.add(text);

      // Assert
      expect(maybeColumn).toBeInstanceOf(Markdown.Table.Column);
      expect(maybeColumn).toBe(column);
    });
  });

  describe('alignment' satisfies keyof Markdown.Table.Column, () => {
    it("Should match the constructor's alignment", () => {
      // Arrange
      const alignment = generateRandomColumnAlignment();
      const column = new Markdown.Table.Column(alignment);

      // Act
      const columnAlignment = column.alignment;

      // Assert
      expect(columnAlignment).toBe(alignment);
    });
  });

  describe('asString' satisfies keyof Markdown.Table.Column, () => {
    it('Should return a string', () => {
      // Arrange
      const alignment = generateRandomColumnAlignment();
      const column = new Markdown.Table.Column(alignment);

      // Act
      const maybeString = column.asString();

      // Assert
      expect(maybeString).toBeTypeOf('string');
    });
  });
});
