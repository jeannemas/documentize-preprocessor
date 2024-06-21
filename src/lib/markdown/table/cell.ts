import { ContainerNode, type InlineNode } from '../internal.js';

/**
 * A table cell in a markdown document.
 */
export class Cell extends ContainerNode<InlineNode> {
  /**
   * Convert the cell to a string.
   */
  override asString(): string {
    const nodes = this._nodes;
    const markdown = nodes.map((node) => node.asString()).join(' ');

    return markdown;
  }
}
