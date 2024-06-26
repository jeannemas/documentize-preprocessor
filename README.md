# Documentize preprocessor

This Svelte preprocessor automatically adds documentation to your Svelte components, making it easier for developers to understand and use your components.
It extracts comments and metadata, embedding them directly into your Svelte files.

## Features

- Automatic Documentation Extraction: Extracts comments and metadata from your Svelte components.
- Embeds Documentation: Option to embed documentation directly into Svelte files.
- Customizable: Configure how and where documentation is added.

## Installation

To install the preprocessor, you can use npm, yarn or pnpm:

```bash
npm install @jeanne-mas/documentize-preprocessor --save-dev # NPM
yarn add @jeanne-mas/documentize-preprocessor --dev # Yarn
pnpm add @jeanne-mas/documentize-preprocessor --save-dev # PNPM
```

## Usage

To use the preprocessor, add it to your Svelte configuration file `svelte.config.js`.

> Make sure to add the preprocessor before the `vitePreprocess` preprocessor.

```javascript
import documentizePreprocessor from '@jeanne-mas/documentize-preprocessor';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'node:path';

const tsConfigPath = resolve('.', './tsconfig.json');

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    documentizePreprocessor(tsConfigPath, {
      /* Add configuration here */
    }),
    vitePreprocess(),
  ],

  ...
};

export default config;
```

## Configuration Options

The preprocessor accepts the following configuration options:

```typescript
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
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE.md) file for details.
