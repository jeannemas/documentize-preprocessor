import * as Markdown from '$lib/markdown/index.js';

import type { Svelte4Event } from './events.js';
import type { Svelte4Prop } from './props.js';
import type { Svelte4Slot } from './slots.js';

/**
 * Build the documentation as Markdown of a Svelte 4 component.
 */
export function buildDoc(
  events: Svelte4Event[],
  props: Svelte4Prop[],
  slots: Svelte4Slot[],
  description: string,
): string {
  const markdownBuilder = new Markdown.Builder();

  markdownBuilder.add(
    new Markdown.Paragraph('@component'),
    new Markdown.Paragraph(description),
    new Markdown.Heading(3, 'Events'),
  );

  if (events.length > 0) {
    events.sort((a, b) => a.name.localeCompare(b.name)); // Sort events by name alphabetically

    markdownBuilder.add(
      new Markdown.Paragraph('The following events are dispatched by this component:'),
      new Markdown.Table(
        [
          {
            align: 'left',
            text: 'Event',
          },
        ],
        events.map((event) => [`\`${event.name}\``]),
      ),
    );
  } else {
    markdownBuilder.add(new Markdown.Paragraph('This component does not dispatch any events.'));
  }

  markdownBuilder.add(new Markdown.Heading(3, 'Props'));

  if (props.length > 0) {
    props.sort((a, b) => a.name.localeCompare(b.name)); // Sort props by name alphabetically

    markdownBuilder.add(
      new Markdown.Paragraph('The following props are available for this component:'),
      new Markdown.Table(
        [
          {
            align: 'left',
            text: 'Prop',
          },
          {
            align: 'left',
            text: 'Description',
          },
        ],

        props.map((prop) => [`\`${prop.name}\``, '']),
      ),
    );
  } else {
    markdownBuilder.add(new Markdown.Paragraph('This component does not have any props.'));
  }

  markdownBuilder.add(new Markdown.Heading(3, 'Slots'));

  if (slots.length > 0) {
    slots.sort((a, b) => a.name.localeCompare(b.name)); // Sort slots by name alphabetically

    markdownBuilder.add(
      new Markdown.Paragraph('The following slots are available for this component:'),
      new Markdown.Table(
        [
          {
            align: 'left',
            text: 'Slot',
          },
          {
            align: 'left',
            text: 'Prop',
          },
        ],
        slots.reduce<[slot: string, prop: string][]>((acc, slot) => {
          acc.push([`\`${slot.name}\``, '']);

          for (const property of slot.properties) {
            acc.push(['', `\`${property.name}\``]);
          }

          return acc;
        }, []),
      ),
    );
  } else {
    markdownBuilder.add(new Markdown.Paragraph('This component does not have any slots.'));
  }

  return markdownBuilder.toString();
}
