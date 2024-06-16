import { Node } from './internal.js';

/**
 * @typedef {{
 * 	align: 'left' | 'right';
 *  text: string;
 * }} TableHeader
 */

export class Table extends Node {
	/**
	 * The headers of the table.
	 *
	 * @type {TableHeader[]}
	 */
	#headers;
	/**
	 * The rows of the table.
	 *
	 * @type {string[][]}
	 */
	#rows;

	/**
	 * Create a new table.
	 *
	 * @param {TableHeader[]} headers
	 * @param {string[][]} rows
	 */
	constructor(headers, rows) {
		super();

		this.#headers = headers;
		this.#rows = rows;
	}

	toString() {
		const colsLength = this.#headers.map((header) => header.text.length);

		for (const row of this.#rows) {
			for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
				colsLength[columnIndex] = Math.max(colsLength[columnIndex], row[columnIndex].length);
			}
		}

		const headers = `| ${this.#headers.map((header, columnIndex) => header.text.padEnd(colsLength[columnIndex], ' ')).join(' | ')} |`;
		const separator = `| ${this.#headers
			.map(
				(header, columnIndex) =>
					`${header.align === 'left' ? ':' : ''}${'-'.repeat(colsLength[columnIndex] - 1)}${header.align === 'right' ? ':' : ''}`
			)
			.join(' | ')} |`;
		const rows = this.#rows
			.map(
				(row) =>
					`| ${row
						.map((cell, columnIndex) =>
							this.#headers[columnIndex].align === 'left'
								? cell.padEnd(colsLength[columnIndex], ' ')
								: cell.padStart(colsLength[columnIndex], ' ')
						)
						.join(' | ')} |`
			)
			.join('\n');

		return `${headers}\n${separator}\n${rows}\n\n`;
	}
}
