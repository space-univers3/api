import swc from 'unplugin-swc';
import { loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';


export default defineConfig({
  plugins: [tsconfigPaths(), swc.vite()],
  test: {
    globals: true, // This is needed by @testing-library to be cleaned up after each test
    include: ['./**/*.test.{js,ts}', "./**/*.e2e-spec.{js,ts}", "./**/*.spec.{js,ts}"],
    setupFiles: ['./vitest.setup.ts'],
    env: loadEnv('', process.cwd(), ''),
  },
});
