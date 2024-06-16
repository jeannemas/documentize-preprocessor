import type { RecursiveRequired } from '@sveltejs/kit';
import { JSDOM } from 'jsdom';
import type { PreprocessorGroup } from 'svelte/compiler';
import { Project, type SourceFile } from 'ts-morph';

import * as Markdown from '$lib/markdown/index.js';

type DataAttribute = `data-${string}`;
type Config = {
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
   * Whether to enable debug mode.
   *
   * Debug mode will log additional information to the console.
   */
  debug?: boolean;
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
type ResolvedConfig = RecursiveRequired<Config>;
type ResolvedComponentConfig = ResolvedConfig['symbols'];
type Svelte4Event = {
  /**
   * The name of the event.
   */
  name: string;
};
type Svelte4Prop = {
  /**
   * The name of the prop.
   */
  name: string;
};
type Svelte4Slot = {
  /**
   * The name of the slot.
   */
  name: string;
  properties: {
    /**
     * The name of the property.
     */
    name: string;
  }[];
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
 *
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
export default function preprocessor(config: Config = {}): PreprocessorGroup {
  const resolvedConfig = resolveConfig(config);
  const project = new Project();

  if (resolvedConfig.debug) {
    console.info('Global config', resolvedConfig);
  }

  return {
    name: 'documentize-preprocessor',

    markup({ content, filename = '' }) {
      const jsdom = new JSDOM(content);
      const meta = jsdom.window.document.querySelector<HTMLMetaElement>(
        `meta[${resolvedConfig.dataAttributes.global}]`,
      );

      if (!meta) {
        if (resolvedConfig.debug) {
          console.warn(`Failed to find meta tag inside '${filename}'`);
        }

        return;
      }

      const resolvedComponentConfig = resolveComponentConfig(resolvedConfig, meta.attributes);

      if (resolvedConfig.debug) {
        console.info(`Patching '${filename}' based on provided config`, resolvedComponentConfig);
      }

      const scriptContextModule = jsdom.window.document.querySelector('script[context="module"]');
      const scriptNotContextModule = jsdom.window.document.querySelector(
        'script:not([context="module"])',
      );
      const sourceFileContent = `${scriptContextModule?.innerHTML ?? ''}\n${scriptNotContextModule?.innerHTML ?? ''}`;
      const sourceFile = project.createSourceFile(`${filename}.ts`, sourceFileContent);
      const svelte4Events = resolveSvelte4Events(
        filename,
        resolvedComponentConfig,
        resolvedConfig,
        sourceFile,
      );
      const svelte4Props = resolveSvelte4Props(
        filename,
        resolvedComponentConfig,
        resolvedConfig,
        sourceFile,
      );
      const svelte4Slots = resolveSvelte4Slots(
        filename,
        resolvedComponentConfig,
        resolvedConfig,
        sourceFile,
      );
      const description = resolveDescription(meta.attributes, resolvedConfig);
      const doc = buildDoc(svelte4Events, svelte4Props, svelte4Slots, description);
      const regex = new RegExp(`<meta\\s+${resolvedConfig.dataAttributes.global}[^>]*>`, 'gm');
      const comment = `<!--\n${doc.trim()}\n-->`;
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
 * Resolve the configuration of the preprocessor.
 */
function resolveConfig(config: Config): ResolvedConfig {
  const dataAttributeRegex = /^data-[a-zA-Z0-9-]+$/;
  const resolvedConfig = {
    dataAttributes: {
      description: config.dataAttributes?.description ?? 'data-description',
      global: config.dataAttributes?.global ?? 'data-doc',
      events: config.dataAttributes?.events ?? 'data-symbol-events',
      props: config.dataAttributes?.props ?? 'data-symbol-props',
      slots: config.dataAttributes?.slots ?? 'data-symbol-slots',
    },
    debug: config.debug ?? false,
    symbols: {
      events: config.symbols?.events ?? '$$Events',
      props: config.symbols?.props ?? '$$Props',
      slots: config.symbols?.slots ?? '$$Slots',
    },
  } satisfies ResolvedConfig;

  if (!dataAttributeRegex.test(resolvedConfig.dataAttributes.description)) {
    throw new Error(
      `Invalid description data-attribute '${resolvedConfig.dataAttributes.description}'. Expected format '${dataAttributeRegex.source}'.`,
    );
  }

  if (!dataAttributeRegex.test(resolvedConfig.dataAttributes.global)) {
    throw new Error(
      `Invalid global data-attribute '${resolvedConfig.dataAttributes.global}'. Expected format '${dataAttributeRegex.source}'.`,
    );
  }

  if (!dataAttributeRegex.test(resolvedConfig.dataAttributes.events)) {
    throw new Error(
      `Invalid events data-attribute '${resolvedConfig.dataAttributes.events}'. Expected format '${dataAttributeRegex.source}'.`,
    );
  }

  if (!dataAttributeRegex.test(resolvedConfig.dataAttributes.props)) {
    throw new Error(
      `Invalid props data-attribute '${resolvedConfig.dataAttributes.props}'. Expected format '${dataAttributeRegex.source}'.`,
    );
  }

  if (!dataAttributeRegex.test(resolvedConfig.dataAttributes.slots)) {
    throw new Error(
      `Invalid slots data-attribute '${resolvedConfig.dataAttributes.slots}'. Expected format '${dataAttributeRegex.source}'.`,
    );
  }

  return resolvedConfig;
}

/**
 * Resolve the configuration of a component.
 */
function resolveComponentConfig(
  resolvedConfig: ResolvedConfig,
  attributes: NamedNodeMap,
): ResolvedComponentConfig {
  const events =
    attributes.getNamedItem(resolvedConfig.dataAttributes.events)?.textContent ??
    resolvedConfig.symbols.events;
  const props =
    attributes.getNamedItem(resolvedConfig.dataAttributes.props)?.textContent ??
    resolvedConfig.symbols.props;
  const slots =
    attributes.getNamedItem(resolvedConfig.dataAttributes.slots)?.textContent ??
    resolvedConfig.symbols.slots;

  return {
    events,
    props,
    slots,
  };
}

/**
 * Resolve the description of a component.
 */
function resolveDescription(attributes: NamedNodeMap, resolvedConfig: ResolvedConfig): string {
  return attributes.getNamedItem(resolvedConfig.dataAttributes.description)?.textContent ?? '';
}

/**
 * Resolve the Svelte 4 events of a component.
 */
function resolveSvelte4Events(
  filename: string,
  resolvedComponentConfig: ResolvedComponentConfig,
  resolvedConfig: ResolvedConfig,
  sourceFile: SourceFile,
): Svelte4Event[] {
  const events: Svelte4Event[] = [];
  const node =
    sourceFile.getTypeAlias(resolvedComponentConfig.events) ??
    sourceFile.getInterface(resolvedComponentConfig.events);

  if (!node) {
    if (resolvedConfig.debug) {
      console.warn(
        `Failed to resolve events for symbol '${resolvedComponentConfig.events}' inside '${filename}'`,
      );
    }

    return events;
  }

  for (const symbol of node.getType().getProperties()) {
    events.push({
      name: symbol.getName(),
    });
  }

  return events;
}

/**
 * Resolve the Svelte 4 props of a component.
 */
function resolveSvelte4Props(
  filename: string,
  resolvedComponentConfig: ResolvedComponentConfig,
  resolvedConfig: ResolvedConfig,
  sourceFile: SourceFile,
): Svelte4Prop[] {
  const props: Svelte4Prop[] = [];
  const node =
    sourceFile.getTypeAlias(resolvedComponentConfig.props) ??
    sourceFile.getInterface(resolvedComponentConfig.props);

  if (!node) {
    if (resolvedConfig.debug) {
      console.warn(
        `Failed to resolve props for symbol '${resolvedComponentConfig.props}' inside '${filename}'`,
      );
    }

    return props;
  }

  for (const symbol of node.getType().getProperties()) {
    props.push({
      name: symbol.getName(),
    });
  }

  return props;
}

/**
 * Resolve the Svelte 4 slots of a component.
 */
function resolveSvelte4Slots(
  filename: string,
  resolvedComponentConfig: ResolvedComponentConfig,
  resolvedConfig: ResolvedConfig,
  sourceFile: SourceFile,
): Svelte4Slot[] {
  const slots: Svelte4Slot[] = [];
  const node =
    sourceFile.getTypeAlias(resolvedComponentConfig.slots) ??
    sourceFile.getInterface(resolvedComponentConfig.slots);

  if (!node) {
    if (resolvedConfig.debug) {
      console.warn(
        `Failed to resolve slots for symbol '${resolvedComponentConfig.slots}' inside '${filename}'`,
      );
    }

    return slots;
  }

  for (const symbol of node.getType().getProperties()) {
    const properties: Svelte4Slot['properties'] = [];

    for (const prop of symbol.getValueDeclarationOrThrow().getType().getProperties()) {
      properties.push({
        name: prop.getName(),
      });
    }

    slots.push({
      name: symbol.getName(),
      properties,
    });
  }

  return slots;
}

/**
 * Build the documentation of a Svelte 4 component.
 */
function buildDoc(
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
