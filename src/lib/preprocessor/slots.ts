import type { SourceFile } from 'ts-morph';

import type { ResolvedComponentConfig, ResolvedConfig } from './config.js';

export type Svelte4Slot = {
  /**
   * The name of the slot.
   */
  name: string;
  properties: {
    /**
     * The name of the property.
     */
    name: string;
  }[];
};

/**
 * Resolve the Svelte 4 slots of a component.
 */
export function resolveSvelte4Slots(
  filename: string,
  resolvedComponentConfig: ResolvedComponentConfig,
  resolvedConfig: ResolvedConfig,
  sourceFile: SourceFile,
): Svelte4Slot[] {
  const slots: Svelte4Slot[] = [];
  const node =
    sourceFile.getTypeAlias(resolvedComponentConfig.slots) ??
    sourceFile.getInterface(resolvedComponentConfig.slots);

  if (!node) {
    if (resolvedConfig.debug) {
      console.warn(
        `Failed to resolve slots for symbol '${resolvedComponentConfig.slots}' inside '${filename}'`,
      );
    }

    return slots;
  }

  for (const symbol of node.getType().getProperties()) {
    const properties: Svelte4Slot['properties'] = [];

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
