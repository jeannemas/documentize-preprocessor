import {
  Node,
  Project,
  type InterfaceDeclaration,
  type SourceFile,
  type TypeAliasDeclaration,
} from 'ts-morph';
import { beforeEach, describe, expect, it } from 'vitest';

import { randomInteger, randomString } from '$lib/utils/index.js';

import {
  Svelte4Slot,
  Svelte4SlotProperty,
  resolveSvelte4Slots,
  resolveSvelte4SlotsNode,
} from './slots.js';

export function addSlotsAsInterfaceDeclaration(
  slots: Svelte4Slot[],
  slotsSymbol: string,
  sourceFile: SourceFile,
): InterfaceDeclaration {
  const interfaceDeclaration = sourceFile.addInterface({
    name: slotsSymbol,
    properties: slots.map(({ name, properties }) => ({
      name,
      type: (writer) => {
        writer.block(() => {
          for (const { name } of properties) {
            writer.writeLine(`${name}: unknown;`);
          }
        });
      },
    })),
  });

  return interfaceDeclaration;
}

export function addPropsAsTypeAliasDeclaration(
  slots: Svelte4Slot[],
  slotsSymbol: string,
  sourceFile: SourceFile,
): TypeAliasDeclaration {
  const typeAliasDeclaration = sourceFile.addTypeAlias({
    name: slotsSymbol,
    type: (writer) => {
      writer.block(() => {
        for (const { name, properties } of slots) {
          writer.writeLine(`${name}: `);
          writer.block(() => {
            for (const { name } of properties) {
              writer.writeLine(`${name}: unknown;`);
            }
          });
        }
      });
    },
  });

  return typeAliasDeclaration;
}

export function generateRandomSlotProperty(propertyCount: number): Svelte4SlotProperty[] {
  const properties: Svelte4SlotProperty[] = [];

  for (let i = 0; i < propertyCount; i++) {
    properties.push(new Svelte4SlotProperty(randomString()));
  }

  return properties;
}

export function generateRandomSlots(slotsCount: number, propertyCount: number): Svelte4Slot[] {
  const slots: Svelte4Slot[] = [];

  for (let i = 0; i < slotsCount; i++) {
    slots.push(new Svelte4Slot(randomString(), generateRandomSlotProperty(propertyCount)));
  }

  return slots;
}

let project: Project;
let slotsSymbol: string;
let sourceFile: SourceFile;

beforeEach(() => {
  project = new Project();
  slotsSymbol = randomString();
  sourceFile = project.createSourceFile(`${randomString()}.ts`);
});

describe(resolveSvelte4Slots.name, () => {
  it('Should match the interface declaration', () => {
    // Arrange
    const slots = generateRandomSlots(
      randomInteger({
        max: 10,
        min: 5,
      }),
      randomInteger({
        max: 10,
        min: 5,
      }),
    );
    const interfaceDeclaration = addSlotsAsInterfaceDeclaration(slots, slotsSymbol, sourceFile);

    // Act
    const maybeSlots = resolveSvelte4Slots(interfaceDeclaration);

    // Assert
    expect(maybeSlots).toBeInstanceOf(Array);
    expect(maybeSlots).toHaveLength(slots.length);

    for (const slot of slots) {
      const matchingMaybeSlot =
        maybeSlots.find((maybeSlot) => maybeSlot.name === slot.name) ?? null;

      expect(matchingMaybeSlot).not.toBeNull();
    }

    for (const maybeSlot of maybeSlots) {
      expect(maybeSlot).toBeInstanceOf(Svelte4Slot);

      const matchingSlot = slots.find((slot) => slot.name === maybeSlot.name) ?? null;

      expect(matchingSlot).not.toBeNull();
    }
  });

  it('Should match the type alias declaration', () => {
    // Arrange
    const slots = generateRandomSlots(
      randomInteger({
        max: 10,
        min: 5,
      }),
      randomInteger({
        max: 10,
        min: 5,
      }),
    );
    const typeAliasDeclaration = addPropsAsTypeAliasDeclaration(slots, slotsSymbol, sourceFile);

    // Act
    const maybeSlots = resolveSvelte4Slots(typeAliasDeclaration);

    // Assert
    expect(maybeSlots).toBeInstanceOf(Array);
    expect(maybeSlots).toHaveLength(slots.length);

    for (const slot of slots) {
      const matchingMaybeSlot =
        maybeSlots.find((maybeSlot) => maybeSlot.name === slot.name) ?? null;

      expect(matchingMaybeSlot).not.toBeNull();
    }

    for (const maybeSlot of maybeSlots) {
      expect(maybeSlot).toBeInstanceOf(Svelte4Slot);

      const matchingSlot = slots.find((slot) => slot.name === maybeSlot.name) ?? null;

      expect(matchingSlot).not.toBeNull();
    }
  });
});

describe(resolveSvelte4SlotsNode.name, () => {
  it('Should match the interface declaration', () => {
    // Arrange
    const slots = generateRandomSlots(
      randomInteger({
        max: 10,
        min: 5,
      }),
      randomInteger({
        max: 10,
        min: 5,
      }),
    );

    addSlotsAsInterfaceDeclaration(slots, slotsSymbol, sourceFile);

    // Act
    const maybeNode = resolveSvelte4SlotsNode(slotsSymbol, sourceFile);

    // Assert
    expect(maybeNode).not.toBeNull();
    expect(maybeNode).toBeInstanceOf(Node);
  });

  it('Should match the type alias declaration', () => {
    // Arrange
    const slots = generateRandomSlots(
      randomInteger({
        max: 10,
        min: 5,
      }),
      randomInteger({
        max: 10,
        min: 5,
      }),
    );

    addPropsAsTypeAliasDeclaration(slots, slotsSymbol, sourceFile);

    // Act
    const maybeNode = resolveSvelte4SlotsNode(slotsSymbol, sourceFile);

    // Assert
    expect(maybeNode).not.toBeNull();
    expect(maybeNode).toBeInstanceOf(Node);
  });

  it('Should match nothing', () => {
    // Arrange

    // Act
    const maybeNode = resolveSvelte4SlotsNode(slotsSymbol, sourceFile);

    // Assert
    expect(maybeNode).toBeNull();
  });

  it('Should throw an error if the symbol is ambiguous', () => {
    // Arrange
    const interfaceProps = generateRandomSlots(
      randomInteger({
        max: 10,
        min: 5,
      }),
      randomInteger({
        max: 10,
        min: 5,
      }),
    );
    const typeAliasProps = generateRandomSlots(
      randomInteger({
        max: 10,
        min: 5,
      }),
      randomInteger({
        max: 10,
        min: 5,
      }),
    );

    addSlotsAsInterfaceDeclaration(interfaceProps, slotsSymbol, sourceFile);
    addPropsAsTypeAliasDeclaration(typeAliasProps, slotsSymbol, sourceFile);

    // Act
    const action = () => resolveSvelte4SlotsNode(slotsSymbol, sourceFile);

    // Assert
    expect(action).toThrowError(Error);
  });
});
