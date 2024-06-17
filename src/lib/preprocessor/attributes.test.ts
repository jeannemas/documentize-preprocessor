import { describe, expect, it } from 'vitest';

import { parseAttributes } from './attributes.js';

describe(parseAttributes.name, () => {
  it('Should parse the attributes', () => {
    // Arrange
    const rawAttributes = 'a="foo" b="bar" c="baz" d';

    // Act
    const attributes = parseAttributes(rawAttributes);

    // Assert
    expect(Object.keys(attributes).length).toEqual(4);
    expect(attributes.a).toEqual('foo');
    expect(attributes.b).toEqual('bar');
    expect(attributes.c).toEqual('baz');
    expect(attributes.d).toEqual('');
  });

  it('Should be able to parse attributes without values', () => {
    // Arrange
    const rawAttributes = 'a b c';

    // Act
    const attributes = parseAttributes(rawAttributes);

    // Assert
    expect(Object.keys(attributes).length).toEqual(3);
    expect(attributes).toHaveProperty('a', '');
    expect(attributes).toHaveProperty('b', '');
    expect(attributes).toHaveProperty('c', '');
    expect(attributes.a).toEqual('');
    expect(attributes.b).toEqual('');
    expect(attributes.c).toEqual('');
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
