export class Node {
  /**
   * Convert the node to a string.
   *
   * @returns {string}
   */
  toString() {
    throw new Error('Not implemented');
  }
}
export class Container extends Node {
  /**
   * The nodes in the container.
   *
   * @protected
   * @type {Node[]}
   */
  _nodes = [];

  /**
   * Add nodes to the container.
   *
   * @param  {...Node} nodes
   * @returns {this}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  add(...nodes) {
    throw new Error('Not implemented');
  }
}
