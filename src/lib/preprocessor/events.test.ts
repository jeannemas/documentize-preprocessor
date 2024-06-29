import { Project, type OptionalKind, type PropertySignatureStructure } from 'ts-morph';
import { describe, expect, it } from 'vitest';

import { generateAlphabeat } from '$lib/utils/alphabeat.js';
import { randomInteger } from '$lib/utils/numbers.js';
import { randomString } from '$lib/utils/strings.js';

import { Svelte4Event, resolveSvelte4Events } from './events.js';

const simpleTypes = ['string', 'number', 'boolean'] as const;

export function generateRandomEvents(eventsCount: number): Svelte4Event[] {
  const events: Svelte4Event[] = [];

  for (let i = 0; i < eventsCount; i += 1) {
    events.push(
      new Svelte4Event({
        name: randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: randomInteger({
            max: 10,
            min: 1,
          }),
        }),
      }),
    );
  }

  return events;
}

describe(resolveSvelte4Events.name, () => {
  it('Should match the interface declaration', () => {
    // Arrange
    const project = new Project();
    const sourceFile = project.createSourceFile(
      `${randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: 16,
      })}.ts`,
    );
    const events = generateRandomEvents(
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
      properties: events.map((event) => ({
        name: event.name,
        type: (writer) => {
          writer.write('any');
        },
      })),
    });

    // Act
    const maybeEvents = resolveSvelte4Events(interfaceDeclaration);

    // Assert
    expect(maybeEvents).toBeInstanceOf(Array);
    expect(maybeEvents).toHaveLength(events.length);

    for (const event of events) {
      const matchingMaybeEvent =
        maybeEvents.find((maybeEvent) => maybeEvent.name === event.name) ?? null;

      expect(matchingMaybeEvent).not.toBeNull();
    }

    for (const maybeEvent of maybeEvents) {
      expect(maybeEvent).toBeInstanceOf(Svelte4Event);

      const matchingEvent = events.find((event) => event.name === maybeEvent.name) ?? null;

      expect(matchingEvent).not.toBeNull();
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
    const events = generateRandomEvents(
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
          for (const event of events) {
            writer.writeLine(`${event.name}: any;`);
          }
        });
      },
    });

    // Act
    const maybeEvents = resolveSvelte4Events(typeAliasDeclaration);

    // Assert
    expect(maybeEvents).toBeInstanceOf(Array);
    expect(maybeEvents).toHaveLength(events.length);

    for (const event of events) {
      const matchingMaybeEvent =
        maybeEvents.find((maybeEvent) => maybeEvent.name === event.name) ?? null;

      expect(matchingMaybeEvent).not.toBeNull();
    }

    for (const maybeEvent of maybeEvents) {
      expect(maybeEvent).toBeInstanceOf(Svelte4Event);

      const matchingEvent = events.find((event) => event.name === maybeEvent.name) ?? null;

      expect(matchingEvent).not.toBeNull();
    }
  });

  it('Should resolve simple interface', () => {
    // Arrange
    const project = new Project();
    const sourceFile = project.createSourceFile(
      `${randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: 16,
      })}.ts`,
    );
    const propertyCount = randomInteger({
      max: 10,
      min: 5,
    });
    const properties: OptionalKind<PropertySignatureStructure>[] = [];

    for (let propertyIndex = 0; propertyIndex < propertyCount; propertyIndex += 1) {
      const name = randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: randomInteger({
          max: 5,
          min: 1,
        }),
      });
      const typeIndex = randomInteger({
        max: simpleTypes.length,
        min: 0,
        upperBoundary: 'exclude',
      });
      const type = simpleTypes[typeIndex];
      const property = {
        name,
        type,
      } satisfies OptionalKind<PropertySignatureStructure>;

      properties.push(property);
    }

    const interfaceDeclaration = sourceFile.addInterface({
      name: randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: 16,
      }),
      properties,
    });

    // Act
    const maybeEvents = resolveSvelte4Events(interfaceDeclaration);

    // Assert
    expect(maybeEvents).toBeInstanceOf(Array);
    expect(maybeEvents).toHaveLength(propertyCount);

    for (const property of properties) {
      const matchingMaybeEvent =
        maybeEvents.find((maybeEvent) => maybeEvent.name === property.name) ?? null;

      expect(matchingMaybeEvent).not.toBeNull();
    }

    for (const maybeEvent of maybeEvents) {
      expect(maybeEvent).toBeInstanceOf(Svelte4Event);

      const matchingProperty =
        properties.find((property) => property.name === maybeEvent.name) ?? null;

      expect(matchingProperty).not.toBeNull();
    }
  });

  it('Should resolve simple type alias', () => {
    // Arrange
    const project = new Project();
    const sourceFile = project.createSourceFile(
      `${randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: 16,
      })}.ts`,
    );
    const propertyCount = randomInteger({
      max: 10,
      min: 5,
    });
    const properties: OptionalKind<PropertySignatureStructure>[] = [];

    for (let propertyIndex = 0; propertyIndex < propertyCount; propertyIndex += 1) {
      const name = randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: randomInteger({
          max: 5,
          min: 1,
        }),
      });
      const typeIndex = randomInteger({
        max: simpleTypes.length,
        min: 0,
        upperBoundary: 'exclude',
      });
      const type = simpleTypes[typeIndex];

      const property = {
        name,
        type,
      } satisfies OptionalKind<PropertySignatureStructure>;

      properties.push(property);
    }

    const typeAliasDeclaration = sourceFile.addTypeAlias({
      name: randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: 16,
      }),
      type: (writer) => {
        writer.block(() => {
          for (const property of properties) {
            writer.writeLine(`${property.name}: ${property.type};`);
          }
        });
      },
    });

    // Act
    const maybeEvents = resolveSvelte4Events(typeAliasDeclaration);

    // Assert
    expect(maybeEvents).toBeInstanceOf(Array);
    expect(maybeEvents).toHaveLength(propertyCount);

    for (const property of properties) {
      const matchingMaybeEvent =
        maybeEvents.find((maybeEvent) => maybeEvent.name === property.name) ?? null;

      expect(matchingMaybeEvent).not.toBeNull();
    }

    for (const maybeEvent of maybeEvents) {
      expect(maybeEvent).toBeInstanceOf(Svelte4Event);

      const matchingProperty =
        properties.find((property) => property.name === maybeEvent.name) ?? null;

      expect(matchingProperty).not.toBeNull();
    }
  });
});
