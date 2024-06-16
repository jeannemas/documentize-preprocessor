import { Container } from './internal.js';

/**
 * @typedef {import('./internal.js').Node} Node
 */

export class Builder extends Container {
  /**
   * Add nodes to the builder.
   *
   * @param  {...Node} nodes
   */
  add(...nodes) {
    this._nodes.push(...nodes);

    return this;
  }

  /**
   * Convert the nodes to markdown
   */
  toString() {
    return this._nodes.map((node) => node.toString()).join('');
  }
}
