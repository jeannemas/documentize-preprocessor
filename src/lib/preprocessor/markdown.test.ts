import { describe, expect, it } from 'vitest';

import type { Svelte4Event } from './events.js';
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
import type { Svelte4Prop } from './props.js';
import type { Svelte4Slot } from './slots.js';

/**
 * Sample test events.
 */
const sampleEvents = [
  { name: 'event_foo' },
  { name: 'event_bar' },
  { name: 'event_baz' },
] satisfies Svelte4Event[];
/**
 * Sample test props.
 */
const sampleProps = [
  { name: 'prop_foo' },
  { name: 'prop_bar' },
  { name: 'prop_baz' },
] satisfies Svelte4Prop[];
/**
 * Sample test slots.
 */
const sampleSlots = [
  {
    name: 'slot_foo',
    properties: [
      { name: 'slot_foo_prop_foo' },
      { name: 'slot_foo_prop_bar' },
      { name: 'slot_foo_prop_baz' },
    ],
  },
  {
    name: 'slot_bar',
    properties: [
      { name: 'slot_bar_prop_foo' },
      { name: 'slot_bar_prop_bar' },
      { name: 'slot_bar_prop_baz' },
    ],
  },
  {
    name: 'slot_baz',
    properties: [
      { name: 'slot_baz_prop_foo' },
      { name: 'slot_baz_prop_bar' },
      { name: 'slot_baz_prop_baz' },
    ],
  },
] satisfies Svelte4Slot[];
/**
 * Sample test description.
 */
const sampleDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

describe(buildMarkdown.name, () => {
  it('Should build the documentation as Markdown of a Svelte 4 component', () => {
    // Arrange
    const events = sampleEvents;
    const props = sampleProps;
    const slots = sampleSlots;
    const description = sampleDescription;

    // Act
    const markdown = buildMarkdown(events, props, slots, description);

    // Assert
    expect(typeof markdown).toBe('string');
    expect(markdown.includes(prefix)).toBe(true);
    expect(markdown.includes(description)).toBe(true);
  });

  it('Should build the documentation with no events', () => {
    // Arrange
    const events = [] satisfies Svelte4Event[];
    const props = sampleProps;
    const slots = sampleSlots;
    const description = sampleDescription;

    // Act
    const markdown = buildMarkdown(events, props, slots, description);

    // Assert
    expect(markdown.includes(emptyEventsText)).toBe(true);
    expect(markdown.includes(eventsText)).toBe(false);
    expect(markdown.includes(emptyPropsText)).toBe(false);
    expect(markdown.includes(propsText)).toBe(true);

    for (const prop of props) {
      expect(markdown.includes(prop.name)).toBe(true);
    }

    expect(markdown.includes(emptySlotsText)).toBe(false);
    expect(markdown.includes(slotsText)).toBe(true);

    for (const slot of slots) {
      expect(markdown.includes(slot.name)).toBe(true);

      for (const property of slot.properties) {
        expect(markdown.includes(property.name)).toBe(true);
      }
    }
  });

  it('Should build the documentation with no props', () => {
    // Arrange
    const events = sampleEvents;
    const props = [] satisfies Svelte4Prop[];
    const slots = sampleSlots;
    const description = sampleDescription;

    // Act
    const markdown = buildMarkdown(events, props, slots, description);

    // Assert
    expect(markdown.includes(emptyEventsText)).toBe(false);
    expect(markdown.includes(eventsText)).toBe(true);

    for (const event of events) {
      expect(markdown.includes(event.name)).toBe(true);
    }

    expect(markdown.includes(emptyPropsText)).toBe(true);
    expect(markdown.includes(propsText)).toBe(false);
    expect(markdown.includes(emptySlotsText)).toBe(false);
    expect(markdown.includes(slotsText)).toBe(true);

    for (const slot of slots) {
      expect(markdown.includes(slot.name)).toBe(true);

      for (const property of slot.properties) {
        expect(markdown.includes(property.name)).toBe(true);
      }
    }
  });

  it('Should build the documentation with no slots', () => {
    // Arrange
    const events = sampleEvents;
    const props = sampleProps;
    const slots = [] satisfies Svelte4Slot[];
    const description = sampleDescription;

    // Act
    const markdown = buildMarkdown(events, props, slots, description);

    // Assert
    expect(markdown.includes(emptyEventsText)).toBe(false);
    expect(markdown.includes(eventsText)).toBe(true);

    for (const event of events) {
      expect(markdown.includes(event.name)).toBe(true);
    }

    expect(markdown.includes(emptyPropsText)).toBe(false);
    expect(markdown.includes(propsText)).toBe(true);

    for (const prop of props) {
      expect(markdown.includes(prop.name)).toBe(true);
    }

    expect(markdown.includes(emptySlotsText)).toBe(true);
    expect(markdown.includes(slotsText)).toBe(false);
  });

  it('Should build the documentation with only events', () => {
    // Arrange
    const events = sampleEvents;
    const props = [] satisfies Svelte4Prop[];
    const slots = [] satisfies Svelte4Slot[];
    const description = sampleDescription;

    // Act
    const markdown = buildMarkdown(events, props, slots, description);

    // Assert
    expect(markdown.includes(emptyEventsText)).toBe(false);
    expect(markdown.includes(eventsText)).toBe(true);

    for (const event of events) {
      expect(markdown.includes(event.name)).toBe(true);
    }

    expect(markdown.includes(emptyPropsText)).toBe(true);
    expect(markdown.includes(propsText)).toBe(false);
    expect(markdown.includes(emptySlotsText)).toBe(true);
    expect(markdown.includes(slotsText)).toBe(false);
  });

  it('Should build the documentation with only props', () => {
    // Arrange
    const events = [] satisfies Svelte4Event[];
    const props = sampleProps;
    const slots = [] satisfies Svelte4Slot[];
    const description = sampleDescription;

    // Act
    const markdown = buildMarkdown(events, props, slots, description);

    // Assert
    expect(markdown.includes(emptyEventsText)).toBe(true);
    expect(markdown.includes(eventsText)).toBe(false);
    expect(markdown.includes(emptyPropsText)).toBe(false);
    expect(markdown.includes(propsText)).toBe(true);

    for (const prop of props) {
      expect(markdown.includes(prop.name)).toBe(true);
    }

    expect(markdown.includes(emptySlotsText)).toBe(true);
    expect(markdown.includes(slotsText)).toBe(false);
  });

  it('Should build the documentation with only slots', () => {
    // Arrange
    const events = [] satisfies Svelte4Event[];
    const props = [] satisfies Svelte4Prop[];
    const slots = sampleSlots;
    const description = sampleDescription;

    // Act
    const markdown = buildMarkdown(events, props, slots, description);

    // Assert
    expect(markdown.includes(emptyEventsText)).toBe(true);
    expect(markdown.includes(eventsText)).toBe(false);
    expect(markdown.includes(emptyPropsText)).toBe(true);
    expect(markdown.includes(propsText)).toBe(false);
    expect(markdown.includes(emptySlotsText)).toBe(false);
    expect(markdown.includes(slotsText)).toBe(true);

    for (const slot of slots) {
      expect(markdown.includes(slot.name)).toBe(true);

      for (const property of slot.properties) {
        expect(markdown.includes(property.name)).toBe(true);
      }
    }
  });

  it('Should build the documentation with no events, props, and slots', () => {
    // Arrange
    const events = [] satisfies Svelte4Event[];
    const props = [] satisfies Svelte4Prop[];
    const slots = [] satisfies Svelte4Slot[];
    const description = sampleDescription;

    // Act
    const markdown = buildMarkdown(events, props, slots, description);

    // Assert
    expect(markdown.includes(emptyEventsText)).toBe(true);
    expect(markdown.includes(eventsText)).toBe(false);
    expect(markdown.includes(emptyPropsText)).toBe(true);
    expect(markdown.includes(propsText)).toBe(false);
    expect(markdown.includes(emptySlotsText)).toBe(true);
    expect(markdown.includes(slotsText)).toBe(false);
  });
});
