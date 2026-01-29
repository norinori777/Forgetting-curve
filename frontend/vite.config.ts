import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig(async () => {
  type PlaywrightProvider = (options?: Record<string, unknown>) => unknown

  let playwrightProvider: PlaywrightProvider | undefined = undefined
  const enableStorybookProject = process.env.VITEST_STORYBOOK === '1'
  if (enableStorybookProject) {
    try {
      const mod = await import('@vitest/browser-playwright')
      playwrightProvider = (mod as { playwright?: PlaywrightProvider }).playwright
    } catch {
      // @vitest/browser-playwright not installed; continue without browser project
    }
  }

  const projects: Record<string, unknown>[] = [
    // always add the default project
    { extends: true, test: { globals: true } },
  ]

  // if playwright provider is available, add storybook browser project
  if (enableStorybookProject && playwrightProvider) {
    projects.push({
      extends: true,
      plugins: [
        storybookTest({
          configDir: path.join(dirname, '.storybook'),
        }),
      ],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwrightProvider({}),
          instances: [
            {
              browser: 'chromium',
            },
          ],
        },
        setupFiles: ['.storybook/vitest.setup.ts'],
      },
    })
  }

  return {
    plugins: [react(), tailwindcss()],
    test: {
      environment: 'jsdom',
      projects,
    },
  }
})