import { describe, expect, it } from 'vitest';

import { generateAlphabeat } from '$lib/utils/alphabeat.js';
import { randomInteger } from '$lib/utils/numbers.js';
import { randomString } from '$lib/utils/strings.js';

import { Attribute, parseAttributes } from './attributes.js';

/**
 * Compile the attributes into a string.
 *
 * This is roughly the opposite of `parseAttributes`.
 */
export function compileAttributesIntoString(attributes: Attribute[]): string {
  const strings: string[] = [];

  for (const attribute of attributes) {
    if (attribute.value) {
      // If the value is not empty, add the attribute with the value.
      const value = JSON.stringify(attribute.value); // The value is stringified to handle quotes escaping.

      strings.push(`${attribute.name}=${value}`);
    } else {
      // If the value is empty, add the attribute without the value.
      strings.push(attribute.name);
    }
  }

  return strings.join(' ');
}

describe(parseAttributes.name, () => {
  it('Should parse the attributes', () => {
    // Arrange
    const attributesCount = randomInteger({
      max: 10,
      min: 5,
    });
    const attributes = Array.from(
      { length: attributesCount },
      () =>
        new Attribute(
          randomString({
            alphabeat: generateAlphabeat('a', 'z'),
            length: 16,
          }), // Random name
          randomString({
            alphabeat: generateAlphabeat('a', 'z'),
            length: 16,
          }), // Random value
        ),
    );
    const attributesNames = attributes.map(({ name }) => name);
    const attributesString = compileAttributesIntoString(attributes);

    // Act
    const parsedAttributes = parseAttributes(attributesString);

    // Assert
    expect(parsedAttributes).toBeInstanceOf(Array);
    expect(parsedAttributes).toHaveLength(attributesCount);

    for (const attribute of parsedAttributes) {
      expect(attribute).toBeInstanceOf(Attribute);
      expect(attributesNames).toContain(attribute.name);
    }
  });

  it('Should be able to parse attributes without values', () => {
    // Arrange
    const attributesCount = randomInteger({
      max: 10,
      min: 5,
    });
    const attributes = Array.from(
      { length: attributesCount },
      () =>
        new Attribute(
          randomString({
            alphabeat: generateAlphabeat('a', 'z'),
            length: 16,
          }),
          '',
        ),
    );
    const attributesNames = attributes.map(({ name }) => name);
    const attributesString = compileAttributesIntoString(attributes);

    // Act
    const parsedAttributes = parseAttributes(attributesString);

    // Assert
    expect(parsedAttributes).toBeInstanceOf(Array);
    expect(parsedAttributes).toHaveLength(attributesCount);

    for (const attribute of parsedAttributes) {
      expect(attribute).toBeInstanceOf(Attribute);
      expect(attributesNames).toContain(attribute.name);
    }
  });

  it('Should throw an error', () => {
    // Arrange
    const attributes = [new Attribute('a', 'foo'), new Attribute('a', 'bar')] satisfies Attribute[];
    const rawAttributes = compileAttributesIntoString(attributes);

    // Act
    const action = () => parseAttributes(rawAttributes);

    // Assert
    expect(action).toThrow(Error);
  });
});
