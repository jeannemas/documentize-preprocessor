import { MarkdownNode } from './internal.js';

/**
 * The level of a heading.
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * A heading in a markdown document.
 */
export class Heading extends MarkdownNode {
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

    if (![1, 2, 3, 4, 5, 6].includes(level)) {
      throw new TypeError(`Invalid heading level: ${level}. Expected a number between 1 and 6.`);
    }

    if (typeof text !== 'string') {
      throw new TypeError(`Invalid heading text: "${text}". Expected a string.`);
    }

    this.#level = level;
    this.#text = text;
  }

  /**
   * Convert the heading to a string.
   */
  toString() {
    return `${'#'.repeat(this.#level)} ${this.#text}\n`;
  }
}
