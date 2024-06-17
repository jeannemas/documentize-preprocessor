import type { Node } from 'ts-morph';

/**
 * A Svelte 4 prop.
 */
export type Svelte4Prop = {
  /**
   * The name of the prop.
   */
  name: string;
};

/**
 * Resolve the Svelte 4 props of a component.
 */
export function resolveSvelte4Props(node: Node): Svelte4Prop[] {
  const props: Svelte4Prop[] = [];

  for (const symbol of node.getType().getProperties()) {
    props.push({
      name: symbol.getName(),
    });
  }

  return props;
}
