const attributeRegex = /(([a-zA-Z_-][a-zA-Z0-9_-]*)(?:=(?:'([\s\S]*?)'|"([\s\S]*?)"))?)/g;

/**
 * The default value of an attribute.
 *
 * If the attribute does not have a value, this value will be used.
 */
export const defaultAttributeValue = '';

/**
 * Attribute of an element.
 */
export class Attribute {
  /**
   * The name of the attribute.
   */
  readonly name: string;
  /**
   * The value of the attribute.
   */
  readonly value: string;

  /**
   * Create a new attribute.
   */
  constructor(name: string, value: string) {
    this.name = name;
    this.value = value;
  }
}

/**
 * Parse the attributes of an element from a string.
 *
 * @throws {Error} When a duplicate attribute is found.
 */
export function parseAttributes(attributesString: string): Attribute[] {
  const attributes: Attribute[] = [];

  for (const execArray of attributesString.matchAll(attributeRegex)) {
    const [, , rawName, rawValue1, rawValue2] = execArray;

    if (attributes.some(({ name }) => name === rawName)) {
      throw new Error(`Duplicate attribute "${rawName}". This is not valid HTML.`);
    }

    attributes.push(new Attribute(rawName, rawValue1 || rawValue2 || defaultAttributeValue));
  }

  return attributes;
}
