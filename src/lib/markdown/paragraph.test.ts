import { describe, expect, it } from 'vitest';

import { Paragraph } from './paragraph.js';

describe(Paragraph.name, () => {
  it('Specifying a text should the paragraph', () => {
    // Arrange
    const text = 'Lorem ipsum dolor sit amet';

    // Act
    const paragraph = new Paragraph(text);

    // Assert
    const string = paragraph.toString();

    expect(string.startsWith('\n')).toBe(true);
    expect(string.includes(text)).toBe(true);
    expect(string.endsWith('\n\n')).toBe(true);
  });

  it('Specifying an invalid text should throw an error', () => {
    // Arrange
    // @ts-expect-error invalid type
    const text = null as string;

    // Act
    const paragraph = () => new Paragraph(text);

    // Assert
    expect(paragraph).toThrowError(TypeError);
  });
});
