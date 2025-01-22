import { defineConfig, Options } from 'tsup';


const baseConfig: Partial<Options> = {
  format: ['esm', 'cjs'],
  sourcemap: true,
  clean: true,
  dts: true
};

export default defineConfig([
  {
    ...baseConfig,
    entry: ['src/types/index.ts'],
    outDir: 'dist',
  },
]);

