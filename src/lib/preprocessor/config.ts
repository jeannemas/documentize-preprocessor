import type { RecursiveRequired } from '@sveltejs/kit';

import type { Attribute } from './attributes.js';

const dataAttributeRegex = /^data-[a-zA-Z_-][a-zA-Z0-9_-]*$/;

/**
 * The default value of the debug mode.
 */
export const defaultDebug = false;
/**
 * The default data-attribute of the description.
 */
export const defaultDescriptionDataAttribute = 'data-description';
/**
 * The default data-attribute of the events.
 */
export const defaultEventsDataAttribute = 'data-symbol-events';
/**
 * The default symbol of the events.
 */
export const defaultEventsSymbol = '$$Events';
/**
 * The default data-attribute of the global configuration.
 */
export const defaultGlobalDataAttribute = 'data-documentize';
/**
 * The default data-attribute of the props.
 */
export const defaultPropsDataAttribute = 'data-symbol-props';
/**
 * The default symbol of the props.
 */
export const defaultPropsSymbol = '$$Props';
/**
 * The default data-attribute of the slots.
 */
export const defaultSlotsDataAttribute = 'data-symbol-slots';
/**
 * The default symbol of the slots.
 */
export const defaultSlotsSymbol = '$$Slots';

/**
 * The configuration of the preprocessor.
 */
export type Config = {
  /**
   * The data-attributes of the meta tag that contains the component configuration.
   */
  dataAttributes?: {
    /**
     * The data-attribute of the meta tag that contains the description of the component.
     *
     * @default "data-description"
     */
    description?: DataAttribute;
    /**
     * The data-attribute of the meta tag that contains the symbol of the events.
     *
     * @default "data-symbol-events"
     */
    events?: DataAttribute;
    /**
     * The data-attribute of the meta tag used to identify the tag as the configuration for the preprocessor.
     *
     * @default "data-documentize"
     */
    global?: DataAttribute;
    /**
     * The data-attribute of the meta tag that contains the symbol of the props.
     *
     * @default "data-symbol-props"
     */
    props?: DataAttribute;
    /**
     * The data-attribute of the meta tag that contains the symbol of the slots.
     *
     * @default "data-symbol-slots"
     */
    slots?: DataAttribute;
  };
  /**
   * Whether to enable debug mode.
   *
   * Debug mode will log additional information to the console.
   */
  debug?: boolean;
  /**
   * The symbols of the component.
   */
  symbols?: {
    /**
     * The symbol to look for inside the component that contains the events.
     *
     * @default "$$Events"
     */
    events?: string;
    /**
     * The symbol to look for inside the component that contains the props.
     *
     * @default "$$Props"
     */
    props?: string;
    /**
     * The symbol to look for inside the component that contains the slots.
     *
     * @default "$$Slots"
     */
    slots?: string;
  };
};
/**
 * A data-attribute.
 */
export type DataAttribute = `data-${string}`;
/**
 * The resolved configuration of a component.
 */
export type ResolvedComponentConfig = ResolvedConfig['symbols'];
/**
 * The resolved configuration of the preprocessor.
 */
export type ResolvedConfig = RecursiveRequired<Config>;

/**
 * Resolve the configuration of a component.
 */
export function resolveComponentConfig(
  attributes: Attribute[],
  resolvedConfig: ResolvedConfig,
): ResolvedComponentConfig {
  const events =
    attributes.find(({ name }) => name === resolvedConfig.dataAttributes.events)?.value ??
    resolvedConfig.symbols.events;
  const props =
    attributes.find(({ name }) => name === resolvedConfig.dataAttributes.props)?.value ??
    resolvedConfig.symbols.props;
  const slots =
    attributes.find(({ name }) => name === resolvedConfig.dataAttributes.slots)?.value ??
    resolvedConfig.symbols.slots;

  return {
    events,
    props,
    slots,
  };
}

/**
 * Resolve the configuration of the preprocessor.
 */
export function resolveConfig(config: Config = {}): ResolvedConfig {
  const resolvedConfig = {
    dataAttributes: {
      description: config.dataAttributes?.description ?? defaultDescriptionDataAttribute,
      events: config.dataAttributes?.events ?? defaultEventsDataAttribute,
      global: config.dataAttributes?.global ?? defaultGlobalDataAttribute,
      props: config.dataAttributes?.props ?? defaultPropsDataAttribute,
      slots: config.dataAttributes?.slots ?? defaultSlotsDataAttribute,
    },
    debug: config.debug ?? defaultDebug,
    symbols: {
      events: config.symbols?.events ?? defaultEventsSymbol,
      props: config.symbols?.props ?? defaultPropsSymbol,
      slots: config.symbols?.slots ?? defaultSlotsSymbol,
    },
  } satisfies ResolvedConfig;

  if (!dataAttributeRegex.test(resolvedConfig.dataAttributes.description)) {
    throw new Error(
      `Invalid description data-attribute '${resolvedConfig.dataAttributes.description}'. Expected format '${dataAttributeRegex.source}'.`,
    );
  }

  if (!dataAttributeRegex.test(resolvedConfig.dataAttributes.events)) {
    throw new Error(
      `Invalid events data-attribute '${resolvedConfig.dataAttributes.events}'. Expected format '${dataAttributeRegex.source}'.`,
    );
  }

  if (!dataAttributeRegex.test(resolvedConfig.dataAttributes.global)) {
    throw new Error(
      `Invalid global data-attribute '${resolvedConfig.dataAttributes.global}'. Expected format '${dataAttributeRegex.source}'.`,
    );
  }

  if (!dataAttributeRegex.test(resolvedConfig.dataAttributes.props)) {
    throw new Error(
      `Invalid props data-attribute '${resolvedConfig.dataAttributes.props}'. Expected format '${dataAttributeRegex.source}'.`,
    );
  }

  if (!dataAttributeRegex.test(resolvedConfig.dataAttributes.slots)) {
    throw new Error(
      `Invalid slots data-attribute '${resolvedConfig.dataAttributes.slots}'. Expected format '${dataAttributeRegex.source}'.`,
    );
  }

  return resolvedConfig;
}
