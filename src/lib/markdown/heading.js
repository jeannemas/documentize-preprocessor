import { Node } from './internal.js';

/**
 * @typedef {1 | 2 | 3 | 4 | 5 | 6} HeadingLevel
 */

export class Heading extends Node {
	/**
	 * The level of the heading.
	 * For example, `1` for an `<h1>`, `2` for an `<h2>`, etc.
	 *
	 * @type {HeadingLevel}
	 */
	#level;
	/**
	 * The text of the heading.
	 *
	 * @type {string}
	 */
	#text;

	/**
	 * Create a new heading.
	 *
	 * @param {HeadingLevel} level
	 * @param {string} text
	 */
	constructor(level, text) {
		super();

		this.#level = level;
		this.#text = text;
	}

	toString() {
		return `${'#'.repeat(this.#level)} ${this.#text}\n`;
	}
}
