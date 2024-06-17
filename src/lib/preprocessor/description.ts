import type { Attributes } from './attributes.js';
import type { ResolvedConfig } from './config.js';

/**
 * The default description.
 */
export const defaultDescription = '';

/**
 * Resolve the description of a component.
 */
export function resolveDescription(attributes: Attributes, resolvedConfig: ResolvedConfig): string {
  return attributes[resolvedConfig.dataAttributes.description] ?? defaultDescription;
}
