import { describe, expect, it } from 'vitest';

import { generateRandomString, randomInt } from '$lib/test-utils.js';

import { Attribute, parseAttributes } from './attributes.js';

describe(parseAttributes.name, () => {
  it('Should parse the attributes', () => {
    // Arrange
    const rawAttributesCount = randomInt(5, 11);
    const rawAttributes = Array.from(
      { length: rawAttributesCount },
      () => new Attribute(generateRandomString(), generateRandomString()),
    );
    const rawAttributesNames = rawAttributes.map(({ name }) => name);
    const rawAttributesString = rawAttributes
      .map(({ name, value }) => `${name}="${value}"`)
      .join(' ');

    // Act
    const attributes = parseAttributes(rawAttributesString);

    // Assert
    expect(attributes).toBeInstanceOf(Array);
    expect(attributes).toHaveLength(rawAttributesCount);

    for (const attribute of attributes) {
      expect(attribute).toBeInstanceOf(Attribute);
      expect(rawAttributesNames).toContain(attribute.name);
    }
  });

  it('Should be able to parse attributes without values', () => {
    // Arrange
    const rawAttributesCount = randomInt(5, 11);
    const rawAttributes = Array.from(
      { length: rawAttributesCount },
      () => new Attribute(generateRandomString(), ''),
    );
    const rawAttributesNames = rawAttributes.map(({ name }) => name);
    const rawAttributesString = rawAttributesNames.join(' ');

    // Act
    const attributes = parseAttributes(rawAttributesString);

    // Assert
    expect(attributes).toBeInstanceOf(Array);
    expect(attributes).toHaveLength(rawAttributesCount);

    for (const attribute of attributes) {
      expect(attribute).toBeInstanceOf(Attribute);
      expect(rawAttributesNames).toContain(attribute.name);
    }
  });

  it('Should throw an error', () => {
    // Arrange
    const rawAttributes = 'a="foo" a="bar"';

    // Act
    const action = () => parseAttributes(rawAttributes);

    // Assert
    expect(action).toThrow(Error);
  });
});
