import { JSDOM } from 'jsdom';
import { randomUUID } from 'node:crypto';
import { Project } from 'ts-morph';

import * as Markdown from '../markdown/index.js';

/**
 * A Svelte preprocessor that generates documentation for Svelte 4 components.
 *
 * @param {object} [options={}] The options of the preprocessor.
 * @param {object} [options.identifiers={}] The identifiers of the meta tag that contains the component configuration.
 * @param {string} [options.identifiers.description="data-description"] The identifier of the meta tag that contains the description of the component. Defaults to `data-description`.
 * @param {string} [options.identifiers.global="data-doc"] The identifier of the meta tag that contains the symbols of the component. Defaults to `data-doc`.
 * @param {string} [options.identifiers.events="data-symbol-events"] The identifier of the meta tag that contains the symbol of the events. Defaults to `data-symbol-events`.
 * @param {string} [options.identifiers.props="data-symbol-props"] The identifier of the meta tag that contains the symbol of the props. Defaults to `data-symbol-props`.
 * @param {string} [options.identifiers.slots="data-symbol-slots"] The identifier of the meta tag that contains the symbol of the slots. Defaults to `data-symbol-slots`.
 * @param {object} [options.symbols={}] The symbols of the component that contains the events, props, and slots.
 * @param {string} [options.symbols.events="$$Events"] The symbol of the component that contains the events. Defaults to `$$Events`.
 * @param {string} [options.symbols.props="$$Props"] The symbol of the component that contains the props. Defaults to `$$Props`.
 * @param {string} [options.symbols.slots="$$Slots"] The symbol of the component that contains the slots. Defaults to `$$Slots`.
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
export default function preprocessor(options = {}) {
  const project = new Project();

  return /** @type {import('svelte/compiler').PreprocessorGroup} */ ({
    name: 'svelte-components-doc-generator-preprocessor',

    markup(context) {
      const { content, filename = '' } = context;
      const jsdom = new JSDOM(content);
      const globalIdentifier = options.identifiers?.global ?? 'data-doc';
      /** @type {HTMLMetaElement | null} */
      const meta = jsdom.window.document.querySelector(`meta[${globalIdentifier}]`);

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
        meta.attributes.getNamedItem(options.identifiers?.description ?? 'data-description')
          ?.textContent ?? '';
      const doc = buildDoc(sourceFile, description, {
        events:
          meta.attributes.getNamedItem(options.identifiers?.events ?? 'data-symbol-events')
            ?.textContent ?? '$$Events',
        props:
          meta.attributes.getNamedItem(options.identifiers?.props ?? 'data-symbol-props')
            ?.textContent ?? '$$Props',
        slots:
          meta.attributes.getNamedItem(options.identifiers?.slots ?? 'data-symbol-slots')
            ?.textContent ?? '$$Slots',
      });

      const regex = new RegExp(`<meta\\s+${globalIdentifier}[^>]*>`, 'gm');
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
  });
}

/**
 * Resolve the Svelte 4 events of a component.
 *
 * @param {import('ts-morph').SourceFile} sourceFile
 * @param {string} symbolKey
 */
function resolveSvelte4Events(sourceFile, symbolKey) {
  const node = sourceFile.getTypeAlias(symbolKey) ?? sourceFile.getInterface(symbolKey);

  if (!node) {
    return [];
  }

  return node
    .getType()
    .getProperties()
    .map((symbol) => ({
      comment: symbol.compilerSymbol.getDocumentationComment(undefined),
      name: symbol.getName(),
    }));
}

/**
 * Resolve the Svelte 4 props of a component.
 *
 * @param {import('ts-morph').SourceFile} sourceFile
 * @param {string} symbolKey
 */
function resolveSvelte4Props(sourceFile, symbolKey) {
  const node = sourceFile.getTypeAlias(symbolKey) ?? sourceFile.getInterface(symbolKey);

  if (!node) {
    return [];
  }

  return node
    .getType()
    .getProperties()
    .map((symbol) => ({
      comment: symbol.compilerSymbol.getDocumentationComment(undefined),
      name: symbol.getName(),
    }));
}

/**
 * Resolve the Svelte 4 slots of a component.
 *
 * @param {import('ts-morph').SourceFile} sourceFile
 * @param {string} symbolKey
 */
function resolveSvelte4Slots(sourceFile, symbolKey) {
  const node = sourceFile.getTypeAlias(symbolKey) ?? sourceFile.getInterface(symbolKey);

  if (!node) {
    return [];
  }

  return node
    .getType()
    .getProperties()
    .map((symbol) => ({
      comment: symbol.compilerSymbol.getDocumentationComment(undefined),
      name: symbol.getName(),
      properties: symbol
        .getValueDeclarationOrThrow()
        .getType()
        .getProperties()
        .map((prop) => ({
          name: prop.getName(),
          comment: prop.compilerSymbol.getDocumentationComment(undefined),
        })),
    }));
}

/**
 * Build the documentation of a Svelte 4 component.
 *
 * @param {import('ts-morph').SourceFile} sourceFile The Typescript of the component extracted into a source file.
 * @param {string} description The description of the component.
 * @param {{
 *  events: string;
 *  props: string;
 *  slots: string;
 * }} symbols
 */
function buildDoc(sourceFile, description, symbols) {
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
        svelte4Slots.reduce((acc, slot) => {
          acc.push([`\`${slot.name}\``, '']);

          for (const property of slot.properties) {
            acc.push(['', `\`${property.name}\``]);
          }

          return acc;
        }, /** @type {[slot: string, prop: string][]} */ ([])),
      ),
    );
  } else {
    markdownBuilder.add(new Markdown.Paragraph('This component does not have any slots.'));
  }

  return markdownBuilder.toString();
}
