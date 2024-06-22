import type { Node, SourceFile } from 'ts-morph';

/**
 * A Svelte 4 prop.
 */
export class Svelte4Prop {
  /**
   * The name of the prop.
   */
  readonly name: string;

  /**
   * Create a new Svelte 4 prop.
   */
  constructor(name: string) {
    this.name = name;
  }
}

/**
 * Resolve the Svelte 4 props of a component.
 */
export function resolveSvelte4Props(node: Node): Svelte4Prop[] {
  const props: Svelte4Prop[] = [];

  for (const symbol of node.getType().getProperties()) {
    props.push(new Svelte4Prop(symbol.getName()));
  }

  return props;
}

/**
 * Resolve the node of the props symbol.
 */
export function resolveSvelte4PropsNode(propsSymbol: string, sourceFile: SourceFile): Node | null {
  const interfaceDeclaration = sourceFile.getInterface(propsSymbol) ?? null;
  const typeAliasDeclaration = sourceFile.getTypeAlias(propsSymbol) ?? null;

  if (interfaceDeclaration && typeAliasDeclaration) {
    throw new Error(
      `Ambiguous props symbol: "${propsSymbol}". Found both an interface and a type alias.`,
    );
  }

  const node = interfaceDeclaration ?? typeAliasDeclaration ?? null;

  return node;
}
