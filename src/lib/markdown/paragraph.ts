import { ContainerNode, type InlineNode } from './internal.js';

/**
 * A paragraph in a markdown document.
 */
export class Paragraph extends ContainerNode<InlineNode> {
  /**
   * Convert the paragraph to a string.
   */
  override asString(): string {
    const nodes = this._nodes;
    const markdown = nodes.map((node) => node.asString()).join(' ');

    return `\n${markdown.trim()}\n\n`;
  }
}
