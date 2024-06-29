import { parseAttributes, type Attribute } from './attributes.js';
import type { DataAttribute } from './config.js';

/**
 * The meta tag of a component.
 */
export class MetaTag {
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
  constructor({ attributes, regex }: Pick<MetaTag, 'attributes' | 'regex'>) {
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
export function extractMetaTag(
  content: string,
  globalDataAttribute: DataAttribute,
): MetaTag | null {
  const metaRegex = new RegExp(`(<meta\\s+(${globalDataAttribute}[^>]*?)>)`, 'g');
  const metaTags: MetaTag[] = [];

  for (const execArray of content.matchAll(metaRegex)) {
    const [, , rawAttributes] = execArray;

    metaTags.push(
      new MetaTag({
        attributes: parseAttributes(rawAttributes),
        regex: metaRegex,
      }),
    );
  }

  if (metaTags.length > 1) {
    throw new Error('Multiple meta tags found.');
  }

  return metaTags.at(0) ?? null;
}
