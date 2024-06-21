import { ContainerNode, type InlineNode } from '../internal.js';

/**
 * The alignments of a table column.
 */
export const alignments = ['left', 'right'] as const;

/**
 * The alignment of a table column.
 */
export type Alignment = (typeof alignments)[number];

/**
 * A table column in a markdown document.
 */
export class Column<TAlignment extends Alignment = Alignment> extends ContainerNode<InlineNode> {
  /**
   * The alignment of the column.
   */
  readonly alignment: TAlignment;

  /**
   * Create a new table column.
   */
  constructor(alignment: TAlignment, ...nodes: InlineNode[]) {
    super(...nodes);

    if (!alignments.includes(alignment)) {
      throw new TypeError(
        `The alignment of the column should be one of ${alignments.map((alignment) => `\`"${alignment}"\``).join(', ')}.`,
      );
    }

    this.alignment = alignment;
  }

  /**
   * Convert the column to a string.
   */
  override asString(): string {
    const nodes = this._nodes;
    const markdown = nodes.map((node) => node.asString()).join(' ');

    return markdown;
  }
}
