import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import type { PreprocessorGroup, Processed } from 'svelte/compiler';
import { Project } from 'ts-morph';

import { resolveComponentConfig, resolveConfig, type Config } from './config.js';
import { PREPROCESSOR_NAME } from './constants.js';
import { resolveDescription } from './description.js';
import { Svelte4Event, resolveSvelte4Events } from './events.js';
import { buildMarkdown } from './markdown.js';
import { extractMetaTag } from './meta-tag.js';
import { Svelte4Prop, resolveSvelte4Props } from './props.js';
import { extractScriptContextModule, extractScriptNotContextModule } from './scripts.js';
import { Svelte4Slot, resolveSvelte4Slots } from './slots.js';
import { getInterfaceOrTypeAliasFromSymbolName } from './symbols.js';

/**
 * The processed markup of a Svelte component.
 */
export class ProcessedMarkup implements Processed {
  /**
   * The processed code.
   */
  readonly code: string;
  /**
   * The result of the processing.
   */
  readonly result:
    | {
        code: 'processed';
        metadata: Svelte4Metadata;
      }
    | {
        code: 'skipped';
        metadata?: never;
      };

  constructor({ code, result }: Pick<ProcessedMarkup, 'code' | 'result'>) {
    this.code = code;
    this.result = result;
  }
}

/**
 * The metadata of a Svelte 4 component.
 */
export class Svelte4Metadata {
  /**
   * The filename of the component.
   */
  readonly filename: string;
  /**
   * The description of the component.
   */
  readonly description: string;
  /**
   * The events of the component.
   */
  readonly events: Svelte4Event[];
  /**
   * The props of the component.
   */
  readonly props: Svelte4Prop[];
  /**
   * The slots of the component.
   */
  readonly slots: Svelte4Slot[];

  /**
   * Create a new metadata.
   */
  constructor({
    description,
    events,
    filename,
    props,
    slots,
  }: Pick<Svelte4Metadata, 'description' | 'events' | 'filename' | 'props' | 'slots'>) {
    this.filename = filename;
    this.description = description;
    this.events = events;
    this.props = props;
    this.slots = slots;
  }
}

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
 *  data-documentize
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
export default function documentizePreprocessor(
  tsConfigFilePath: string | undefined = undefined,
  config: Config = {},
) {
  const project = new Project({
    tsConfigFilePath,
  });
  const resolvedConfig = resolveConfig(config);

  return {
    markup({ content, filename = '' }): ProcessedMarkup {
      const metaTag = extractMetaTag(content, resolvedConfig.dataAttributes.global);

      if (!metaTag) {
        // The component does not have any meta tag, so we can't generate any documentation.
        return new ProcessedMarkup({
          code: content,
          result: {
            code: 'skipped',
          },
        });
      }

      const sourceFile = project.createSourceFile(
        join(filename, `${randomUUID()}_${Date.now()}.ts`), // We need to provide a unique filename to avoid race conflicts.
        `
${extractScriptContextModule(content)?.content ?? ''}
${extractScriptNotContextModule(content)?.content ?? ''}
`,
      );
      const resolvedComponentConfig = resolveComponentConfig(metaTag.attributes, resolvedConfig);

      const eventsNode = getInterfaceOrTypeAliasFromSymbolName(
        resolvedComponentConfig.events,
        sourceFile,
      );
      const propsNode = getInterfaceOrTypeAliasFromSymbolName(
        resolvedComponentConfig.props,
        sourceFile,
      );
      const slotsNode = getInterfaceOrTypeAliasFromSymbolName(
        resolvedComponentConfig.slots,
        sourceFile,
      );
      const description = resolveDescription(metaTag.attributes, resolvedConfig);
      const events = eventsNode ? resolveSvelte4Events(eventsNode) : [];
      const props = propsNode ? resolveSvelte4Props(propsNode) : [];
      const slots = slotsNode ? resolveSvelte4Slots(slotsNode) : [];
      const metadata = new Svelte4Metadata({
        description,
        events,
        filename,
        props,
        slots,
      });
      const newCode = content.replace(metaTag.regex, `<!--\n${buildMarkdown(metadata)}\n-->`);

      return new ProcessedMarkup({
        code: newCode,
        result: {
          code: 'processed',
          metadata,
        },
      });
    },
    name: PREPROCESSOR_NAME,
  } satisfies PreprocessorGroup;
}
