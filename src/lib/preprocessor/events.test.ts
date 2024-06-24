import {
  InterfaceDeclaration,
  Project,
  TypeAliasDeclaration,
  type OptionalKind,
  type PropertySignatureStructure,
  type SourceFile,
  type WriterFunction,
} from 'ts-morph';
import { beforeEach, describe, expect, it } from 'vitest';

import { randomInteger, randomString } from '$lib/utils/index.js';

import { Svelte4Event, resolveSvelte4Events } from './events.js';

const simpleTypes = ['string', 'number', 'boolean'] as const;

export function addEventsAsInterfaceDeclaration(
  events: Svelte4Event[],
  eventsSymbol: string,
  sourceFile: SourceFile,
): InterfaceDeclaration {
  const interfaceDeclaration = sourceFile.addInterface({
    name: eventsSymbol,
    properties: events.map(({ name }) => ({
      name,
      type: (writer) => {
        writer.write('unknown');
      },
    })),
  });

  return interfaceDeclaration;
}

export function addEventsAsTypeAliasDeclaration(
  events: Svelte4Event[],
  eventsSymbol: string,
  sourceFile: SourceFile,
): TypeAliasDeclaration {
  const typeAliasDeclaration = sourceFile.addTypeAlias({
    name: eventsSymbol,
    type: (writer) => {
      writer.block(() => {
        for (const { name } of events) {
          writer.writeLine(`${name}: unknown;`);
        }
      });
    },
  });

  return typeAliasDeclaration;
}

export function generateRandomEvents(eventsCount: number): Svelte4Event[] {
  const events: Svelte4Event[] = [];

  for (let i = 0; i < eventsCount; i += 1) {
    events.push(new Svelte4Event(randomString()));
  }

  return events;
}

export function generateSimpleInterfaceProperties(
  propertyCount: number,
): OptionalKind<PropertySignatureStructure>[] {
  const properties: OptionalKind<PropertySignatureStructure>[] = [];

  for (let propertyIndex = 0; propertyIndex < propertyCount; propertyIndex += 1) {
    const name = randomString({
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

  return properties;
}

export function generateSimpleTypeAlias(propertyCount: number): {
  properties: OptionalKind<PropertySignatureStructure>[];
  writerFunction: WriterFunction;
} {
  const properties: OptionalKind<PropertySignatureStructure>[] = [];

  for (let propertyIndex = 0; propertyIndex < propertyCount; propertyIndex += 1) {
    const name = randomString({
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

  return {
    properties,
    writerFunction(writer) {
      writer.block(() => {
        for (const property of properties) {
          writer.writeLine(`${property.name}: ${property.type};`);
        }
      });
    },
  };
}

let eventsSymbol: string;
let project: Project;
let sourceFile: SourceFile;

beforeEach(() => {
  eventsSymbol = randomString();
  project = new Project();
  sourceFile = project.createSourceFile(`${randomString()}.ts`);
});

describe(resolveSvelte4Events.name, () => {
  it('Should match the interface declaration', () => {
    // Arrange
    const events = generateRandomEvents(
      randomInteger({
        max: 10,
        min: 5,
      }),
    );
    const interfaceDeclaration = addEventsAsInterfaceDeclaration(events, eventsSymbol, sourceFile);

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
    const events = generateRandomEvents(
      randomInteger({
        max: 10,
        min: 5,
      }),
    );
    const typeAliasDeclaration = addEventsAsTypeAliasDeclaration(events, eventsSymbol, sourceFile);

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
    const propertyCount = randomInteger({
      max: 10,
      min: 5,
    });
    const properties = generateSimpleInterfaceProperties(propertyCount);
    const interfaceDeclaration = sourceFile.addInterface({
      name: eventsSymbol,
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
    const propertyCount = randomInteger({
      max: 10,
      min: 5,
    });
    const { properties, writerFunction } = generateSimpleTypeAlias(propertyCount);
    const typeAliasDeclaration = sourceFile.addTypeAlias({
      name: eventsSymbol,
      type: writerFunction,
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
