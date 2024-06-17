import { parseAttributes, type Attributes } from './attributes.js';
import type { DataAttribute } from './config.js';

/**
 * The meta tag of a component.
 */
export type Meta = {
  /**
   * The attributes of the meta tag.
   */
  attributes: Attributes;
  /**
   * The regex to interact with the meta tag from the content.
   */
  regex: RegExp;
};

/**
 * Extract the meta tag from the content.
 * If no meta are found, returns `null`.
 *
 * @throws {Error} When multiple meta tags are found.
 */
export function extractMeta(content: string, globalDataAttribute: DataAttribute): Meta | null {
  const metaRegex = new RegExp(`(<meta\\s+(${globalDataAttribute}[^>]*?)>)`, 'g');
  const metas: Meta[] = [];

  for (const execArray of content.matchAll(metaRegex)) {
    const [, , rawAttributes] = execArray;

    metas.push({
      attributes: parseAttributes(rawAttributes),
      regex: metaRegex,
    });
  }

  if (metas.length > 1) {
    throw new Error('Multiple meta tags found.');
  }

  return metas.at(0) ?? null;
}

/**
 * Replace the meta tag with the new content.
 */
export function replaceMeta(content: string, meta: Meta, replaceWith: string) {
  const newCode = content.replace(meta.regex, replaceWith);

  return newCode;
}
