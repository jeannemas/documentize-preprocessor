import { ContainerNode, type MarkdownNode } from './internal.js';

import * as Markdown from '$lib/markdown/index.js';

/**
 * A section in a markdown document.
 */
export class Section extends ContainerNode<MarkdownNode> {
  /**
   * Create a new section.
   */
  constructor(heading: Markdown.Heading, ...nodes: MarkdownNode[]) {
    super(heading, ...nodes);
  }

  /**
   * Convert the section to a string.
   */
  override asString(): string {
    const nodes = this._nodes;
    const markdown = nodes.map((node) => node.asString()).join('');

    return markdown;
  }
}
