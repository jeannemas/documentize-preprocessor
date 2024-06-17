import { JSDOM } from 'jsdom';
import type { PreprocessorGroup } from 'svelte/compiler';
import { Project } from 'ts-morph';

import { extractSvelte4ComponentParts } from './component.js';
import { resolveComponentConfig, resolveConfig, type Config } from './config.js';
import { resolveDescription } from './description.js';
import { buildDoc } from './doc.js';
import { resolveSvelte4Events } from './events.js';
import { resolveSvelte4Props } from './props.js';
import { resolveSvelte4Slots } from './slots.js';

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
export default function documentizePreprocessor(config: Config = {}): PreprocessorGroup {
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

      const { contextModule, notContextModule } = extractSvelte4ComponentParts(content).scripts;
      const sourceFileContent = `${contextModule.content}\n${notContextModule.content}`;
      const sourceFile = project.createSourceFile(`${filename}.ts`, sourceFileContent);
      const description = resolveDescription(meta.attributes, resolvedConfig);
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

      if (resolvedConfig.debug) {
        console.info('Resolved description', description);
        console.info(
          `Resolved Svelte 4 events from symbol '${resolvedComponentConfig.events}'`,
          svelte4Events,
        );
        console.info(
          `Resolved Svelte 4 props from symbol '${resolvedComponentConfig.props}'`,
          svelte4Props,
        );
        console.info(
          `Resolved Svelte 4 slots from symbol '${resolvedComponentConfig.slots}'`,
          svelte4Slots,
        );
      }

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
