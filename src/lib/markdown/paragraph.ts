import { Node } from './internal.js';

export class Paragraph extends Node {
  /**
   * The text of the heading.
   */
  #text: string;

  /**
   * Create a new heading.
   */
  constructor(text: string) {
    super();

    this.#text = text;
  }

  toString() {
    return `\n${this.#text.trim()}\n\n`;
  }
}
