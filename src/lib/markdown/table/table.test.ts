import { describe, expect, it } from 'vitest';

import * as Markdown from '$lib/markdown/index.js';

describe(Markdown.Table.Table.name, () => {
  describe('constructor', () => {
    it('Should create a new instance', () => {
      // Arrange
      const columns = [] satisfies Markdown.Table.Column[];
      const rows = [] satisfies Markdown.Table.Row[];

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
      const columns = [] satisfies Markdown.Table.Column[];
      const rows = [] satisfies Markdown.Table.Row[];
      const table = new Markdown.Table.Table(columns, rows);

      // Act
      const maybeString = table.asString();

      // Assert
      expect(maybeString).toBeTypeOf('string');
    });
  });
});
