import { Container, type Node } from './internal.js';

export class Builder extends Container {
  /**
   * Add nodes to the builder.
   */
  add(...nodes: Node[]) {
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