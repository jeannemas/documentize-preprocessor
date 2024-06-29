import { InterfaceDeclaration, Project, TypeAliasDeclaration, type SourceFile } from 'ts-morph';
import { beforeEach, describe, expect, it } from 'vitest';

import { generateAlphabeat } from '$lib/utils/alphabeat.js';
import { randomInteger } from '$lib/utils/numbers.js';
import { randomString } from '$lib/utils/strings.js';

import { Svelte4Prop, resolveSvelte4Props } from './props.js';

export function addPropsAsInterfaceDeclaration(
  props: Svelte4Prop[],
  propsSymbol: string,
  sourceFile: SourceFile,
): InterfaceDeclaration {
  const interfaceDeclaration = sourceFile.addInterface({
    name: propsSymbol,
    properties: props.map(({ name }) => ({
      name,
      type: (writer) => {
        writer.write('unknown');
      },
    })),
  });

  return interfaceDeclaration;
}

export function addPropsAsTypeAliasDeclaration(
  props: Svelte4Prop[],
  propsSymbol: string,
  sourceFile: SourceFile,
): TypeAliasDeclaration {
  const typeAliasDeclaration = sourceFile.addTypeAlias({
    name: propsSymbol,
    type: (writer) => {
      writer.block(() => {
        for (const { name } of props) {
          writer.writeLine(`${name}: unknown;`);
        }
      });
    },
  });

  return typeAliasDeclaration;
}

export function generateRandomProps(propsCount: number): Svelte4Prop[] {
  const props: Svelte4Prop[] = [];

  for (let i = 0; i < propsCount; i += 1) {
    props.push(
      new Svelte4Prop(
        randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        }),
      ),
    );
  }

  return props;
}

let project: Project;
let propsSymbol: string;
let sourceFile: SourceFile;

beforeEach(() => {
  project = new Project();
  propsSymbol = randomString({
    alphabeat: generateAlphabeat('a', 'z'),
    length: 16,
  });
  sourceFile = project.createSourceFile(
    `${randomString({
      alphabeat: generateAlphabeat('a', 'z'),
      length: 16,
    })}.ts`,
  );
});

describe(resolveSvelte4Props.name, () => {
  it('Should match the interface declaration', () => {
    // Arrange
    const props = generateRandomProps(
      randomInteger({
        max: 10,
        min: 5,
      }),
    );
    const interfaceDeclaration = addPropsAsInterfaceDeclaration(props, propsSymbol, sourceFile);

    // Act
    const maybeProps = resolveSvelte4Props(interfaceDeclaration);

    // Assert
    expect(maybeProps).toBeInstanceOf(Array);
    expect(maybeProps).toHaveLength(props.length);

    for (const prop of props) {
      const matchingMaybeProp =
        maybeProps.find((maybeProp) => maybeProp.name === prop.name) ?? null;

      expect(matchingMaybeProp).not.toBeNull();
    }

    for (const maybeProp of maybeProps) {
      expect(maybeProp).toBeInstanceOf(Svelte4Prop);

      const matchingProp = props.find((prop) => prop.name === maybeProp.name) ?? null;

      expect(matchingProp).not.toBeNull();
    }
  });

  it('Should match the type alias declaration', () => {
    // Arrange
    const props = generateRandomProps(
      randomInteger({
        max: 10,
        min: 5,
      }),
    );
    const typeAliasDeclaration = addPropsAsTypeAliasDeclaration(props, propsSymbol, sourceFile);

    // Act
    const maybeProps = resolveSvelte4Props(typeAliasDeclaration);

    // Assert
    expect(maybeProps).toBeInstanceOf(Array);
    expect(maybeProps).toHaveLength(props.length);

    for (const prop of props) {
      const matchingMaybeProp =
        maybeProps.find((maybeProp) => maybeProp.name === prop.name) ?? null;

      expect(matchingMaybeProp).not.toBeNull();
    }

    for (const maybeProp of maybeProps) {
      expect(maybeProp).toBeInstanceOf(Svelte4Prop);

      const matchingProp = props.find((prop) => prop.name === maybeProp.name) ?? null;

      expect(matchingProp).not.toBeNull();
    }
  });
});
