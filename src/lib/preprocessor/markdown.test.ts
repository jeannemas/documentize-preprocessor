import { describe, expect, it } from 'vitest';

import { randomInteger, randomString } from '$lib/test-utils/index.js';

import { generateRandomEvents } from './events.test.js';
import {
  buildMarkdown,
  emptyEventsText,
  emptyPropsText,
  emptySlotsText,
  eventsText,
  prefix,
  propsText,
  slotsText,
} from './markdown.js';
import { Svelte4Metadata } from './preprocessor.js';
import { generateRandomProps } from './props.test.js';
import { generateRandomSlots } from './slots.test.js';

describe(buildMarkdown.name, () => {
  it('Should build the documentation as Markdown of a Svelte 4 component', () => {
    // Arrange
    const metadata = new Svelte4Metadata(
      randomString(),
      randomString(),
      generateRandomEvents(
        randomInteger({
          max: 10,
          min: 5,
        }),
      ),
      generateRandomProps(
        randomInteger({
          max: 10,
          min: 5,
        }),
      ),
      generateRandomSlots(
        randomInteger({
          max: 10,
          min: 5,
        }),
        randomInteger({
          max: 10,
          min: 5,
        }),
      ),
    );

    // Act
    const markdown = buildMarkdown(metadata);

    // Assert
    expect(markdown).toBeTypeOf('string');
    expect(markdown).toContain(prefix);
    expect(markdown).toContain(metadata.description);

    for (const { name } of metadata.events) {
      expect(markdown).toContain(name);
    }

    for (const { name } of metadata.props) {
      expect(markdown).toContain(name);
    }

    for (const { name, properties } of metadata.slots) {
      expect(markdown).toContain(name);

      for (const { name } of properties) {
        expect(markdown).toContain(name);
      }
    }
  });

  it('Should build the documentation with no events', () => {
    // Arrange
    const metadata = new Svelte4Metadata(
      randomString(),
      randomString(),
      [],
      generateRandomProps(
        randomInteger({
          max: 10,
          min: 5,
        }),
      ),
      generateRandomSlots(
        randomInteger({
          max: 10,
          min: 5,
        }),
        randomInteger({
          max: 10,
          min: 5,
        }),
      ),
    );

    // Act
    const markdown = buildMarkdown(metadata);

    // Assert
    expect(markdown).toContain(emptyEventsText);
    expect(markdown).not.toContain(eventsText);
    expect(markdown).not.toContain(emptyPropsText);
    expect(markdown).toContain(propsText);

    for (const { name } of metadata.props) {
      expect(markdown).toContain(name);
    }

    expect(markdown).not.toContain(emptySlotsText);
    expect(markdown).toContain(slotsText);

    for (const { name, properties } of metadata.slots) {
      expect(markdown).toContain(name);

      for (const { name } of properties) {
        expect(markdown).toContain(name);
      }
    }
  });

  it('Should build the documentation with no props', () => {
    /// Arrange
    const metadata = new Svelte4Metadata(
      randomString(),
      randomString(),
      generateRandomEvents(
        randomInteger({
          max: 10,
          min: 5,
        }),
      ),
      [],
      generateRandomSlots(
        randomInteger({
          max: 10,
          min: 5,
        }),
        randomInteger({
          max: 10,
          min: 5,
        }),
      ),
    );

    // Act
    const markdown = buildMarkdown(metadata);

    // Assert
    expect(markdown).not.toContain(emptyEventsText);
    expect(markdown).toContain(eventsText);

    for (const { name } of metadata.events) {
      expect(markdown).toContain(name);
    }

    expect(markdown).toContain(emptyPropsText);
    expect(markdown).not.toContain(propsText);
    expect(markdown).not.toContain(emptySlotsText);
    expect(markdown).toContain(slotsText);

    for (const { name, properties } of metadata.slots) {
      expect(markdown).toContain(name);

      for (const { name } of properties) {
        expect(markdown).toContain(name);
      }
    }
  });

  it('Should build the documentation with no slots', () => {
    // Arrange
    const metadata = new Svelte4Metadata(
      randomString(),
      randomString(),
      generateRandomEvents(
        randomInteger({
          max: 10,
          min: 5,
        }),
      ),
      generateRandomProps(
        randomInteger({
          max: 10,
          min: 5,
        }),
      ),
      [],
    );

    // Act
    const markdown = buildMarkdown(metadata);

    // Assert
    expect(markdown).not.toContain(emptyEventsText);
    expect(markdown).toContain(eventsText);

    for (const { name } of metadata.events) {
      expect(markdown).toContain(name);
    }

    expect(markdown).not.toContain(emptyPropsText);
    expect(markdown).toContain(propsText);

    for (const { name } of metadata.props) {
      expect(markdown).toContain(name);
    }

    expect(markdown).toContain(emptySlotsText);
    expect(markdown).not.toContain(slotsText);
  });

  it('Should build the documentation with only events', () => {
    // Arrange
    const metadata = new Svelte4Metadata(
      randomString(),
      randomString(),
      generateRandomEvents(
        randomInteger({
          max: 10,
          min: 5,
        }),
      ),
      [],
      [],
    );

    // Act
    const markdown = buildMarkdown(metadata);

    // Assert
    expect(markdown).not.toContain(emptyEventsText);
    expect(markdown).toContain(eventsText);

    for (const { name } of metadata.events) {
      expect(markdown).toContain(name);
    }

    expect(markdown).toContain(emptyPropsText);
    expect(markdown).not.toContain(propsText);
    expect(markdown).toContain(emptySlotsText);
    expect(markdown).not.toContain(slotsText);
  });

  it('Should build the documentation with only props', () => {
    // Arrange
    const metadata = new Svelte4Metadata(
      randomString(),
      randomString(),
      [],
      generateRandomProps(
        randomInteger({
          max: 10,
          min: 5,
        }),
      ),
      [],
    );

    // Act
    const markdown = buildMarkdown(metadata);

    // Assert
    expect(markdown).toContain(emptyEventsText);
    expect(markdown).not.toContain(eventsText);
    expect(markdown).not.toContain(emptyPropsText);
    expect(markdown).toContain(propsText);

    for (const { name } of metadata.props) {
      expect(markdown).toContain(name);
    }

    expect(markdown).toContain(emptySlotsText);
    expect(markdown).not.toContain(slotsText);
  });

  it('Should build the documentation with only slots', () => {
    // Arrange
    const metadata = new Svelte4Metadata(
      randomString(),
      randomString(),
      [],
      [],
      generateRandomSlots(
        randomInteger({
          max: 10,
          min: 5,
        }),
        randomInteger({
          max: 10,
          min: 5,
        }),
      ),
    );

    // Act
    const markdown = buildMarkdown(metadata);

    // Assert
    expect(markdown).toContain(emptyEventsText);
    expect(markdown).not.toContain(eventsText);
    expect(markdown).toContain(emptyPropsText);
    expect(markdown).not.toContain(propsText);
    expect(markdown).not.toContain(emptySlotsText);
    expect(markdown).toContain(slotsText);

    for (const { name, properties } of metadata.slots) {
      expect(markdown).toContain(name);

      for (const { name } of properties) {
        expect(markdown).toContain(name);
      }
    }
  });

  it('Should build the documentation with no events, props, and slots', () => {
    // Arrange
    const metadata = new Svelte4Metadata(randomString(), randomString(), [], [], []);

    // Act
    const markdown = buildMarkdown(metadata);

    // Assert
    expect(markdown).toContain(emptyEventsText);
    expect(markdown).not.toContain(eventsText);
    expect(markdown).toContain(emptyPropsText);
    expect(markdown).not.toContain(propsText);
    expect(markdown).toContain(emptySlotsText);
    expect(markdown).not.toContain(slotsText);
  });
});
