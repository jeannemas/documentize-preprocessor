import { InlineNode } from './internal.js';

/**
 * A text node in a markdown document.
 */
export class Text extends InlineNode {
  /**
   * The text of the node.
   */
  #text: string;

  /**
   * Create a new text node.
   */
  constructor(text: string) {
    super();

    this.#text = text;
  }

  /**
   * Convert the text node to a markdown string.
   */
  override asString(): string {
    const text = this.#text;

    return `${text}`;
  }
}
