import { Node } from './internal.js';

export class Paragraph extends Node {
	/**
	 * The text of the heading.
	 *
	 * @type {string}
	 */
	#text;

	/**
	 * Create a new heading.
	 *
	 * @param {string} text
	 */
	constructor(text) {
		super();

		this.#text = text;
	}

	toString() {
		return `\n${this.#text.trim()}\n\n`;
	}
}
