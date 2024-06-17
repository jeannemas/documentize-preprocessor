import type { RecursiveRequired } from '@sveltejs/kit';

type DataAttribute = `data-${string}`;

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
     * The data-attribute of the meta tag used to identify the tag as the configuration for the preprocessor.
     *
     * @default "data-doc"
     */
    global?: DataAttribute;
    /**
     * The data-attribute of the meta tag that contains the symbol of the events.
     *
     * @default "data-symbol-events"
     */
    events?: DataAttribute;
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
export type ResolvedConfig = RecursiveRequired<Config>;
export type ResolvedComponentConfig = ResolvedConfig['symbols'];

/**
 * Resolve the configuration of the preprocessor.
 */
export function resolveConfig(config: Config): ResolvedConfig {
  const dataAttributeRegex = /^data-[a-zA-Z0-9-]+$/;
  const resolvedConfig = {
    dataAttributes: {
      description: config.dataAttributes?.description ?? 'data-description',
      global: config.dataAttributes?.global ?? 'data-doc',
      events: config.dataAttributes?.events ?? 'data-symbol-events',
      props: config.dataAttributes?.props ?? 'data-symbol-props',
      slots: config.dataAttributes?.slots ?? 'data-symbol-slots',
    },
    debug: config.debug ?? false,
    symbols: {
      events: config.symbols?.events ?? '$$Events',
      props: config.symbols?.props ?? '$$Props',
      slots: config.symbols?.slots ?? '$$Slots',
    },
  } satisfies ResolvedConfig;

  if (!dataAttributeRegex.test(resolvedConfig.dataAttributes.description)) {
    throw new Error(
      `Invalid description data-attribute '${resolvedConfig.dataAttributes.description}'. Expected format '${dataAttributeRegex.source}'.`,
    );
  }

  if (!dataAttributeRegex.test(resolvedConfig.dataAttributes.global)) {
    throw new Error(
      `Invalid global data-attribute '${resolvedConfig.dataAttributes.global}'. Expected format '${dataAttributeRegex.source}'.`,
    );
  }

  if (!dataAttributeRegex.test(resolvedConfig.dataAttributes.events)) {
    throw new Error(
      `Invalid events data-attribute '${resolvedConfig.dataAttributes.events}'. Expected format '${dataAttributeRegex.source}'.`,
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

/**
 * Resolve the configuration of a component.
 */
export function resolveComponentConfig(
  resolvedConfig: ResolvedConfig,
  attributes: NamedNodeMap,
): ResolvedComponentConfig {
  const events =
    attributes.getNamedItem(resolvedConfig.dataAttributes.events)?.textContent ??
    resolvedConfig.symbols.events;
  const props =
    attributes.getNamedItem(resolvedConfig.dataAttributes.props)?.textContent ??
    resolvedConfig.symbols.props;
  const slots =
    attributes.getNamedItem(resolvedConfig.dataAttributes.slots)?.textContent ??
    resolvedConfig.symbols.slots;

  return {
    events,
    props,
    slots,
  };
}
