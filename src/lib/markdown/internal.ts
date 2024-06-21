/**
 * A markdown node.
 */
export abstract class MarkdownNode {
  /**
   * Convert the node to a string.
   */
  abstract asString(): string;
}

/**
 * A container node.
 */
export abstract class ContainerNode<TNodes extends MarkdownNode> extends MarkdownNode {
  /**
   * The child nodes in the block.
   */
  protected _nodes: TNodes[] = [];

  /**
   * Create a new container node.
   */
  constructor(...nodes: TNodes[]) {
    super();

    this.add(...nodes);
  }

  /**
   * Add nodes to the block.
   */
  add(...nodes: TNodes[]): this {
    this._nodes.push(...nodes);

    return this;
  }
}

/**
 * An inline node.
 */
export abstract class InlineNode extends MarkdownNode {}
