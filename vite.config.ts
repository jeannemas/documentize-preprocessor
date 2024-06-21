import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    coverage: {
      include: ['src/**/*.{js,ts}'],
      provider: 'istanbul',
      reporter: ['json', 'text'],
    },
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
});
