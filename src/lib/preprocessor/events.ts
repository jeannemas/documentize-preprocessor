import { InterfaceDeclaration, type TypeAliasDeclaration } from 'ts-morph';

import { extractProperties } from './types.js';

/**
 * A Svelte 4 event.
 */
export class Svelte4Event {
  /**
   * The name of the event.
   */
  readonly name: string;

  /**
   * Create a new Svelte 4 event.
   */
  constructor({ name }: Pick<Svelte4Event, 'name'>) {
    this.name = name;
  }
}

/**
 * Resolve the Svelte 4 events of a component.
 */
export function resolveSvelte4Events(
  interfaceOrTypeAlias: InterfaceDeclaration | TypeAliasDeclaration,
): Svelte4Event[] {
  const events: Svelte4Event[] = [];
  const type = interfaceOrTypeAlias.getType();

  for (const property of extractProperties(type)) {
    const event = new Svelte4Event({
      name: property.name,
    });

    events.push(event);
  }

  return events;
}
