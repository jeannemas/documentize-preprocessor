import type { InterfaceDeclaration, TypeAliasDeclaration } from 'ts-morph';

import { extractProperties } from './types.js';

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
  constructor({ name }: Pick<Svelte4Prop, 'name'>) {
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
  const type = interfaceOrTypeAlias.getType();

  for (const property of extractProperties(type)) {
    const prop = new Svelte4Prop({
      name: property.name,
    });

    props.push(prop);
  }

  return props;
}
