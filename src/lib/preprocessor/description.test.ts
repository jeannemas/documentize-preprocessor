import { describe, expect, it } from 'vitest';

import { generateRandomString } from '$lib/test-utils.js';

import { Attribute } from './attributes.js';
import { resolveConfig } from './config.js';
import { defaultDescription, resolveDescription } from './description.js';

describe(resolveDescription.name, () => {
  it('Should resolve using the default description', () => {
    // Arrange
    const resolvedConfig = resolveConfig();
    const attributes = [] satisfies Attribute[];

    // Act
    const description = resolveDescription(attributes, resolvedConfig);

    // Assert
    expect(description).toEqual(defaultDescription);
  });

  it('Should resolve using the provided description', () => {
    // Arrange
    const resolvedConfig = resolveConfig();
    const descriptionAttribute = new Attribute(
      resolvedConfig.dataAttributes.description,
      generateRandomString(),
    );
    const attributes = [descriptionAttribute] satisfies Attribute[];

    // Act
    const description = resolveDescription(attributes, resolvedConfig);

    // Assert
    expect(description).toEqual(descriptionAttribute.value);
  });
});
