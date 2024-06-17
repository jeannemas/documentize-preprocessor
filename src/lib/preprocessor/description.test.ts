import { describe, expect, it } from 'vitest';

import { resolveConfig } from './config.js';
import { defaultDescription, resolveDescription } from './description.js';

describe(resolveDescription.name, () => {
  it('Should resolve using the default description', () => {
    // Arrange
    const resolvedConfig = resolveConfig({});
    const attributes = {};

    // Act
    const description = resolveDescription(attributes, resolvedConfig);

    // Assert
    expect(description).toEqual(defaultDescription);
  });

  it('Should resolve using the provided description', () => {
    // Arrange
    const resolvedConfig = resolveConfig({});
    const attributes = {
      [resolvedConfig.dataAttributes.description]: 'This is a description',
    };

    // Act
    const description = resolveDescription(attributes, resolvedConfig);

    // Assert
    expect(description).toEqual(attributes[resolvedConfig.dataAttributes.description]);
  });
});
