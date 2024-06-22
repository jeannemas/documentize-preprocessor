import type { Attribute } from './attributes.js';
import type { ResolvedConfig } from './config.js';

/**
 * The default description.
 */
export const defaultDescription = '';

/**
 * Resolve the description of a component.
 */
export function resolveDescription(
  attributes: Attribute[],
  resolvedConfig: ResolvedConfig,
): string {
  return (
    attributes.find(({ name }) => name === resolvedConfig.dataAttributes.description)?.value ??
    defaultDescription
  );
}
