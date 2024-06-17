import type { Node } from 'ts-morph';

/**
 * A Svelte 4 event.
 */
export type Svelte4Event = {
  /**
   * The name of the event.
   */
  name: string;
};

/**
 * Resolve the Svelte 4 events of a component.
 */
export function resolveSvelte4Events(node: Node): Svelte4Event[] {
  const events: Svelte4Event[] = [];

  for (const symbol of node.getType().getProperties()) {
    events.push({
      name: symbol.getName(),
    });
  }

  return events;
}
