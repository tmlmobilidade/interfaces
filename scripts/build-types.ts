/* eslint-disable perfectionist/sort-objects */
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const originalPackageJson = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8'));

const newPackageJson = {
	...originalPackageJson,
	exports: {
		'.': {
			require: './dist/core-types.js',
			types: './dist/core-types.d.ts',
			import: './dist/core-types.mjs',
		},
	},
	name: '@tmlmobilidade/core-types',
};

writeFileSync(resolve(__dirname, '../package.json'), JSON.stringify(newPackageJson, null, 2));
