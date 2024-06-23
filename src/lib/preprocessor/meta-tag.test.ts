import { describe, expect, it } from 'vitest';

import { resolveConfig } from './config.js';
import { MetaTag, extractMetaTag } from './meta-tag.js';

const resolvedConfig = resolveConfig();
const sampleMetaTag = `
<meta
  ${resolvedConfig.dataAttributes.global}
/>
`;

describe(extractMetaTag.name, () => {
  it('Should extract the meta tag', () => {
    // Arrange
    const content = `
Foo bar baz

${sampleMetaTag}

Lorem ipsum
`;

    // Act
    const metaTag = extractMetaTag(content, resolvedConfig.dataAttributes.global);

    // Assert
    expect(metaTag).not.toBeNull();
    expect(metaTag).toBeInstanceOf(MetaTag);
  });

  it('Should extract nothing', () => {
    // Arrange
    const content = `
Foo bar baz

Lorem ipsum
`;

    // Act
    const maybeMetaTag = extractMetaTag(content, resolvedConfig.dataAttributes.global);

    // Assert
    expect(maybeMetaTag).toBeNull();
  });

  it('Should throw an error', () => {
    // Arrange
    const content = `
${sampleMetaTag}

Foo bar baz

${sampleMetaTag}

Lorem ipsum
`;

    // Act
    const action = () => extractMetaTag(content, resolvedConfig.dataAttributes.global);

    // Assert
    expect(action).toThrow(Error);
  });
});
