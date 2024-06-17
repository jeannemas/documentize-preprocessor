import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';

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
} from './config.js';

describe(resolveComponentConfig.name, () => {
  it('Should resolve using the default config', () => {
    // Arrange
    const attributes = {};
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
    const suffix = randomUUID();
    const attributes = {
      'data-symbol-events': `events-${suffix}`,
      'data-symbol-props': `props-${suffix}`,
      'data-symbol-slots': `slots-${suffix}`,
    };
    const resolvedConfig = resolveConfig({});

    // Act
    const componentConfig = resolveComponentConfig(attributes, resolvedConfig);

    // Assert
    expect(componentConfig).toHaveProperty('events', attributes['data-symbol-events']);
    expect(componentConfig).toHaveProperty('props', attributes['data-symbol-props']);
    expect(componentConfig).toHaveProperty('slots', attributes['data-symbol-slots']);
  });
});

describe(resolveConfig.name, () => {
  it('Should resolve using the default config', () => {
    // Arrange
    const config = {};

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
    const suffix = randomUUID();
    const config = {
      dataAttributes: {
        description: `data-description-${suffix}`,
        events: `data-events-${suffix}`,
        global: `data-global-${suffix}`,
        props: `data-props-${suffix}`,
        slots: `data-slots-${suffix}`,
      },
      debug: true,
      symbols: {
        events: `events-${suffix}`,
        props: `props-${suffix}`,
        slots: `slots-${suffix}`,
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
});
