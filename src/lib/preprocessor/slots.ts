import type { Node, SourceFile } from 'ts-morph';

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
  constructor(name: string) {
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
  constructor(name: string, properties: Svelte4SlotProperty[]) {
    this.name = name;
    this.properties = properties;
  }
}

/**
 * Resolve the Svelte 4 slots of a component.
 */
export function resolveSvelte4Slots(node: Node): Svelte4Slot[] {
  const slots: Svelte4Slot[] = [];

  for (const symbol of node.getType().getProperties()) {
    const properties: Svelte4SlotProperty[] = [];

    for (const prop of symbol.getValueDeclarationOrThrow().getType().getProperties()) {
      properties.push(new Svelte4SlotProperty(prop.getName()));
    }

    slots.push(new Svelte4Slot(symbol.getName(), properties));
  }

  return slots;
}

/**
 * Resolve the node of the slots symbol.
 */
export function resolveSvelte4SlotsNode(slotsSymbol: string, sourceFile: SourceFile): Node | null {
  const interfaceDeclaration = sourceFile.getInterface(slotsSymbol) ?? null;
  const typeAliasDeclaration = sourceFile.getTypeAlias(slotsSymbol) ?? null;

  if (interfaceDeclaration && typeAliasDeclaration) {
    throw new Error(
      `Ambiguous slots symbol: "${slotsSymbol}". Found both an interface and a type alias.`,
    );
  }

  const node = interfaceDeclaration ?? typeAliasDeclaration ?? null;

  return node;
}
