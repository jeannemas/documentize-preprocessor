import { describe, expect, it } from 'vitest';

import { generateAlphabeat } from '$lib/utils/alphabeat.js';
import { randomString } from '$lib/utils/strings.js';

import { Attribute } from './attributes.js';
import {
  defaultDebug,
  defaultDescriptionDataAttribute,
  defaultEventsDataAttribute,
  defaultEventsSymbol,
  defaultGlobalDataAttribute,
  defaultPropsDataAttribute,
  defaultPropsSymbol,
  defaultSlotsDataAttribute,
  defaultSlotsSymbol,
  resolveComponentConfig,
  resolveConfig,
  type Config,
  type DataAttribute,
  type ResolvedComponentConfig,
} from './config.js';

describe(resolveComponentConfig.name, () => {
  it('Should resolve using the default config', () => {
    // Arrange
    const attributes = [] satisfies Attribute[];
    const resolvedConfig = resolveConfig();

    // Act
    const componentConfig = resolveComponentConfig(attributes, resolvedConfig);

    // Assert
    expect(componentConfig).toMatchObject({
      events: resolvedConfig.symbols.events,
      props: resolvedConfig.symbols.props,
      slots: resolvedConfig.symbols.slots,
    } satisfies ResolvedComponentConfig);
  });

  it('Should resolve using the provided config', () => {
    // Arrange
    const resolvedConfig = resolveConfig();
    const eventsAttribute = new Attribute({
      name: resolvedConfig.dataAttributes.events,
      value: randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: 16,
      }),
    });
    const propsAttribute = new Attribute({
      name: resolvedConfig.dataAttributes.props,
      value: randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: 16,
      }),
    });
    const slotsAttribute = new Attribute({
      name: resolvedConfig.dataAttributes.slots,
      value: randomString({
        alphabeat: generateAlphabeat('a', 'z'),
        length: 16,
      }),
    });
    const attributes = [eventsAttribute, propsAttribute, slotsAttribute];

    // Act
    const componentConfig = resolveComponentConfig(attributes, resolvedConfig);

    // Assert
    expect(componentConfig).toMatchObject({
      events: eventsAttribute.value,
      props: propsAttribute.value,
      slots: slotsAttribute.value,
    } satisfies ResolvedComponentConfig);
  });
});

describe(resolveConfig.name, () => {
  it('Should resolve using the default config', () => {
    // Arrange

    // Act
    const resolvedConfig = resolveConfig();

    // Assert
    expect(resolvedConfig).toMatchObject({
      dataAttributes: {
        description: defaultDescriptionDataAttribute,
        global: defaultGlobalDataAttribute,
        events: defaultEventsDataAttribute,
        props: defaultPropsDataAttribute,
        slots: defaultSlotsDataAttribute,
      },
      debug: defaultDebug,
      symbols: {
        events: defaultEventsSymbol,
        props: defaultPropsSymbol,
        slots: defaultSlotsSymbol,
      },
    } satisfies Config);
  });

  it('Should resolve using the provided config', () => {
    // Arrange
    const config = {
      dataAttributes: {
        description: `data-description-${randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        })}`,
        events: `data-${randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        })}`,
        global: `data-${randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        })}`,
        props: `data-${randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        })}`,
        slots: `data-${randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        })}`,
      },
      debug: true,
      symbols: {
        events: randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        }),
        props: randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        }),
        slots: randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        }),
      },
    } satisfies Config;

    // Act
    const resolvedConfig = resolveConfig(config);

    // Assert
    expect(resolvedConfig).toMatchObject({
      dataAttributes: {
        description: config.dataAttributes.description,
        global: config.dataAttributes.global,
        events: config.dataAttributes.events,
        props: config.dataAttributes.props,
        slots: config.dataAttributes.slots,
      },
      debug: config.debug,
      symbols: {
        events: config.symbols.events,
        props: config.symbols.props,
        slots: config.symbols.slots,
      },
    } satisfies Config);
  });

  it('Should throw when invalid data-attributes are provided', () => {
    // Arrange
    const configWithInvalidDescriptionDataAttribute = {
      dataAttributes: {
        description: `invalid-${randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        })}` as DataAttribute,
      },
    } satisfies Config;
    const configWithInvalidEventsDataAttribute = {
      dataAttributes: {
        events: `invalid-${randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        })}` as DataAttribute,
      },
    } satisfies Config;
    const configWithInvalidGlobalDataAttribute = {
      dataAttributes: {
        global: `invalid-${randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        })}` as DataAttribute,
      },
    } satisfies Config;
    const configWithInvalidPropsDataAttribute = {
      dataAttributes: {
        props: `invalid-${randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        })}` as DataAttribute,
      },
    } satisfies Config;
    const configWithInvalidSlotsDataAttribute = {
      dataAttributes: {
        slots: `invalid-${randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        })}` as DataAttribute,
      },
    } satisfies Config;

    // Act
    const actionWithInvalidDescriptionDataAttribute = () =>
      resolveConfig(configWithInvalidDescriptionDataAttribute);
    const actionWithInvalidEventsDataAttribute = () =>
      resolveConfig(configWithInvalidEventsDataAttribute);
    const actionWithInvalidGlobalDataAttribute = () =>
      resolveConfig(configWithInvalidGlobalDataAttribute);
    const actionWithInvalidPropsDataAttribute = () =>
      resolveConfig(configWithInvalidPropsDataAttribute);
    const actionWithInvalidSlotsDataAttribute = () =>
      resolveConfig(configWithInvalidSlotsDataAttribute);

    // Assert
    expect(actionWithInvalidDescriptionDataAttribute).toThrowError(Error);
    expect(actionWithInvalidEventsDataAttribute).toThrowError(Error);
    expect(actionWithInvalidGlobalDataAttribute).toThrowError(Error);
    expect(actionWithInvalidPropsDataAttribute).toThrowError(Error);
    expect(actionWithInvalidSlotsDataAttribute).toThrowError(Error);
  });
});
