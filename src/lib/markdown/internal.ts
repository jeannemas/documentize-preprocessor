export class Node {
  /**
   * Convert the node to a string.
   */
  toString(): string {
    throw new Error('Not implemented');
  }
}
export class Container extends Node {
  /**
   * The nodes in the container.
   */
  protected _nodes: Node[] = [];

  /**
   * Add nodes to the container.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  add(...nodes: Node[]): this {
    throw new Error('Not implemented');
  }
}
