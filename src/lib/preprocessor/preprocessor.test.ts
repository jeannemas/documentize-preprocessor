import { Project } from 'ts-morph';
import { describe, expect, it } from 'vitest';

import { generateAlphabeat } from '$lib/utils/alphabeat.js';
import { randomString } from '$lib/utils/strings.js';

import { randomBoolean } from '$lib/utils/booleans.js';
import { randomInteger } from '$lib/utils/numbers.js';
import { resolveConfig, type Config } from './config.js';
import { Svelte4Event } from './events.js';
import { generateRandomEvents } from './events.test.js';
import { Logger } from './logger.js';
import { SilentLogger } from './logger.test.js';
import { extractMetaTag } from './meta-tag.js';
import {
  Preprocessor,
  ProcessedMarkup,
  Svelte4Metadata,
  type ProcessedResultCode,
} from './preprocessor.js';
import { Svelte4Prop } from './props.js';
import { generateRandomProps } from './props.test.js';
import { Svelte4Slot, Svelte4SlotProperty } from './slots.js';
import { generateRandomSlots } from './slots.test.js';

describe(Preprocessor.name, () => {
  describe(Preprocessor.create.name, () => {
    it('Should create a new preprocessor', () => {
      // Arrange
      const tsConfigFilePath = undefined;
      const config = {} satisfies Config;

      // Act
      const action = () => Preprocessor.create(tsConfigFilePath, config);

      // Assert
      expect(action).not.toThrowError();

      const maybePreprocessor = action();

      expect(maybePreprocessor).toBeInstanceOf(Preprocessor);
    });
  });

  describe('constructor', () => {
    it('Should create a new instance', () => {
      // Arrange
      const resolvedConfig = resolveConfig();
      const logger = new Logger(console, resolvedConfig.debug);
      const project = new Project();

      // Act
      const action = () => new Preprocessor(logger, project, resolvedConfig);

      // Assert
      expect(action).not.toThrowError();

      const maybePreprocessor = action();

      expect(maybePreprocessor).toBeInstanceOf(Preprocessor);
    });
  });

  describe('extractComponentMetadata' satisfies keyof Preprocessor, () => {
    it('Should extract the component metadata', () => {
      // Arrange
      const resolvedConfig = resolveConfig({
        debug: true,
      });
      const preprocessor = new Preprocessor(
        new Logger(new SilentLogger(), resolvedConfig.debug),
        new Project(),
        resolvedConfig,
      );
      const filename = randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: 16,
      });
      const content = `
<script lang="ts">
  type $$Events = {};
  type $$Props = {};
  type $$Slots = {};
</script>

<meta
  ${resolvedConfig.dataAttributes.global}
/>
`;
      const metaTag = extractMetaTag(content, resolvedConfig.dataAttributes.global);

      // Act
      const action = () => preprocessor.extractComponentMetadata(filename, content, metaTag!);

      // Assert
      expect(action).not.toThrowError();

      const maybeMetadata = action();

      expect(maybeMetadata).toBeInstanceOf(Svelte4Metadata);
    });
  });

  describe('markup' satisfies keyof Preprocessor, () => {
    it('Should process the markup', () => {
      // Arrange
      const resolvedConfig = resolveConfig();
      const loggerConsole = new SilentLogger();
      const preprocessor = new Preprocessor(
        new Logger(loggerConsole, resolvedConfig.debug),
        new Project(),
        resolvedConfig,
      );
      const filename = randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: 16,
      });
      const content = `
<meta
  ${resolvedConfig.dataAttributes.global}
/>
`;

      // Act
      const action = () => preprocessor.markup({ content, filename });

      // Assert
      expect(action).not.toThrowError();

      const maybeProcessed = action();

      expect(maybeProcessed).toBeInstanceOf(ProcessedMarkup);
      expect(maybeProcessed.result.code).toBe<ProcessedResultCode>('processed');
    });

    it('Should not process the markup', () => {
      // Arrange
      const resolvedConfig = resolveConfig();
      const loggerConsole = new SilentLogger();
      const preprocessor = new Preprocessor(
        new Logger(loggerConsole, resolvedConfig.debug),
        new Project(),
        resolvedConfig,
      );
      const filename = randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: 16,
      });
      const content = `
<meta
 data-not-documentize
/>
`;

      // Act
      const action = () => preprocessor.markup({ content, filename });

      // Assert
      expect(action).not.toThrowError();

      const maybeProcessed = action();

      expect(maybeProcessed).toBeInstanceOf(ProcessedMarkup);
      expect(maybeProcessed.result.code).toBe<ProcessedResultCode>('skipped');
    });

    it('Should process the markup and extract all the metadata', () => {
      // Arrange
      const resolvedConfig = resolveConfig();
      const loggerConsole = new SilentLogger();
      const preprocessor = new Preprocessor(
        new Logger(loggerConsole, resolvedConfig.debug),
        new Project(),
        resolvedConfig,
      );
      const filename = 'src/lib/components/button.svelte';
      const description = randomString({
        alphabeat: [...generateAlphabeat('a', 'z'), ...generateAlphabeat('A', 'Z')],
        length: 256,
      });
      const events = generateRandomEvents(
        randomInteger({
          max: 10,
          min: 5,
        }),
      );
      const eventsSymbol = randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: 16,
      });
      const props = generateRandomProps(
        randomInteger({
          max: 10,
          min: 5,
        }),
      );
      const propsSymbol = randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: 16,
      });
      const slots = generateRandomSlots(
        randomInteger({
          max: 10,
          min: 5,
        }),
        randomInteger({
          max: 10,
          min: 5,
        }),
      );
      const slotsSymbol = randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: 16,
      });

      if (randomBoolean()) {
        events.push(
          new Svelte4Event({
            name: 'click',
          }),
        );
      }

      if (randomBoolean()) {
        props.push(
          new Svelte4Prop({
            name: 'disabled',
          }),
        );
      }

      if (randomBoolean()) {
        slots.push(
          new Svelte4Slot({
            name: 'default',
            properties: [],
          }),
        );
      }

      const content = `
<script lang="ts">
  type ${eventsSymbol} = {
    ${events.map((event) => `${event.name}: unknown;`).join('\n')}
  };
  type ${propsSymbol} = {
    ${props.map((prop) => `${prop.name}: unknown;`).join('\n')}
  };
  type ${slotsSymbol} = {
    ${slots.map((slot) => `${slot.name}: { ${slot.properties.map((property) => `${property.name}: unknown;`).join('\n')} };`).join('\n')}
  };
 </script>

<meta
  data-documentize
  data-symbol-events="${eventsSymbol}"
  data-symbol-props="${propsSymbol}"
  data-symbol-slots="${slotsSymbol}"
  data-description="${description}"
/>

<button disabled="{$$props.disabled}" style="color: orangered;" on:click>
  <slot foo="bar" />
</button>
`;

      // Act
      const processedMarkup = preprocessor.markup({ content, filename });

      // Assert
      expect(processedMarkup).toBeInstanceOf(ProcessedMarkup);
      expect(processedMarkup.result.code).toBe<ProcessedResultCode>('processed');

      const metadata = processedMarkup.result.metadata!;

      expect(metadata).toBeInstanceOf(Svelte4Metadata);
      expect(metadata.description).toEqual(description);

      for (const event of events) {
        const maybeMatchingEvent =
          metadata.events.find((maybeEvent) => maybeEvent.name === event.name) ?? null;

        expect(maybeMatchingEvent).not.toBeNull();
        expect(maybeMatchingEvent).toBeInstanceOf(Svelte4Event);
      }

      for (const maybeEvent of metadata.events) {
        const matchingEvent = events.find((event) => event.name === maybeEvent.name) ?? null;

        expect(matchingEvent).not.toBeNull();
        expect(matchingEvent).toBeInstanceOf(Svelte4Event);
      }

      for (const prop of props) {
        const maybeMatchingProp =
          metadata.props.find((maybeProp) => maybeProp.name === prop.name) ?? null;

        expect(maybeMatchingProp).not.toBeNull();
        expect(maybeMatchingProp).toBeInstanceOf(Svelte4Prop);
      }

      for (const maybeProp of metadata.props) {
        const matchingProp = props.find((prop) => prop.name === maybeProp.name) ?? null;

        expect(matchingProp).not.toBeNull();
        expect(matchingProp).toBeInstanceOf(Svelte4Prop);
      }

      for (const slot of slots) {
        const maybeMatchingSlot =
          metadata.slots.find((maybeSlot) => maybeSlot.name === slot.name) ?? null;

        expect(maybeMatchingSlot).not.toBeNull();
        expect(maybeMatchingSlot).toBeInstanceOf(Svelte4Slot);
        expect(maybeMatchingSlot!.properties).toHaveLength(slot.properties.length);

        for (const maybeProp of maybeMatchingSlot!.properties) {
          const matchingProp = slot.properties.find((prop) => prop.name === maybeProp.name) ?? null;

          expect(matchingProp).not.toBeNull();
          expect(matchingProp).toBeInstanceOf(Svelte4SlotProperty);
        }
      }

      for (const maybeSlot of metadata.slots) {
        const matchingSlot = slots.find((slot) => slot.name === maybeSlot.name) ?? null;

        expect(matchingSlot).not.toBeNull();
        expect(matchingSlot).toBeInstanceOf(Svelte4Slot);
        expect(matchingSlot!.properties).toHaveLength(maybeSlot.properties.length);

        for (const maybeProp of matchingSlot!.properties) {
          const matchingProp =
            maybeSlot.properties.find((prop) => prop.name === maybeProp.name) ?? null;

          expect(matchingProp).not.toBeNull();
          expect(matchingProp).toBeInstanceOf(Svelte4SlotProperty);
        }
      }
    });
  });

  describe('name' satisfies keyof Preprocessor, () => {
    it('Should be defined as a string', () => {
      // Arrange
      const preprocessor = Preprocessor.create();

      // Act
      const action = () => preprocessor.name;

      // Assert
      expect(action).not.toThrowError();

      const maybeString = action();

      expect(maybeString).toBeTypeOf('string');
    });
  });

  describe('patchContent' satisfies keyof Preprocessor, () => {
    it('Should patch the content', () => {
      // Arrange
      const resolvedConfig = resolveConfig();
      const loggerConsole = new SilentLogger();
      const preprocessor = new Preprocessor(
        new Logger(loggerConsole, resolvedConfig.debug),
        new Project(),
        resolvedConfig,
      );
      const filename = randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: 16,
      });
      const content = `
<meta
  ${resolvedConfig.dataAttributes.global}
/>
`;
      const metaTag = extractMetaTag(content, resolvedConfig.dataAttributes.global);
      const metadata = preprocessor.extractComponentMetadata(filename, content, metaTag!);

      // Act
      const action = () => preprocessor.patchContent(content, metaTag!.regex, metadata);

      // Assert
      const warnsCountBefore = loggerConsole.warnLogs.length;

      expect(action).not.toThrowError();

      const warnsCountAfter = loggerConsole.warnLogs.length;

      expect(warnsCountAfter).toEqual(warnsCountBefore);
    });

    it('Should fail the patch', () => {
      // Arrange
      const resolvedConfig = resolveConfig({
        debug: true,
      });
      const loggerConsole = new SilentLogger();
      const preprocessor = new Preprocessor(
        new Logger(loggerConsole, resolvedConfig.debug),
        new Project(),
        resolvedConfig,
      );
      const filename = randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: 16,
      });
      const content = `
<meta
  ${resolvedConfig.dataAttributes.global}
/>
`;
      const metaTag = extractMetaTag(content, resolvedConfig.dataAttributes.global);
      const metadata = preprocessor.extractComponentMetadata(filename, content, metaTag!);

      // Act
      const action = () => preprocessor.patchContent(content, /^$/, metadata);

      // Assert
      const warnsCountBefore = loggerConsole.warnLogs.length;

      expect(action).not.toThrowError();

      const warnsCountAfter = loggerConsole.warnLogs.length;

      expect(warnsCountAfter).toBeGreaterThan(warnsCountBefore);
    });
  });
});
