import type { Type } from 'ts-morph';

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
  constructor({ name, type }: Pick<Property, 'name' | 'type'>) {
    this.name = name;
    this.type = type;
  }
}

/**
 * Extract the properties of a node.
 */
export function extractProperties(type: Type): Property[] {
  const properties: Property[] = [];

  for (const symbol of type.getProperties()) {
    const property = new Property({
      name: symbol.getName(),
      type: symbol.getDeclaredType().getText(),
    });

    properties.push(property);
  }

  return properties;
}
