import {
  Node,
  Project,
  type InterfaceDeclaration,
  type SourceFile,
  type TypeAliasDeclaration,
} from 'ts-morph';
import { beforeEach, describe, expect, it } from 'vitest';

import { randomInteger, randomString } from '$lib/test-utils/index.js';

import { Svelte4Event, resolveSvelte4Events, resolveSvelte4EventsNode } from './events.js';

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

  for (let i = 0; i < eventsCount; i++) {
    events.push(new Svelte4Event(randomString()));
  }

  return events;
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
});

describe(resolveSvelte4EventsNode.name, () => {
  it('Should match the interface declaration', () => {
    // Arrange
    const events = generateRandomEvents(
      randomInteger({
        max: 10,
        min: 5,
      }),
    );

    addEventsAsInterfaceDeclaration(events, eventsSymbol, sourceFile);

    // Act
    const maybeNode = resolveSvelte4EventsNode(eventsSymbol, sourceFile);

    // Assert
    expect(maybeNode).not.toBeNull();
    expect(maybeNode).toBeInstanceOf(Node);
  });

  it('Should match the type alias declaration', () => {
    // Arrange
    const events = generateRandomEvents(
      randomInteger({
        max: 10,
        min: 5,
      }),
    );

    addEventsAsTypeAliasDeclaration(events, eventsSymbol, sourceFile);

    // Act
    const maybeNode = resolveSvelte4EventsNode(eventsSymbol, sourceFile);

    // Assert
    expect(maybeNode).not.toBeNull();
    expect(maybeNode).toBeInstanceOf(Node);
  });

  it('Should match nothing', () => {
    // Arrange

    // Act
    const maybeNode = resolveSvelte4EventsNode(eventsSymbol, sourceFile);

    // Assert
    expect(maybeNode).toBeNull();
  });

  it('Should throw an error if the symbol is ambiguous', () => {
    // Arrange
    const interfaceEvents = generateRandomEvents(
      randomInteger({
        max: 10,
        min: 5,
      }),
    );
    const typeAliasEvents = generateRandomEvents(
      randomInteger({
        max: 10,
        min: 5,
      }),
    );

    addEventsAsInterfaceDeclaration(interfaceEvents, eventsSymbol, sourceFile);
    addEventsAsTypeAliasDeclaration(typeAliasEvents, eventsSymbol, sourceFile);

    // Act
    const action = () => resolveSvelte4EventsNode(eventsSymbol, sourceFile);

    // Assert
    expect(action).toThrowError(Error);
  });
});
