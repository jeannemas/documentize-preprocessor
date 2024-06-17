import type { Node } from 'ts-morph';

/**
 * A Svelte 4 slot property.
 */
export type Svelte4SlotProperty = {
  /**
   * The name of the property.
   */
  name: string;
};

/**
 * A Svelte 4 slot.
 */
export type Svelte4Slot = {
  /**
   * The name of the slot.
   */
  name: string;
  /**
   * The properties of the slot.
   */
  properties: Svelte4SlotProperty[];
};

/**
 * Resolve the Svelte 4 slots of a component.
 */
export function resolveSvelte4Slots(node: Node): Svelte4Slot[] {
  const slots: Svelte4Slot[] = [];

  for (const symbol of node.getType().getProperties()) {
    const properties: Svelte4SlotProperty[] = [];

    for (const prop of symbol.getValueDeclarationOrThrow().getType().getProperties()) {
      properties.push({
        name: prop.getName(),
      });
    }

    slots.push({
      name: symbol.getName(),
      properties,
    });
  }

  return slots;
}
