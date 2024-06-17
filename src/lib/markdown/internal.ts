export class MarkdownNode {
  /**
   * Convert the node to a string.
   */
  toString(): string {
    throw new Error('Not implemented');
  }
}
export class Container extends MarkdownNode {
  /**
   * The nodes in the container.
   */
  protected _nodes: MarkdownNode[] = [];

  /**
   * Add nodes to the container.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  add(...nodes: MarkdownNode[]): this {
    throw new Error('Not implemented');
  }
}
