import { InlineNode } from './internal.js';

/**
 * A text node in a markdown document.
 */
export class Text extends InlineNode {
  /**
   * The text of the node.
   */
  private readonly _text: string;

  /**
   * Create a new text node.
   */
  constructor(text: string) {
    super();

    this._text = text;
  }

  /**
   * Convert the text node to a markdown string.
   */
  override asString(): string {
    const text = this._text;

    return `${text}`;
  }
}
