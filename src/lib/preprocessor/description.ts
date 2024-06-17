import type { ResolvedConfig } from './config.js';

/**
 * Resolve the description of a component.
 */
export function resolveDescription(
  attributes: NamedNodeMap,
  resolvedConfig: ResolvedConfig,
): string {
  return attributes.getNamedItem(resolvedConfig.dataAttributes.description)?.textContent ?? '';
}
