import type { Attributes } from './attributes.js';
import type { ResolvedConfig } from './config.js';

/**
 * Resolve the description of a component.
 */
export function resolveDescription(attributes: Attributes, resolvedConfig: ResolvedConfig): string {
  return attributes[resolvedConfig.dataAttributes.description] ?? '';
}
