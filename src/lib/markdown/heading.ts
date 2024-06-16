import { Node } from './internal.js';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export class Heading extends Node {
  /**
   * The level of the heading.
   * For example, `1` for an `<h1>`, `2` for an `<h2>`, etc.
   */
  #level: HeadingLevel;
  /**
   * The text of the heading.
   */
  #text: string;

  /**
   * Create a new heading.
   */
  constructor(level: HeadingLevel, text: string) {
    super();

    this.#level = level;
    this.#text = text;
  }

  toString() {
    return `${'#'.repeat(this.#level)} ${this.#text}\n`;
  }
}
