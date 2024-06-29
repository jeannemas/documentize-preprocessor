import type { InterfaceDeclaration, TypeAliasDeclaration } from 'ts-morph';

import { extractProperties } from './types.js';

/**
 * A Svelte 4 slot property.
 */
export class Svelte4SlotProperty {
  /**
   * The name of the property.
   */
  readonly name: string;

  /**
   * Create a new Svelte 4 slot property.
   */
  constructor({ name }: Pick<Svelte4SlotProperty, 'name'>) {
    this.name = name;
  }
}

/**
 * A Svelte 4 slot.
 */
export class Svelte4Slot {
  /**
   * The name of the slot.
   */
  readonly name: string;
  /**
   * The properties of the slot.
   */
  readonly properties: Svelte4SlotProperty[];

  /**
   * Create a new Svelte 4 slot.
   */
  constructor({ name, properties }: Pick<Svelte4Slot, 'name' | 'properties'>) {
    this.name = name;
    this.properties = properties;
  }
}

/**
 * Resolve the Svelte 4 slots of a component.
 */
export function resolveSvelte4Slots(
  interfaceOrTypeAlias: InterfaceDeclaration | TypeAliasDeclaration,
): Svelte4Slot[] {
  const slots: Svelte4Slot[] = [];
  const type = interfaceOrTypeAlias.getType();

  for (const property of extractProperties(type)) {
    const properties: Svelte4SlotProperty[] = [];
    const symbol = type.getPropertyOrThrow(property.name);

    for (const declaration of symbol.getDeclarations()) {
      const declarationType = declaration.getType();

      properties.push(
        ...extractProperties(declarationType).map(
          (prop) =>
            new Svelte4SlotProperty({
              name: prop.name,
            }),
        ),
      );
    }

    const slot = new Svelte4Slot({
      name: property.name,
      properties,
    });

    slots.push(slot);
  }

  return slots;
}
