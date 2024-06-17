import type { SourceFile } from 'ts-morph';

import type { ResolvedComponentConfig, ResolvedConfig } from './config.js';

export type Svelte4Event = {
  /**
   * The name of the event.
   */
  name: string;
};

/**
 * Resolve the Svelte 4 events of a component.
 */
export function resolveSvelte4Events(
  filename: string,
  resolvedComponentConfig: ResolvedComponentConfig,
  resolvedConfig: ResolvedConfig,
  sourceFile: SourceFile,
): Svelte4Event[] {
  const events: Svelte4Event[] = [];
  const node =
    sourceFile.getTypeAlias(resolvedComponentConfig.events) ??
    sourceFile.getInterface(resolvedComponentConfig.events);

  if (!node) {
    if (resolvedConfig.debug) {
      console.warn(
        `Failed to resolve events for symbol '${resolvedComponentConfig.events}' inside '${filename}'`,
      );
    }

    return events;
  }

  for (const symbol of node.getType().getProperties()) {
    events.push({
      name: symbol.getName(),
    });
  }

  return events;
}
