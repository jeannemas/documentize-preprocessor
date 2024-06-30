import { ContainerNode, type InlineNode } from './internal.js';

/**
 * The levels of a heading.
 */
export const headingLevels = [1, 2, 3, 4, 5, 6] as const;

/**
 * The level of a heading.
 */
export type HeadingLevel = (typeof headingLevels)[number];

/**
 * A heading in a markdown document.
 */
export class Heading extends ContainerNode<InlineNode> {
  /**
   * The level of the heading.
   *
   * For example, `1` for an `<h1>`, `2` for an `<h2>`, etc.
   */
  #level: HeadingLevel;

  /**
   * Create a new heading.
   */
  constructor(level: HeadingLevel, ...nodes: InlineNode[]) {
    super(...nodes);

    if (!headingLevels.includes(level)) {
      throw new TypeError(
        `Invalid heading level: ${level}. Expected a number between ${headingLevels.map((headingLevel) => `\`${headingLevel}\``).join(', ')}.`,
      );
    }

    this.#level = level;
  }

  /**
   * Convert the heading to a string.
   */
  override asString(): string {
    const nodes = this._nodes;
    const markdown = nodes.map((node) => node.asString()).join(' ');

    return `\n${'#'.repeat(this.#level)} ${markdown.trim()}\n`;
  }
}
