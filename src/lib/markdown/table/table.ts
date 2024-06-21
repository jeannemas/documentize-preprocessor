import * as Markdown from '$lib/markdown/index.js';

import { MarkdownNode } from '../internal.js';

/**
 * A table in a markdown document.
 */
export class Table extends MarkdownNode {
  /**
   * The columns of the table.
   */
  #columns: Markdown.Table.Column[];
  /**
   * The rows of the table.
   */
  #rows: Markdown.Table.Row[];

  /**
   * Create a new table.
   */
  constructor(columns: Markdown.Table.Column[], rows: Markdown.Table.Row[]) {
    super();

    this.#columns = columns;
    this.#rows = rows;
  }

  /**
   * Convert the table to a string.
   */
  override asString(): string {
    const columns = this.#columns;
    const rows = this.#rows;
    const lines: string[] = [];

    lines.push(
      `| ${columns.map((column) => column.asString()).join(' | ')} |`,
      `| ${columns.map(({ alignment }) =>
        alignment === 'left' ? ':--' : alignment === 'right' ? '--:' : '---',
      )} |`,
    );

    for (const row of rows) {
      lines.push(`| ${row.asString()} |`);
    }

    return `\n${lines.join('\n').trim()}\n\n`;
  }
}
