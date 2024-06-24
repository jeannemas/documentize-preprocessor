import type { InterfaceDeclaration, TypeAliasDeclaration } from 'ts-morph';

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
export function resolveSvelte4Props(
  interfaceOrTypeAlias: InterfaceDeclaration | TypeAliasDeclaration,
): Svelte4Prop[] {
  const props: Svelte4Prop[] = [];

  for (const symbol of interfaceOrTypeAlias.getType().getProperties()) {
    props.push(new Svelte4Prop(symbol.getName()));
  }

  return props;
}
