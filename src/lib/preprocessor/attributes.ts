const attributeRegex = /(([a-zA-Z_-][a-zA-Z0-9_-]*)(?:=(?:'([\s\S]*?)'|"([\s\S]*?)"))?)/g;

/**
 * Attributes of an element.
 */
export type Attributes = Record<string, string>;

/**
 * Parse the attributes of an element from a string.
 *
 * @throws {Error} When a duplicate attribute is found.
 */
export function parseAttributes(attributesString: string): Attributes {
  const attributes: Attributes = {};

  for (const execArray of attributesString.matchAll(attributeRegex)) {
    const [, , rawName, rawValue1, rawValue2] = execArray;

    if (rawName in attributes) {
      throw new Error(`Duplicate attribute "${rawName}".`);
    }

    attributes[rawName] = rawValue1 || rawValue2 || '';
  }

  return attributes;
}
