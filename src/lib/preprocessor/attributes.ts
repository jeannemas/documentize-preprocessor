/**
 * The regex used to parse attributes.
 *
 * - group `rawAttribute` is the full attribute string.
 * - group `rawName` is the name of the attribute.
 * - group `rawValue1` is the single quoted value of the attribute.
 * - group `rawValue2` is the double quoted value of the attribute.
 */
const attributeRegex =
  /(?<rawAttribute>(?<rawName>[a-zA-Z_-][a-zA-Z0-9_-]*)(?:=(?:'(?<rawValue1>[\s\S]*?)'|"(?<rawValue2>[\s\S]*?)"))?)/g;

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
 * @param attributesString The string of attributes.
 * @param defaultValue The default value of an attribute. If the attribute does not have a value when parsed, this value will be used as the `value` property. Default is an empty string `""`.
 * @throws {Error} When a duplicate attribute is found.
 */
export function parseAttributes(attributesString: string, defaultValue = ''): Attribute[] {
  const attributes: Attribute[] = [];

  for (const execArray of attributesString.matchAll(attributeRegex)) {
    // We extract 2 raw values, since the values can be either single or double quoted.
    // `rawValue1` is the single quoted value.
    // `rawValue2` is the double quoted value.
    const { rawName, rawValue1, rawValue2 } = execArray.groups!;
    const attributeAlreadyPresent = attributes.some((attribute) => attribute.name === rawName);

    if (attributeAlreadyPresent) {
      throw new Error(`Duplicate attribute "${rawName}" found. This is not valid HTML.`);
    }

    const attribute = new Attribute(rawName, rawValue1 || rawValue2 || defaultValue);

    attributes.push(attribute);
  }

  return attributes;
}
