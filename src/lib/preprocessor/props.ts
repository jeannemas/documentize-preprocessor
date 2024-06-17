import type { SourceFile } from 'ts-morph';

import type { ResolvedComponentConfig, ResolvedConfig } from './config.js';

export type Svelte4Prop = {
  /**
   * The name of the prop.
   */
  name: string;
};

/**
 * Resolve the Svelte 4 props of a component.
 */
export function resolveSvelte4Props(
  filename: string,
  resolvedComponentConfig: ResolvedComponentConfig,
  resolvedConfig: ResolvedConfig,
  sourceFile: SourceFile,
): Svelte4Prop[] {
  const props: Svelte4Prop[] = [];
  const node =
    sourceFile.getTypeAlias(resolvedComponentConfig.props) ??
    sourceFile.getInterface(resolvedComponentConfig.props);

  if (!node) {
    if (resolvedConfig.debug) {
      console.warn(
        `Failed to resolve props for symbol '${resolvedComponentConfig.props}' inside '${filename}'`,
      );
    }

    return props;
  }

  for (const symbol of node.getType().getProperties()) {
    props.push({
      name: symbol.getName(),
    });
  }

  return props;
}
