import {
  Node,
  Project,
  type InterfaceDeclaration,
  type SourceFile,
  type TypeAliasDeclaration,
} from 'ts-morph';
import { beforeEach, describe, expect, it } from 'vitest';

import { generateRandomString, randomInt } from '$lib/test-utils.js';

import { Svelte4Prop, resolveSvelte4Props, resolveSvelte4PropsNode } from './props.js';

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

  for (let i = 0; i < propsCount; i++) {
    props.push(new Svelte4Prop(generateRandomString()));
  }

  return props;
}

let project: Project;
let propsSymbol: string;
let sourceFile: SourceFile;

beforeEach(() => {
  project = new Project();
  propsSymbol = generateRandomString();
  sourceFile = project.createSourceFile(`${generateRandomString()}.ts`);
});

describe(resolveSvelte4Props.name, () => {
  it('Should match the interface declaration', () => {
    // Arrange
    const props = generateRandomProps(randomInt(5, 11));
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
    const props = generateRandomProps(randomInt(5, 11));
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

describe(resolveSvelte4PropsNode.name, () => {
  it('Should match the interface declaration', () => {
    // Arrange
    const props = generateRandomProps(randomInt(5, 11));

    addPropsAsInterfaceDeclaration(props, propsSymbol, sourceFile);

    // Act
    const maybeNode = resolveSvelte4PropsNode(propsSymbol, sourceFile);

    // Assert
    expect(maybeNode).not.toBeNull();
    expect(maybeNode).toBeInstanceOf(Node);
  });

  it('Should match the type alias declaration', () => {
    // Arrange
    const props = generateRandomProps(randomInt(5, 11));

    addPropsAsTypeAliasDeclaration(props, propsSymbol, sourceFile);

    // Act
    const maybeNode = resolveSvelte4PropsNode(propsSymbol, sourceFile);

    // Assert
    expect(maybeNode).not.toBeNull();
    expect(maybeNode).toBeInstanceOf(Node);
  });

  it('Should match nothing', () => {
    // Arrange

    // Act
    const maybeNode = resolveSvelte4PropsNode(propsSymbol, sourceFile);

    // Assert
    expect(maybeNode).toBeNull();
  });

  it('Should throw an error if the symbol is ambiguous', () => {
    // Arrange
    const interfaceProps = generateRandomProps(randomInt(5, 11));
    const typeAliasProps = generateRandomProps(randomInt(5, 11));

    addPropsAsInterfaceDeclaration(interfaceProps, propsSymbol, sourceFile);
    addPropsAsTypeAliasDeclaration(typeAliasProps, propsSymbol, sourceFile);

    // Act
    const action = () => resolveSvelte4PropsNode(propsSymbol, sourceFile);

    // Assert
    expect(action).toThrowError(Error);
  });
});
