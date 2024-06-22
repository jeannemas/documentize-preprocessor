import { parseAttributes, type Attribute } from './attributes.js';
import type { DataAttribute } from './config.js';

/**
 * The meta tag of a component.
 */
export class Meta {
  /**
   * The attributes of the meta tag.
   */
  readonly attributes: Attribute[];
  /**
   * The regex to interact with the meta tag from the content.
   */
  readonly regex: RegExp;

  /**
   * Create a new meta tag.
   */
  constructor(attributes: Attribute[], regex: RegExp) {
    this.attributes = attributes;
    this.regex = regex;
  }
}

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

    metas.push(new Meta(parseAttributes(rawAttributes), metaRegex));
  }

  if (metas.length > 1) {
    throw new Error('Multiple meta tags found.');
  }

  return metas.at(0) ?? null;
}
