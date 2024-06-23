import { describe, expect, it } from 'vitest';

import * as Markdown from '$lib/markdown/index.js';
import { randomInteger, randomString } from '$lib/test-utils/index.js';

import { generateRandomColumnAlignment } from './column.test.js';

/**
 * Generate random table columns.
 */
export function generateRandomColumns(columnsCount: number): Markdown.Table.Column[] {
  const columns: Markdown.Table.Column[] = [];

  for (let i = 0; i < columnsCount; i += 1) {
    columns.push(
      new Markdown.Table.Column(generateRandomColumnAlignment(), new Markdown.Text(randomString())),
    );
  }

  return columns;
}

/**
 * Generate random table rows.
 */
export function generateRandomRows(columnsCount: number, rowsCount: number): Markdown.Table.Row[] {
  const rows: Markdown.Table.Row[] = [];

  for (let i = 0; i < rowsCount; i += 1) {
    const cells: Markdown.Table.Cell[] = [];

    for (let j = 0; j < columnsCount; j += 1) {
      cells.push(new Markdown.Table.Cell(new Markdown.Text(randomString())));
    }

    rows.push(new Markdown.Table.Row(...cells));
  }

  return rows;
}

describe(Markdown.Table.Table.name, () => {
  describe('constructor', () => {
    it('Should create a new instance', () => {
      // Arrange
      const columns = [
        new Markdown.Table.Column('left'), // We manually specify the alignment in case the random value is always the same
        ...generateRandomColumns(
          randomInteger({
            max: 10,
            min: 0,
          }),
        ),
        new Markdown.Table.Column('right'), // We manually specify the alignment in case the random value is always the same
      ];
      const rows = generateRandomRows(
        columns.length,
        randomInteger({
          max: 10,
          min: 5,
        }),
      );

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
      const columns = [
        new Markdown.Table.Column('left'), // We manually specify the alignment in case the random value is always the same
        ...generateRandomColumns(
          randomInteger({
            max: 10,
            min: 0,
          }),
        ),
        new Markdown.Table.Column('right'), // We manually specify the alignment in case the random value is always the same
      ];
      const table = new Markdown.Table.Table(
        columns,
        generateRandomRows(
          columns.length,
          randomInteger({
            max: 10,
            min: 5,
          }),
        ),
      );

      // Act
      const maybeString = table.asString();

      // Assert
      expect(maybeString).toBeTypeOf('string');
    });

    it('Should throw an error for an invalid column alignment', () => {
      // Arrange
      const columns = [
        new Markdown.Table.Column('left'), // We manually specify the alignment in case the random value is always the same
        ...generateRandomColumns(
          randomInteger({
            max: 10,
            min: 0,
          }),
        ),
        new Markdown.Table.Column('right'), // We manually specify the alignment in case the random value is always the same
        // @ts-expect-error Invalid type
        { alignment: 'invalid' } as Markdown.Table.Column, // We manually specify an invalid alignment
      ];
      const table = new Markdown.Table.Table(
        columns,
        generateRandomRows(
          columns.length,
          randomInteger({
            max: 10,
            min: 5,
          }),
        ),
      );

      // Act
      const action = () => table.asString();

      // Assert
      expect(action).toThrowError(Error);
    });
  });
});
