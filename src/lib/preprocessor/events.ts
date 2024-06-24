import { InterfaceDeclaration, type TypeAliasDeclaration } from 'ts-morph';

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
  constructor(name: string) {
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

  if (interfaceOrTypeAlias instanceof InterfaceDeclaration) {
    const interfaceDeclaration = interfaceOrTypeAlias;
    const propertySignatures = interfaceDeclaration.getProperties();

    for (const propertySignature of propertySignatures) {
      const event = new Svelte4Event(propertySignature.getName());

      events.push(event);
    }
  } else {
    const typeAliasDeclaration = interfaceOrTypeAlias;

    for (const symbol of typeAliasDeclaration.getType().getProperties()) {
      const event = new Svelte4Event(symbol.getName());

      events.push(event);
    }
  }

  return events;
}
