import { describe, expect, it } from 'vitest';

import { generateAlphabeat } from '$lib/utils/alphabeat.js';
import { randomString } from '$lib/utils/strings.js';

import { randomBoolean } from '$lib/utils/booleans.js';
import { randomInteger } from '$lib/utils/numbers.js';
import { resolveConfig, type Config } from './config.js';
import { Svelte4Event } from './events.js';
import { generateRandomEvents } from './events.test.js';
import {
  ProcessedMarkup,
  Svelte4Metadata,
  default as documentizePreprocessor,
} from './preprocessor.js';
import { Svelte4Prop } from './props.js';
import { generateRandomProps } from './props.test.js';
import { Svelte4Slot, Svelte4SlotProperty } from './slots.js';
import { generateRandomSlots } from './slots.test.js';

describe(documentizePreprocessor.name, () => {
  it('Should create a new preprocessor', () => {
    // Arrange
    const tsConfigFilePath = undefined;
    const config = {} satisfies Config;

    // Act
    const action = () => documentizePreprocessor(tsConfigFilePath, config);

    // Assert
    expect(action).not.toThrowError();
  });

  it('Should process the markup', () => {
    // Arrange
    const resolvedConfig = resolveConfig();
    const preprocessor = documentizePreprocessor(undefined, resolvedConfig);
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
    expect(maybeProcessed.result.code).toBe<ProcessedMarkup['result']['code']>('processed');
  });

  it('Should not process the markup', () => {
    // Arrange
    const resolvedConfig = resolveConfig();
    const preprocessor = documentizePreprocessor(undefined, resolvedConfig);
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
    expect(maybeProcessed.result.code).toBe<ProcessedMarkup['result']['code']>('skipped');
  });

  it('Should process the markup and extract all the metadata', () => {
    // Arrange
    const resolvedConfig = resolveConfig();
    const preprocessor = documentizePreprocessor(undefined, resolvedConfig);
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
    expect(processedMarkup.result.code).toBe<ProcessedMarkup['result']['code']>('processed');

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

  it('Should be defined as a string', () => {
    // Arrange
    const preprocessor = documentizePreprocessor();

    // Act
    const action = () => preprocessor.name;

    // Assert
    expect(action).not.toThrowError();

    const maybeString = action();

    expect(maybeString).toBeTypeOf('string');
  });
});
