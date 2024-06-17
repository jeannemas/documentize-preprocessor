import { MarkdownNode } from './internal.js';

/**
 * A table header.
 */
export type TableHeader = {
  /**
   * The alignment of the header.
   */
  align: 'left' | 'right';
  /**
   * The text of the header.
   */
  text: string;
};

/**
 * A table in a markdown document.
 */
export class Table extends MarkdownNode {
  /**
   * The headers of the table.
   */
  #headers: TableHeader[];
  /**
   * The rows of the table.
   */
  #rows: string[][];

  /**
   * Create a new table.
   */
  constructor(headers: TableHeader[], rows: string[][]) {
    super();

    this.#headers = headers;
    this.#rows = rows;
  }

  /**
   * Convert the table to a string.
   */
  toString() {
    const columnsLength = this.#headers.map((header) => header.text.length);

    for (const row of this.#rows) {
      for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
        columnsLength[columnIndex] = Math.max(columnsLength[columnIndex], row[columnIndex].length);
      }
    }

    const headers = `| ${this.#headers.map((header, columnIndex) => header.text.padEnd(columnsLength[columnIndex], ' ')).join(' | ')} |`;
    const separator = `| ${this.#headers
      .map(
        (header, columnIndex) =>
          `${header.align === 'left' ? ':' : ''}${'-'.repeat(columnsLength[columnIndex] - 1)}${header.align === 'right' ? ':' : ''}`,
      )
      .join(' | ')} |`;
    const rows = this.#rows
      .map(
        (row) =>
          `| ${row
            .map((cell, columnIndex) =>
              this.#headers[columnIndex].align === 'left'
                ? cell.padEnd(columnsLength[columnIndex], ' ')
                : cell.padStart(columnsLength[columnIndex], ' '),
            )
            .join(' | ')} |`,
      )
      .join('\n');

    return `${headers}\n${separator}\n${rows}\n\n`;
  }
}
