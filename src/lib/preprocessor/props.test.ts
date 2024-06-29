import { Project } from 'ts-morph';
import { describe, expect, it } from 'vitest';

import { generateAlphabeat } from '$lib/utils/alphabeat.js';
import { randomInteger } from '$lib/utils/numbers.js';
import { randomString } from '$lib/utils/strings.js';

import { Svelte4Prop, resolveSvelte4Props } from './props.js';

export function generateRandomProps(propsCount: number): Svelte4Prop[] {
  const props: Svelte4Prop[] = [];

  for (let i = 0; i < propsCount; i += 1) {
    props.push(
      new Svelte4Prop({
        name: randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        }),
      }),
    );
  }

  return props;
}

describe(resolveSvelte4Props.name, () => {
  it('Should match the interface declaration', () => {
    // Arrange
    const project = new Project();
    const sourceFile = project.createSourceFile(
      `${randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: 16,
      })}.ts`,
    );
    const props = generateRandomProps(
      randomInteger({
        max: 10,
        min: 5,
      }),
    );
    const interfaceDeclaration = sourceFile.addInterface({
      name: randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: 16,
      }),
      properties: props.map(({ name }) => ({
        name,
        type: (writer) => {
          writer.write('any');
        },
      })),
    });

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
    const project = new Project();
    const sourceFile = project.createSourceFile(
      `${randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: 16,
      })}.ts`,
    );
    const props = generateRandomProps(
      randomInteger({
        max: 10,
        min: 5,
      }),
    );
    const typeAliasDeclaration = sourceFile.addTypeAlias({
      name: randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: 16,
      }),
      type: (writer) => {
        writer.block(() => {
          for (const { name } of props) {
            writer.writeLine(`${name}: any;`);
          }
        });
      },
    });

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
