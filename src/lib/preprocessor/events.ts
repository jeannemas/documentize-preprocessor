import type { Node, SourceFile } from 'ts-morph';

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

/**
 * Resolve the node of the events symbol.
 *
 * @throws If the events symbol is ambiguous (i.e., both an interface and a type alias are found).
 */
export function resolveSvelte4EventsNode(
  eventsSymbol: string,
  sourceFile: SourceFile,
): Node | null {
  const interfaceDeclaration = sourceFile.getInterface(eventsSymbol) ?? null;
  const typeAliasDeclaration = sourceFile.getTypeAlias(eventsSymbol) ?? null;

  if (interfaceDeclaration && typeAliasDeclaration) {
    throw new Error(
      `Ambiguous events symbol: "${eventsSymbol}". Found both an interface and a type alias.`,
    );
  }

  const node = interfaceDeclaration ?? typeAliasDeclaration ?? null;

  return node;
}
