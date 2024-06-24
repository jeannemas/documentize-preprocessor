import { describe, expect, it } from 'vitest';

import { randomString } from '$lib/utils/index.js';

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
    const eventsAttribute = new Attribute(resolvedConfig.dataAttributes.events, randomString());
    const propsAttribute = new Attribute(resolvedConfig.dataAttributes.props, randomString());
    const slotsAttribute = new Attribute(resolvedConfig.dataAttributes.slots, randomString());
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
        description: `data-description-${randomString()}`,
        events: `data-${randomString()}`,
        global: `data-${randomString()}`,
        props: `data-${randomString()}`,
        slots: `data-${randomString()}`,
      },
      debug: true,
      symbols: {
        events: randomString(),
        props: randomString(),
        slots: randomString(),
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
        description: `invalid-${randomString()}` as DataAttribute,
      },
    } satisfies Config;
    const configWithInvalidEventsDataAttribute = {
      dataAttributes: {
        events: `invalid-${randomString()}` as DataAttribute,
      },
    } satisfies Config;
    const configWithInvalidGlobalDataAttribute = {
      dataAttributes: {
        global: `invalid-${randomString()}` as DataAttribute,
      },
    } satisfies Config;
    const configWithInvalidPropsDataAttribute = {
      dataAttributes: {
        props: `invalid-${randomString()}` as DataAttribute,
      },
    } satisfies Config;
    const configWithInvalidSlotsDataAttribute = {
      dataAttributes: {
        slots: `invalid-${randomString()}` as DataAttribute,
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
