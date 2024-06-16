import { JSDOM } from 'jsdom';
import { randomUUID } from 'node:crypto';
import type { PreprocessorGroup } from 'svelte/compiler';
import { Project, type SourceFile } from 'ts-morph';

import * as Markdown from '$lib/markdown/index.js';

import { resolveSvelte4Events } from './events.js';
import { resolveSvelte4Props } from './props.js';
import { resolveSvelte4Slots } from './slots.js';

type DataAttribute = `data-${string}`;
type Options = {
  /**
   * The data-attributes of the meta tag that contains the component configuration.
   */
  dataAttributes?: {
    /**
     * The data-attribute of the meta tag that contains the description of the component.
     *
     * @default "data-description"
     */
    description?: DataAttribute;
    /**
     * The data-attribute of the meta tag used to identify the tag as the configuration for the preprocessor.
     *
     * @default "data-doc"
     */
    global?: DataAttribute;
    /**
     * The data-attribute of the meta tag that contains the symbol of the events.
     *
     * @default "data-symbol-events"
     */
    events?: DataAttribute;
    /**
     * The data-attribute of the meta tag that contains the symbol of the props.
     *
     * @default "data-symbol-props"
     */
    props?: DataAttribute;
    /**
     * The data-attribute of the meta tag that contains the symbol of the slots.
     *
     * @default "data-symbol-slots"
     */
    slots?: DataAttribute;
  };
  /**
   * The symbols of the component.
   */
  symbols?: {
    /**
     * The symbol to look for inside the component that contains the events.
     *
     * @default "$$Events"
     */
    events?: string;
    /**
     * The symbol to look for inside the component that contains the props.
     *
     * @default "$$Props"
     */
    props?: string;
    /**
     * The symbol to look for inside the component that contains the slots.
     *
     * @default "$$Slots"
     */
    slots?: string;
  };
};

/**
 * A Svelte preprocessor that generates documentation for Svelte 4 components.
 *
 * @example
 * `src/lib/components/button.svelte`:
 * ```svelte
 * <script lang="ts">
 *  type $$Events = {
 *    click: MouseEvent;
 *  };
 *  type $$Props = {
 *    disabled?: boolean;
 *  };
 *  type $$Slots = {
 *    default: {
 *      foo: string;
 *    };
 *  };
 * </script>
 *
 * <meta
 *  data-doc
 *  data-symbol-events="$$Events"
 *  data-symbol-props="$$Props"
 *  data-symbol-slots="$$Slots"
 *  data-description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
 * />
 *
 * <button style="color: orangered;" on:click>
 *  <slot foo="bar" />
 * </button>
 * ```
 *
 * `dist/components/button.svelte`:
 * ```svelte
 * <script lang="ts">
 *  type $$Events = {
 *    click: MouseEvent;
 *  };
 *  type $$Props = {
 *    disabled?: boolean;
 *  };
 *  type $$Slots = {
 *    default: {
 *      foo: string;
 *    };
 *  };
 * </script>
 *
 * <!--
 * (at)component
 * Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 *
 * ### Events
 *
 * The following events are dispatched by this component:
 * | Event   |
 * | :------ |
 * | `click` |
 *
 * ### Props
 *
 * The following props are available for this component:
 * | Prop       | Description |
 * | :--------- | :---------- |
 * | `disabled` |             |
 *
 * ### Slots
 *
 * The following slots are available for this component:
 * | Slot      | Prop  |
 * | :-------- | :---- |
 * | `default` |       |
 * |           | `foo` |
 * -->
 *
 * <button style="color: orangered;" on:click>
 *  <slot foo="bar" />
 * </button>
 * ```
 */
export default function preprocessor(options: Options = {}): PreprocessorGroup {
  const {
    dataAttributes: {
      description: defaultDescriptionDataAttribute = 'data-description',
      global: defaultGlobalDataAttribute = 'data-doc',
      events: defaultEventsDataAttribute = 'data-symbol-events',
      props: defaultPropsDataAttribute = 'data-symbol-props',
      slots: defaultSlotsDataAttribute = 'data-symbol-slots',
    } = {},
    symbols: {
      events: defaultEventsSymbol = '$$Events',
      props: defaultPropsSymbol = '$$Props',
      slots: defaultSlotsSymbol = '$$Slots',
    } = {},
  } = options;
  const project = new Project();

  return {
    name: 'documentize-preprocessor',

    markup(context) {
      const { content, filename = '' } = context;
      const jsdom = new JSDOM(content);
      const meta = jsdom.window.document.querySelector<HTMLMetaElement>(
        `meta[${defaultGlobalDataAttribute}]`,
      );

      if (!meta) {
        return;
      }

      const scriptContextModule = jsdom.window.document.querySelector('script[context="module"]');
      const scriptNotContextModule = jsdom.window.document.querySelector(
        'script:not([context="module"])',
      );
      const sourceFile = project.createSourceFile(
        `${filename}_${randomUUID()}.ts`,
        `${scriptContextModule?.innerHTML ?? ''}\n${scriptNotContextModule?.innerHTML ?? ''}`,
      );
      const description =
        meta.attributes.getNamedItem(defaultDescriptionDataAttribute)?.textContent ?? '';
      const doc = buildDoc(sourceFile, description, {
        events:
          meta.attributes.getNamedItem(defaultEventsDataAttribute)?.textContent ??
          defaultEventsSymbol,
        props:
          meta.attributes.getNamedItem(defaultPropsDataAttribute)?.textContent ??
          defaultPropsSymbol,
        slots:
          meta.attributes.getNamedItem(defaultSlotsDataAttribute)?.textContent ??
          defaultSlotsSymbol,
      });

      const regex = new RegExp(`<meta\\s+${defaultGlobalDataAttribute}[^>]*>`, 'gm');
      const comment = `<!--\n@component\n${doc.trim()}\n-->`;
      const newCode = content.replace(regex, comment);
      const patchIsSuccessful = newCode.includes(comment);

      if (!patchIsSuccessful) {
        console.warn(`Failed to patch ${filename}`);

        return;
      }

      return {
        code: newCode,
      };
    },
  };
}

/**
 * Build the documentation of a Svelte 4 component.
 */
function buildDoc(
  sourceFile: SourceFile,
  description: string,
  symbols: NonNullable<Required<Options['symbols']>>,
) {
  const svelte4Events = resolveSvelte4Events(sourceFile, symbols.events);
  const svelte4Props = resolveSvelte4Props(sourceFile, symbols.props);
  const svelte4Slots = resolveSvelte4Slots(sourceFile, symbols.slots);
  const markdownBuilder = new Markdown.Builder();

  markdownBuilder.add(new Markdown.Paragraph(description), new Markdown.Heading(3, 'Events'));

  if (svelte4Events.length > 0) {
    svelte4Events.sort((a, b) => a.name.localeCompare(b.name)); // Sort events by name alphabetically

    markdownBuilder.add(
      new Markdown.Paragraph('The following events are dispatched by this component:'),
      new Markdown.Table(
        [
          {
            align: 'left',
            text: 'Event',
          },
        ],
        svelte4Events.map((event) => [`\`${event.name}\``]),
      ),
    );
  } else {
    markdownBuilder.add(new Markdown.Paragraph('This component does not dispatch any events.'));
  }

  markdownBuilder.add(new Markdown.Heading(3, 'Props'));

  if (svelte4Props.length > 0) {
    svelte4Props.sort((a, b) => a.name.localeCompare(b.name)); // Sort props by name alphabetically

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

        svelte4Props.map((prop) => [`\`${prop.name}\``, '']),
      ),
    );
  } else {
    markdownBuilder.add(new Markdown.Paragraph('This component does not have any props.'));
  }

  markdownBuilder.add(new Markdown.Heading(3, 'Slots'));

  if (svelte4Slots.length > 0) {
    svelte4Slots.sort((a, b) => a.name.localeCompare(b.name)); // Sort slots by name alphabetically

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
        svelte4Slots.reduce<[slot: string, prop: string][]>((acc, slot) => {
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
