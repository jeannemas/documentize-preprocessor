import { Project } from 'ts-morph';
import { describe, expect, it } from 'vitest';

import { generateAlphabeat } from '$lib/utils/alphabeat.js';
import { randomInteger } from '$lib/utils/numbers.js';
import { randomString } from '$lib/utils/strings.js';

import { Svelte4Slot, Svelte4SlotProperty, resolveSvelte4Slots } from './slots.js';

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

describe(resolveSvelte4Slots.name, () => {
  it('Should match the interface declaration', () => {
    // Arrange
    const project = new Project();
    const sourceFile = project.createSourceFile(
      `${randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: 16,
      })}.ts`,
    );
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
    const interfaceDeclaration = sourceFile.addInterface({
      name: randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: 16,
      }),
      properties: slots.map(({ name, properties }) => ({
        name,
        type: (writer) => {
          writer.block(() => {
            for (const { name } of properties) {
              writer.writeLine(`${name}: any;`);
            }
          });
        },
      })),
    });

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
    const project = new Project();
    const sourceFile = project.createSourceFile(
      `${randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: 16,
      })}.ts`,
    );
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
    const typeAliasDeclaration = sourceFile.addTypeAlias({
      name: randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: 16,
      }),
      type: (writer) => {
        writer.block(() => {
          for (const { name, properties } of slots) {
            writer.writeLine(`${name}: `);
            writer.block(() => {
              for (const { name } of properties) {
                writer.writeLine(`${name}: any;`);
              }
            });
          }
        });
      },
    });

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
