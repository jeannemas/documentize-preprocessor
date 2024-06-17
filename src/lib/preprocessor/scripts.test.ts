import { describe, expect, it } from 'vitest';

import {
  extractScriptContextModule,
  extractScriptNotContextModule,
  extractScripts,
} from './scripts.js';

const sampleScriptContextModule = `
<script context="module" lang="ts">
	const foo = 'bar';
	const bar = 1 << 2;
	const baz = 3 / 2;
</script>
`;
const sampleScriptNotContextModule = `
<script lang="ts">
	const foo = 'bar';
	const bar = 1 << 2;
	const baz = 3 / 2;
</script>
`;
const sampleValidComponentWithScripts = `
${sampleScriptContextModule}

Foo bar baz

${sampleScriptNotContextModule}

Lorem ipsum
`;
const sampleValidComponentWithOnlyScriptContextModule = `
${sampleScriptContextModule}

Foo bar baz

Lorem ipsum
`;
const sampleValidComponentWithOnlyScriptNotContextModule = `
Foo bar baz

${sampleScriptNotContextModule}

Lorem ipsum
`;
const sampleValidComponentWithoutScripts = `
Foo bar baz

Lorem ipsum
`;
const sampleInvalidComponentWithMultipleScriptContextModule = `
${sampleScriptContextModule}

Foo bar baz

${sampleScriptContextModule}

Lorem ipsum
`;
const sampleInvalidComponentWithMultipleScriptNotContextModule = `
${sampleScriptNotContextModule}

Foo bar baz

${sampleScriptNotContextModule}

Lorem ipsum
`;

describe(extractScriptContextModule.name, () => {
  it('Should extract the script context module', () => {
    // Arrange
    const content = sampleValidComponentWithScripts;

    // Act
    const script = extractScriptContextModule(content);

    // Assert
    expect(script).not.toBeNull();
    expect(script!.attributes.context).toEqual('module');
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
    const content = sampleInvalidComponentWithMultipleScriptContextModule;

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
    expect(script!.attributes.context).not.toEqual('module');
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
    const content = sampleInvalidComponentWithMultipleScriptNotContextModule;

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
    expect(scripts.length).toEqual(2);
    expect(Object.keys(scripts[0].attributes).length).toEqual(2);
    expect(scripts[0].attributes.context).toEqual('module');
    expect(Object.keys(scripts[1].attributes).length).toEqual(1);
    expect(scripts[1].attributes.context).not.toEqual('module');
  });

  it('Should extract 1 script context module', () => {
    // Arrange
    const content = sampleValidComponentWithOnlyScriptContextModule;

    // Act
    const scripts = extractScripts(content);

    // Assert
    expect(scripts.length).toEqual(1);
    expect(scripts[0].attributes.context).toEqual('module');
  });

  it('Should extract 1 script', () => {
    // Arrange
    const content = sampleValidComponentWithOnlyScriptNotContextModule;

    // Act
    const scripts = extractScripts(content);

    // Assert
    expect(scripts.length).toEqual(1);
    expect(scripts[0].attributes.context).not.toEqual('module');
  });
});
