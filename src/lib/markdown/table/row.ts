import * as Markdown from '$lib/markdown/index.js';

import { ContainerNode } from '../internal.js';

/**
 * A table row in a markdown document.
 */
export class Row extends ContainerNode<Markdown.Table.Cell> {
  /**
   * Convert the row to a string.
   */
  override asString(): string {
    const nodes = this._nodes;
    const markdown = nodes.map((node) => node.asString()).join(' | ');

    return markdown;
  }
}
