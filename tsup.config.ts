import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  treeshake: true,
  sourcemap: true,
  // React and uuid are provided by the consumer / resolved at their end,
  // so they should never be bundled into our output.
  external: ['react', 'uuid'],
  // .js for ESM, .cjs for CommonJS — matches the "exports" map in package.json.
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.js' };
  },
});
