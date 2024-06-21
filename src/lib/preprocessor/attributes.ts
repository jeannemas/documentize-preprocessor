const attributeRegex = /(([a-zA-Z_-][a-zA-Z0-9_-]*)(?:=(?:'([\s\S]*?)'|"([\s\S]*?)"))?)/g;

/**
 * The default value of an attribute.
 *
 * If the attribute does not have a value, this value will be used.
 */
export const defaultAttributeValue = '';

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
      throw new Error(`Duplicate attribute "${rawName}". This is not valid HTML.`);
    }

    attributes[rawName] = rawValue1 || rawValue2 || defaultAttributeValue;
  }

  return attributes;
}
