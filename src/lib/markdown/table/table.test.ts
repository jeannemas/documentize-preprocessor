import { describe, expect, it } from 'vitest';

import * as Markdown from '$lib/markdown/index.js';
import { generateRandomString, randomInt } from '$lib/test-utils.js';

import { generateRandomAlignment } from './column.test.js';

export function generateRandomColumns(columnsCount: number): Markdown.Table.Column[] {
  const columns: Markdown.Table.Column[] = [];

  for (let i = 0; i < columnsCount; i += 1) {
    const alignment = generateRandomAlignment();
    const text = new Markdown.Text(generateRandomString());
    const column = new Markdown.Table.Column(alignment, text);

    columns.push(column);
  }

  return columns;
}

export function generateRandomRows(columnsCount: number, rowsCount: number): Markdown.Table.Row[] {
  const rows: Markdown.Table.Row[] = [];

  for (let i = 0; i < rowsCount; i += 1) {
    const cells: Markdown.Table.Cell[] = [];

    for (let j = 0; j < columnsCount; j += 1) {
      const text = new Markdown.Text(generateRandomString());
      const cell = new Markdown.Table.Cell(text);

      cells.push(cell);
    }

    const row = new Markdown.Table.Row(...cells);

    rows.push(row);
  }

  return rows;
}

describe(Markdown.Table.Table.name, () => {
  describe('constructor', () => {
    it('Should create a new instance', () => {
      // Arrange
      const columnsCount = randomInt(0, 11);
      const columns = [
        new Markdown.Table.Column('left'), // We manually specify the alignment in case the random value is always the same
        ...generateRandomColumns(columnsCount),
        new Markdown.Table.Column('right'), // We manually specify the alignment in case the random value is always the same
      ];
      const rows = generateRandomRows(columns.length, randomInt(5, 11));

      // Act
      const action = () => new Markdown.Table.Table(columns, rows);

      // Assert
      expect(action).not.toThrowError();

      const maybeTable = action();

      expect(maybeTable).toBeInstanceOf(Markdown.Table.Table);
    });
  });

  describe('asString' satisfies keyof Markdown.Table.Table, () => {
    it('Should return a string', () => {
      // Arrange
      const columnsCount = randomInt(0, 11);
      const columns = [
        new Markdown.Table.Column('left'), // We manually specify the alignment in case the random value is always the same
        ...generateRandomColumns(columnsCount),
        new Markdown.Table.Column('right'), // We manually specify the alignment in case the random value is always the same
      ];
      const rows = generateRandomRows(columns.length, randomInt(5, 11));
      const table = new Markdown.Table.Table(columns, rows);

      // Act
      const maybeString = table.asString();

      // Assert
      expect(maybeString).toBeTypeOf('string');
    });

    it('Should throw an error for an invalid column alignment', () => {
      // Arrange
      const columnsCount = randomInt(0, 11);
      const columns = [
        new Markdown.Table.Column('left'), // We manually specify the alignment in case the random value is always the same
        ...generateRandomColumns(columnsCount),
        new Markdown.Table.Column('right'), // We manually specify the alignment in case the random value is always the same
        // @ts-expect-error Invalid type
        { alignment: 'invalid' } as Markdown.Table.Column, // We manually specify an invalid alignment
      ];
      const rows = generateRandomRows(columns.length, randomInt(5, 11));
      const table = new Markdown.Table.Table(columns, rows);

      // Act
      const action = () => table.asString();

      // Assert
      expect(action).toThrowError(Error);
    });
  });
});
