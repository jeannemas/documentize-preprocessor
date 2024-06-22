import { describe, expect, it } from 'vitest';

import { generateRandomString } from '$lib/test-utils.js';

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
} from './config.js';

describe(resolveComponentConfig.name, () => {
  it('Should resolve using the default config', () => {
    // Arrange
    const attributes = [] satisfies Attribute[];
    const resolvedConfig = resolveConfig({});

    // Act
    const componentConfig = resolveComponentConfig(attributes, resolvedConfig);

    // Assert
    expect(componentConfig).toHaveProperty('events', resolvedConfig.symbols.events);
    expect(componentConfig).toHaveProperty('props', resolvedConfig.symbols.props);
    expect(componentConfig).toHaveProperty('slots', resolvedConfig.symbols.slots);
  });

  it('Should resolve using the provided config', () => {
    // Arrange
    const resolvedConfig = resolveConfig({});
    const eventsAttribute = new Attribute(
      resolvedConfig.dataAttributes.events,
      generateRandomString(),
    );
    const propsAttribute = new Attribute(
      resolvedConfig.dataAttributes.props,
      generateRandomString(),
    );
    const slotsAttribute = new Attribute(
      resolvedConfig.dataAttributes.slots,
      generateRandomString(),
    );
    const attributes = [eventsAttribute, propsAttribute, slotsAttribute];

    // Act
    const componentConfig = resolveComponentConfig(attributes, resolvedConfig);

    // Assert
    expect(componentConfig).toHaveProperty('events', eventsAttribute.value);
    expect(componentConfig).toHaveProperty('props', propsAttribute.value);
    expect(componentConfig).toHaveProperty('slots', slotsAttribute.value);
  });
});

describe(resolveConfig.name, () => {
  it('Should resolve using the default config', () => {
    // Arrange
    const config = {} satisfies Config;

    // Act
    const resolvedConfig = resolveConfig(config);

    // Assert
    expect(resolvedConfig).toHaveProperty('dataAttributes');
    expect(resolvedConfig.dataAttributes).toHaveProperty(
      'description',
      defaultDescriptionDataAttribute,
    );
    expect(resolvedConfig.dataAttributes).toHaveProperty('global', defaultGlobalDataAttribute);
    expect(resolvedConfig.dataAttributes).toHaveProperty('events', defaultEventsDataAttribute);
    expect(resolvedConfig.dataAttributes).toHaveProperty('props', defaultPropsDataAttribute);
    expect(resolvedConfig.dataAttributes).toHaveProperty('slots', defaultSlotsDataAttribute);
    expect(resolvedConfig).toHaveProperty('debug', defaultDebug);
    expect(resolvedConfig).toHaveProperty('symbols');
    expect(resolvedConfig.symbols).toHaveProperty('events', defaultEventsSymbol);
    expect(resolvedConfig.symbols).toHaveProperty('props', defaultPropsSymbol);
    expect(resolvedConfig.symbols).toHaveProperty('slots', defaultSlotsSymbol);
  });

  it('Should resolve using the provided config', () => {
    // Arrange
    const config = {
      dataAttributes: {
        description: `data-description-${generateRandomString()}`,
        events: `data-${generateRandomString()}`,
        global: `data-${generateRandomString()}`,
        props: `data-${generateRandomString()}`,
        slots: `data-${generateRandomString()}`,
      },
      debug: true,
      symbols: {
        events: generateRandomString(),
        props: generateRandomString(),
        slots: generateRandomString(),
      },
    } satisfies Config;

    // Act
    const resolvedConfig = resolveConfig(config);

    // Assert
    expect(resolvedConfig).toHaveProperty('dataAttributes');
    expect(resolvedConfig.dataAttributes).toHaveProperty(
      'description',
      config.dataAttributes.description,
    );
    expect(resolvedConfig.dataAttributes).toHaveProperty('global', config.dataAttributes.global);
    expect(resolvedConfig.dataAttributes).toHaveProperty('events', config.dataAttributes.events);
    expect(resolvedConfig.dataAttributes).toHaveProperty('props', config.dataAttributes.props);
    expect(resolvedConfig.dataAttributes).toHaveProperty('slots', config.dataAttributes.slots);
    expect(resolvedConfig).toHaveProperty('debug', config.debug);
    expect(resolvedConfig).toHaveProperty('symbols');
    expect(resolvedConfig.symbols).toHaveProperty('events', config.symbols.events);
    expect(resolvedConfig.symbols).toHaveProperty('props', config.symbols.props);
    expect(resolvedConfig.symbols).toHaveProperty('slots', config.symbols.slots);
  });

  it('Should throw when invalid data-attributes are provided', () => {
    // Arrange
    const configWithInvalidDescriptionDataAttribute = {
      dataAttributes: {
        description: `invalid-${generateRandomString()}` as DataAttribute,
      },
    } satisfies Config;
    const configWithInvalidEventsDataAttribute = {
      dataAttributes: {
        events: `invalid-${generateRandomString()}` as DataAttribute,
      },
    } satisfies Config;
    const configWithInvalidGlobalDataAttribute = {
      dataAttributes: {
        global: `invalid-${generateRandomString()}` as DataAttribute,
      },
    } satisfies Config;
    const configWithInvalidPropsDataAttribute = {
      dataAttributes: {
        props: `invalid-${generateRandomString()}` as DataAttribute,
      },
    } satisfies Config;
    const configWithInvalidSlotsDataAttribute = {
      dataAttributes: {
        slots: `invalid-${generateRandomString()}` as DataAttribute,
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
