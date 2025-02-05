import { defineConfig, Options } from 'tsup';

const baseConfig: Partial<Options> = {
	clean: true,
	dts: true,
	format: ['esm', 'cjs'],
	sourcemap: true,
};

export default defineConfig([
	{
		...baseConfig,
		entry: ['src/types/index.ts', 'src/utils/index.ts'],
		outDir: 'dist',
	},
]);
