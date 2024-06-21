import { describe, expect, it } from 'vitest';

import { resolveConfig } from './config.js';
import { extractMeta } from './meta.js';

const resolvedConfig = resolveConfig({});
const sampleMeta = `
<meta
  ${resolvedConfig.dataAttributes.global}
/>
`;
const sampleValidComponentWithMeta = `
Foo bar baz

${sampleMeta}

Lorem ipsum
`;
const sampleValidComponentWithoutMeta = `
Foo bar baz

Lorem ipsum
`;
const sampleInvalidComponentWithMultipleMeta = `
${sampleMeta}

Foo bar baz

${sampleMeta}

Lorem ipsum
`;

describe(extractMeta.name, () => {
  it('Should extract the meta', () => {
    // Arrange
    const content = sampleValidComponentWithMeta;

    // Act
    const meta = extractMeta(content, resolvedConfig.dataAttributes.global);

    // Assert
    expect(meta).not.toBeNull();
  });

  it('Should extract nothing', () => {
    // Arrange
    const content = sampleValidComponentWithoutMeta;

    // Act
    const script = extractMeta(content, resolvedConfig.dataAttributes.global);

    // Assert
    expect(script).toBeNull();
  });

  it('Should throw an error', () => {
    // Arrange
    const content = sampleInvalidComponentWithMultipleMeta;

    // Act
    const action = () => extractMeta(content, resolvedConfig.dataAttributes.global);

    // Assert
    expect(action).toThrow(Error);
  });
});
