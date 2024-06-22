import { join } from 'node:path';
import type { MarkupPreprocessor, PreprocessorGroup } from 'svelte/compiler';
import { Project } from 'ts-morph';

import { resolveComponentConfig, type ResolvedConfig } from './config.js';
import { PREPROCESSOR_NAME } from './constants.js';
import { resolveDescription } from './description.js';
import { resolveSvelte4Events, resolveSvelte4EventsNode } from './events.js';
import { Logger } from './logger.js';
import { buildMarkdown } from './markdown.js';
import { extractMeta } from './meta.js';
import { resolveSvelte4Props, resolveSvelte4PropsNode } from './props.js';
import { extractScriptContextModule, extractScriptNotContextModule } from './scripts.js';
import { resolveSvelte4Slots, resolveSvelte4SlotsNode } from './slots.js';

/**
 * A Svelte preprocessor that generates documentation for Svelte 4 components.
 */
export class Preprocessor implements PreprocessorGroup {
  /**
   * The logger for the preprocessor.
   */
  #logger: Logger;
  /**
   * The project for the preprocessor.
   */
  #project: Project;
  /**
   * The resolved configuration for the preprocessor.
   */
  #resolvedConfig: ResolvedConfig;

  readonly name = PREPROCESSOR_NAME;

  /**
   * Create a new preprocessor.
   */
  constructor(logger: Logger, project: Project, resolvedConfig: ResolvedConfig) {
    this.#logger = logger;
    this.#project = project;
    this.#resolvedConfig = resolvedConfig;
  }

  /**
   * Process the markup of a Svelte component.
   */
  markup(...params: Parameters<MarkupPreprocessor>) {
    const [{ content, filename = '' }] = params;
    const meta = extractMeta(content, this.#resolvedConfig.dataAttributes.global);

    if (!meta) {
      // The component does not have any metadata, so we can't generate any documentation.
      return;
    }

    const resolvedComponentConfig = resolveComponentConfig(meta.attributes, this.#resolvedConfig);

    this.#logger.info(`Patching '${filename}' based on provided config`, resolvedComponentConfig);

    const scriptContextModule = extractScriptContextModule(content);
    const scriptNotContextModule = extractScriptNotContextModule(content);
    const sourceFileContent = `${scriptContextModule?.content ?? ''}\n${scriptNotContextModule?.content ?? ''}`;
    const sourceFile = this.#project.createSourceFile(
      join(filename, `${Date.now()}.ts`),
      sourceFileContent,
    );
    const description = resolveDescription(meta.attributes, this.#resolvedConfig);
    const eventsNode = resolveSvelte4EventsNode(resolvedComponentConfig.events, sourceFile);
    const propsNode = resolveSvelte4PropsNode(resolvedComponentConfig.props, sourceFile);
    const slotsNode = resolveSvelte4SlotsNode(resolvedComponentConfig.slots, sourceFile);
    const svelte4Events = eventsNode ? resolveSvelte4Events(eventsNode) : [];
    const svelte4Props = propsNode ? resolveSvelte4Props(propsNode) : [];
    const svelte4Slots = slotsNode ? resolveSvelte4Slots(slotsNode) : [];

    if (!eventsNode) {
      this.#logger.warn(
        `Failed to resolve events for symbol '${resolvedComponentConfig.events}' inside '${filename}'`,
      );
    }

    if (!propsNode) {
      this.#logger.warn(
        `Failed to resolve props for symbol '${resolvedComponentConfig.props}' inside '${filename}'`,
      );
    }

    if (!slotsNode) {
      this.#logger.warn(
        `Failed to resolve slots for symbol '${resolvedComponentConfig.slots}' inside '${filename}'`,
      );
    }

    this.#logger.info('Resolved description', description);
    this.#logger.info(
      `Resolved Svelte 4 events from symbol '${resolvedComponentConfig.events}'`,
      svelte4Events,
    );
    this.#logger.info(
      `Resolved Svelte 4 props from symbol '${resolvedComponentConfig.props}'`,
      svelte4Props,
    );
    this.#logger.info(
      `Resolved Svelte 4 slots from symbol '${resolvedComponentConfig.slots}'`,
      svelte4Slots,
    );

    const markdown = buildMarkdown(svelte4Events, svelte4Props, svelte4Slots, description);
    const comment = `<!--\n${markdown}\n-->`;
    const newCode = content.replace(meta.regex, comment);
    const patchIsSuccessful = newCode.includes(comment);

    if (!patchIsSuccessful) {
      this.#logger.warn(`Failed to patch ${filename}`);

      return;
    }

    return {
      code: newCode,
    };
  }
}
