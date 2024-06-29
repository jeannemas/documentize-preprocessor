import {
  Project,
  type InterfaceDeclaration,
  type SourceFile,
  type TypeAliasDeclaration,
} from 'ts-morph';
import { beforeEach, describe, expect, it } from 'vitest';

import { generateAlphabeat } from '$lib/utils/alphabeat.js';
import { randomInteger } from '$lib/utils/numbers.js';
import { randomString } from '$lib/utils/strings.js';

import { Svelte4Slot, Svelte4SlotProperty, resolveSvelte4Slots } from './slots.js';

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

  for (let i = 0; i < propertyCount; i += 1) {
    properties.push(
      new Svelte4SlotProperty({
        name: randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        }),
      }),
    );
  }

  return properties;
}

export function generateRandomSlots(slotsCount: number, propertyCount: number): Svelte4Slot[] {
  const slots: Svelte4Slot[] = [];

  for (let i = 0; i < slotsCount; i += 1) {
    slots.push(
      new Svelte4Slot({
        name: randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        }),
        properties: generateRandomSlotProperty(propertyCount),
      }),
    );
  }

  return slots;
}

let project: Project;
let slotsSymbol: string;
let sourceFile: SourceFile;

beforeEach(() => {
  project = new Project();
  slotsSymbol = randomString({
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
