import * as Markdown from '$lib/markdown/index.js';

import type { Svelte4Event } from './events.js';
import type { Svelte4Prop } from './props.js';
import type { Svelte4Slot } from './slots.js';

/**
 * The prefix of the component documentation.
 */
export const prefix = '@component';
/**
 * The header of the events section.
 */
export const eventsHeader = 'Events';
/**
 * The header of the props section.
 */
export const propsHeader = 'Props';
/**
 * The header of the slots section.
 */
export const slotsHeader = 'Slots';
/**
 * The text to display when there are no events.
 */
export const emptyEventsText = 'This component does not dispatch any events.';
/**
 * The text to display when there are no props.
 */
export const emptyPropsText = 'This component does not have any props.';
/**
 * The text to display when there are no slots.
 */
export const emptySlotsText = 'This component does not have any slots.';
/**
 * The text to display when there are events dispatched by the component.
 */
export const eventsText = 'The following events are dispatched by this component:';
/**
 * The text to display when there are props available for the component.
 */
export const propsText = 'The following props are available for this component:';
/**
 * The text to display when there are slots available for the component.
 */
export const slotsText = 'The following slots are available for this component.';

/**
 * Build the documentation as Markdown of a Svelte 4 component.
 */
export function buildMarkdown(
  events: Svelte4Event[],
  props: Svelte4Prop[],
  slots: Svelte4Slot[],
  description: string,
): string {
  const markdownBuilder = new Markdown.Builder();

  markdownBuilder.add(
    new Markdown.Paragraph().add(new Markdown.Text(prefix)),
    new Markdown.Paragraph().add(new Markdown.Text(description)),

    createEventsSection(events),
    createPropsSection(props),
    createSlotsSection(slots),
  );

  return markdownBuilder.asString();
}

/**
 * Create the events section of the documentation.
 */
function createEventsSection(events: Svelte4Event[]): Markdown.Section {
  const section = new Markdown.Section(new Markdown.Heading(3, new Markdown.Text(eventsHeader)));

  if (events.length === 0) {
    section.add(new Markdown.Paragraph(new Markdown.Text(emptyEventsText)));
  } else {
    const columns = [new Markdown.Table.Column('left', new Markdown.Text('Event'))];
    const rows: Markdown.Table.Row[] = [];

    // Sort events by name alphabetically
    for (const event of events.toSorted((a, b) => a.name.localeCompare(b.name))) {
      rows.push(
        new Markdown.Table.Row(new Markdown.Table.Cell(new Markdown.Text(`\`${event.name}\``))),
      );
    }

    section.add(
      new Markdown.Paragraph(new Markdown.Text(eventsText)),
      new Markdown.Table.Table(columns, rows),
    );
  }

  return section;
}

/**
 * Create the props section of the documentation.
 */
function createPropsSection(props: Svelte4Prop[]): Markdown.Section {
  const section = new Markdown.Section(new Markdown.Heading(3, new Markdown.Text(propsHeader)));

  if (props.length === 0) {
    section.add(new Markdown.Paragraph(new Markdown.Text(emptyPropsText)));
  } else {
    const columns = [
      new Markdown.Table.Column('left', new Markdown.Text('Prop')),
      new Markdown.Table.Column('left', new Markdown.Text('Description')),
    ];
    const rows: Markdown.Table.Row[] = [];

    // Sort props by name alphabetically
    for (const prop of props.toSorted((a, b) => a.name.localeCompare(b.name))) {
      rows.push(
        new Markdown.Table.Row(
          new Markdown.Table.Cell(new Markdown.Text(`\`${prop.name}\``)),
          new Markdown.Table.Cell(),
        ),
      );
    }

    section.add(
      new Markdown.Paragraph(new Markdown.Text(propsText)),
      new Markdown.Table.Table(columns, rows),
    );
  }

  return section;
}

/**
 * Create the slots section of the documentation.
 */
function createSlotsSection(slots: Svelte4Slot[]): Markdown.Section {
  const section = new Markdown.Section(new Markdown.Heading(3, new Markdown.Text(slotsHeader)));

  if (slots.length === 0) {
    section.add(new Markdown.Paragraph(new Markdown.Text(emptySlotsText)));
  } else {
    const rows: Markdown.Table.Row[] = [];

    // Sort slots by name alphabetically
    for (const slot of slots.toSorted((a, b) => a.name.localeCompare(b.name))) {
      rows.push(
        new Markdown.Table.Row(
          new Markdown.Table.Cell(new Markdown.Text(`\`${slot.name}\``)),
          new Markdown.Table.Cell(),
        ),
      );

      for (const property of slot.properties.toSorted((a, b) => a.name.localeCompare(b.name))) {
        rows.push(
          new Markdown.Table.Row(
            new Markdown.Table.Cell(),
            new Markdown.Table.Cell(new Markdown.Text(`\`${property.name}\``)),
          ),
        );
      }
    }

    section.add(
      new Markdown.Paragraph(new Markdown.Text(slotsText)),
      new Markdown.Table.Table(
        [
          new Markdown.Table.Column('left', new Markdown.Text('Slot')),
          new Markdown.Table.Column('left', new Markdown.Text('Prop')),
        ],
        rows,
      ),
    );
  }

  return section;
}
