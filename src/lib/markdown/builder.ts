import { ContainerNode, type MarkdownNode } from './internal.js';

/**
 * A builder for markdown documents.
 */
export class Builder extends ContainerNode<MarkdownNode> {
  /**
   * Convert the nodes to markdown
   */
  override asString(): string {
    const nodes = this._nodes;
    const markdown = nodes.map((node) => node.asString()).join('');

    return `${markdown}`;
  }
}
