import { describe, expect, it } from 'vitest';

import * as Markdown from '$lib/markdown/index.js';
import { generateRandomString, randomInt } from '$lib/test-utils.js';

function generateRandomAlignment(): Markdown.Table.ColumnAlignment {
  const index = randomInt(0, Markdown.Table.columnAlignments.length);
  const alignment = Markdown.Table.columnAlignments[index];

  return alignment;
}

describe(Markdown.Table.Column.name, () => {
  describe('constructor', () => {
    it('Should create a new instance', () => {
      // Arrange
      const alignment = generateRandomAlignment();

      // Act
      const action = () => new Markdown.Table.Column(alignment);

      // Assert
      expect(action).not.toThrowError();

      const maybeColumn = action();

      expect(maybeColumn).toBeInstanceOf(Markdown.Table.Column);
    });
  });

  describe('add' satisfies keyof Markdown.Table.Column, () => {
    it('Should return the instance', () => {
      // Arrange
      const alignment = generateRandomAlignment();
      const column = new Markdown.Table.Column(alignment);
      const text = new Markdown.Text(generateRandomString());

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
      const alignment = generateRandomAlignment();
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
      const alignment = generateRandomAlignment();
      const column = new Markdown.Table.Column(alignment);

      // Act
      const maybeString = column.asString();

      // Assert
      expect(maybeString).toBeTypeOf('string');
    });
  });
});
