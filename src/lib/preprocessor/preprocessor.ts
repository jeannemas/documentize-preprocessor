import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import type { MarkupPreprocessor, PreprocessorGroup, Processed } from 'svelte/compiler';
import { Project } from 'ts-morph';

import {
  resolveComponentConfig,
  resolveConfig,
  type Config,
  type ResolvedConfig,
} from './config.js';
import { PREPROCESSOR_NAME } from './constants.js';
import { resolveDescription } from './description.js';
import { Svelte4Event, resolveSvelte4Events } from './events.js';
import { Logger } from './logger.js';
import { buildMarkdown } from './markdown.js';
import { MetaTag, extractMetaTag } from './meta-tag.js';
import { Svelte4Prop, resolveSvelte4Props } from './props.js';
import { extractScriptContextModule, extractScriptNotContextModule } from './scripts.js';
import { Svelte4Slot, resolveSvelte4Slots } from './slots.js';
import { getInterfaceOrTypeAliasFromSymbolName } from './symbols.js';

/**
 * The results of processing a Svelte component.
 */
export const processedResultCodes = ['processed', 'skipped'] as const;

/**
 * The processed result of a Svelte component.
 */
export type ProcessedResultCode = (typeof processedResultCodes)[number];

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
export class Preprocessor implements PreprocessorGroup {
  /**
   * The logger for the preprocessor.
   */
  private readonly _logger: Logger;
  /**
   * The project for the preprocessor.
   */
  private readonly _project: Project;
  /**
   * The resolved configuration for the preprocessor.
   */
  private readonly _resolvedConfig: ResolvedConfig;

  readonly name = PREPROCESSOR_NAME;

  /**
   * Create a new preprocessor.
   */
  constructor(logger: Logger, project: Project, resolvedConfig: ResolvedConfig) {
    this._logger = logger;
    this._project = project;
    this._resolvedConfig = resolvedConfig;

    logger.info('Global config', resolvedConfig);
  }

  /**
   * Extract the metadata from the Svelte component.
   */
  extractComponentMetadata(filename: string, content: string, metaTag: MetaTag): Svelte4Metadata {
    const sourceFile = this._project.createSourceFile(
      join(filename, `${randomUUID()}_${Date.now()}.ts`), // We need to provide a unique filename to avoid race conflicts.
      `
${extractScriptContextModule(content)?.content ?? ''}
${extractScriptNotContextModule(content)?.content ?? ''}
`,
    );
    const resolvedComponentConfig = resolveComponentConfig(
      metaTag.attributes,
      this._resolvedConfig,
    );

    this._logger.info(`Patching '${filename}' based on provided config`, resolvedComponentConfig);

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
    const description = resolveDescription(metaTag.attributes, this._resolvedConfig);
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

    if (!eventsNode) {
      this._logger.warn(
        `Failed to resolve events for symbol '${resolvedComponentConfig.events}' inside '${filename}'`,
      );
    }

    if (!propsNode) {
      this._logger.warn(
        `Failed to resolve props for symbol '${resolvedComponentConfig.props}' inside '${filename}'`,
      );
    }

    if (!slotsNode) {
      this._logger.warn(
        `Failed to resolve slots for symbol '${resolvedComponentConfig.slots}' inside '${filename}'`,
      );
    }

    this._logger.info('Resolved description', description);
    this._logger.info(
      `Resolved Svelte 4 events from symbol '${resolvedComponentConfig.events}'`,
      events,
    );
    this._logger.info(
      `Resolved Svelte 4 props from symbol '${resolvedComponentConfig.props}'`,
      props,
    );
    this._logger.info(
      `Resolved Svelte 4 slots from symbol '${resolvedComponentConfig.slots}'`,
      slots,
    );

    return metadata;
  }

  /**
   * Process the markup of a Svelte component.
   */
  markup({ content, filename = '' }: Parameters<MarkupPreprocessor>[0]): ProcessedMarkup {
    const metaTag = extractMetaTag(content, this._resolvedConfig.dataAttributes.global);

    if (!metaTag) {
      // The component does not have any meta tag, so we can't generate any documentation.
      return new ProcessedMarkup({
        code: content,
        result: {
          code: 'skipped',
        },
      });
    }

    const metadata = this.extractComponentMetadata(filename, content, metaTag);
    const newCode = this.patchContent(content, metaTag.regex, metadata);

    return new ProcessedMarkup({
      code: newCode,
      result: {
        code: 'processed',
        metadata,
      },
    });
  }

  /**
   * Patch the content of the Svelte component.
   */
  patchContent(content: string, regex: RegExp, metadata: Svelte4Metadata): string {
    const markdown = buildMarkdown(metadata);
    const comment = `<!--\n${markdown}\n-->`;
    const newCode = content.replace(regex, comment);
    const patchIsSuccessful = newCode.includes(comment);

    if (!patchIsSuccessful) {
      this._logger.warn(`Failed to patch ${metadata.filename}`);

      return content;
    }

    return newCode;
  }

  /**
   * Create a new preprocessor with the provided configuration.
   */
  static create(
    tsConfigFilePath: string | undefined = undefined,
    config: Config = {},
  ): Preprocessor {
    const resolvedConfig = resolveConfig(config);
    const logger = new Logger(console, resolvedConfig.debug);
    const project = new Project({
      tsConfigFilePath,
    });

    return new Preprocessor(logger, project, resolvedConfig);
  }
}
