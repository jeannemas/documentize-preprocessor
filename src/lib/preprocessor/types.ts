import type { Node } from 'ts-morph';

/**
 * A property.
 */
export class Property {
  /**
   * The name of the property.
   */
  readonly name: string;
  /**
   * The type of the property.
   */
  readonly type: string;

  /**
   * Create a new property.
   */
  constructor(name: string, type: string) {
    this.name = name;
    this.type = type;
  }
}

/**
 * Extract the properties of a node.
 */
export function extractProperties(node: Node): Property[] {
  const type = node.getType();
  const properties: Property[] = [];

  for (const symbol of type.getProperties()) {
    const property = new Property(symbol.getName(), symbol.getDeclaredType().getText());

    properties.push(property);
  }

  return properties;
}
