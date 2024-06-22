import { describe, expect, it } from 'vitest';

import { resolveConfig } from './config.js';
import { Meta, extractMeta } from './meta.js';

const resolvedConfig = resolveConfig({});
const sampleMeta = `
<meta
  ${resolvedConfig.dataAttributes.global}
/>
`;

describe(extractMeta.name, () => {
  it('Should extract the meta', () => {
    // Arrange
    const content = `
Foo bar baz

${sampleMeta}

Lorem ipsum
`;

    // Act
    const meta = extractMeta(content, resolvedConfig.dataAttributes.global);

    // Assert
    expect(meta).not.toBeNull();
    expect(meta).toBeInstanceOf(Meta);
  });

  it('Should extract nothing', () => {
    // Arrange
    const content = `
Foo bar baz

Lorem ipsum
`;

    // Act
    const script = extractMeta(content, resolvedConfig.dataAttributes.global);

    // Assert
    expect(script).toBeNull();
  });

  it('Should throw an error', () => {
    // Arrange
    const content = `
${sampleMeta}

Foo bar baz

${sampleMeta}

Lorem ipsum
`;

    // Act
    const action = () => extractMeta(content, resolvedConfig.dataAttributes.global);

    // Assert
    expect(action).toThrow(Error);
  });
});
