import { describe, expect, it } from 'vitest';

import { Attribute } from './attributes.js';
import { compileAttributesIntoString } from './attributes.test.js';
import {
  Svelte4Script,
  extractScriptContextModule,
  extractScriptNotContextModule,
  extractScripts,
} from './scripts.js';

/**
 * Generate a script tag.
 */
export function generateScript(attributes: Attribute[], content: string): string {
  return `
<script ${compileAttributesIntoString(attributes)}>
${content}
</script>
`;
}

/**
 * Generate a script tag with the `context="module"` attribute.
 */
export function generateScriptContextModule(content: string): string {
  return generateScript(
    [
      new Attribute({
        name: 'context',
        value: 'module',
      }),
      new Attribute({
        name: 'lang',
        value: 'ts',
      }),
    ],
    content,
  );
}

/**
 * Generate a script tag without the `context="module"` attribute.
 */
export function generateScriptNotContextModule(content: string): string {
  return generateScript(
    [
      new Attribute({
        name: 'lang',
        value: 'ts',
      }),
    ],
    content,
  );
}

const sampleScriptContextModule = generateScriptContextModule(`
  const foo = 'bar';
	const bar = 1 << 2;
	const baz = 3 / 2;
`);
const sampleScriptNotContextModule = generateScriptNotContextModule(`
	const foo = 'bar';
	const bar = 1 << 2;
	const baz = 3 / 2;
`);
const sampleValidComponentWithScripts = `
${sampleScriptContextModule}

${sampleScriptNotContextModule}
`;
const sampleValidComponentWithoutScripts = '';

describe(extractScriptContextModule.name, () => {
  it('Should extract the script context module', () => {
    // Arrange
    const content = sampleValidComponentWithScripts;

    // Act
    const script = extractScriptContextModule(content);

    // Assert
    expect(script).not.toBeNull();
    expect(script).toBeInstanceOf(Svelte4Script);
    expect(script!.attributes).toContainEqual(
      new Attribute({
        name: 'context',
        value: 'module',
      }),
    );
  });

  it('Should extract nothing', () => {
    // Arrange
    const content = sampleValidComponentWithoutScripts;

    // Act
    const script = extractScriptContextModule(content);

    // Assert
    expect(script).toBeNull();
  });

  it('Should throw an error', () => {
    // Arrange
    const content = `
${sampleScriptContextModule}

Foo bar baz

${sampleScriptContextModule}

Lorem ipsum
`;

    // Act
    const action = () => extractScriptContextModule(content);

    // Assert
    expect(action).toThrow(Error);
  });
});

describe(extractScriptNotContextModule.name, () => {
  it('Should extract the script', () => {
    // Arrange
    const content = sampleValidComponentWithScripts;

    // Act
    const script = extractScriptNotContextModule(content);

    // Assert
    expect(script).not.toBeNull();
    expect(script).toBeInstanceOf(Svelte4Script);
    expect(script!.attributes).not.toContainEqual(
      new Attribute({
        name: 'context',
        value: 'module',
      }),
    );
  });

  it('Should extract nothing', () => {
    // Arrange
    const content = sampleValidComponentWithoutScripts;

    // Act
    const script = extractScriptNotContextModule(content);

    // Assert
    expect(script).toBeNull();
  });

  it('Should throw an error', () => {
    // Arrange
    const content = `
${sampleScriptNotContextModule}

Foo bar baz

${sampleScriptNotContextModule}

Lorem ipsum
`;

    // Act
    const action = () => extractScriptNotContextModule(content);

    // Assert
    expect(action).toThrow(Error);
  });
});

describe(extractScripts.name, () => {
  it('Should extract 2 scripts', () => {
    // Arrange
    const content = sampleValidComponentWithScripts;

    // Act
    const scripts = extractScripts(content);

    // Assert
    expect(scripts).toBeInstanceOf(Array);
    expect(scripts).toHaveLength(2);

    for (const script of scripts) {
      expect(script).toBeInstanceOf(Svelte4Script);
    }
  });

  it('Should extract 1 script context module', () => {
    // Arrange
    const content = `
${sampleScriptContextModule}

Foo bar baz

Lorem ipsum
`;

    // Act
    const scripts = extractScripts(content);

    // Assert
    expect(scripts).toBeInstanceOf(Array);
    expect(scripts).toHaveLength(1);
    expect(scripts[0].attributes).toContainEqual(
      new Attribute({
        name: 'context',
        value: 'module',
      }),
    );
  });

  it('Should extract 1 script', () => {
    // Arrange
    const content = `
Foo bar baz

${sampleScriptNotContextModule}

Lorem ipsum
`;

    // Act
    const scripts = extractScripts(content);

    // Assert
    expect(scripts).toBeInstanceOf(Array);
    expect(scripts).toHaveLength(1);
    expect(scripts[0].attributes).not.toContainEqual(
      new Attribute({
        name: 'context',
        value: 'module',
      }),
    );
  });
});
