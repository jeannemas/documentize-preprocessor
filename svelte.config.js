// @ts-check

import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

import preprocessor from './src/lib/preprocessor/index.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [
    preprocessor({
      identifiers: {
        description: 'data-description',
        global: 'data-doc',
        events: 'data-symbol-events',
        props: 'data-symbol-props',
        slots: 'data-symbol-slots',
      },
      symbols: {
        events: '$$Events',
        props: '$$Props',
        slots: '$$Slots',
      },
    }),
    vitePreprocess(),
  ],

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
  },
};

export default config;
