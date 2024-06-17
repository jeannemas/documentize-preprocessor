import { MarkdownNode } from './internal.js';

/**
 * A paragraph in a markdown document.
 */
export class Paragraph extends MarkdownNode {
  /**
   * The text of the paragraph.
   */
  #text: string;

  /**
   * Create a new paragraph.
   */
  constructor(text: string) {
    super();

    if (typeof text !== 'string') {
      throw new TypeError(`Invalid paragraph text: "${text}". Expected a string.`);
    }

    this.#text = text;
  }

  /**
   * Convert the paragraph to a string.
   */
  toString() {
    return `\n${this.#text}\n\n`;
  }
}
