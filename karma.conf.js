/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */

const { createDefaultConfig } = require('@open-wc/testing-karma');
const merge = require('deepmerge');

module.exports = config => {
	config.set(
		merge(createDefaultConfig(config), {
			plugins: [
				require.resolve('@open-wc/karma-esm'),
			],
			files: [
				{
					pattern: config.grep ? config.grep : 'test/**/*.ts',
					type: 'module'
				}
			],
			esm: {
				babel: true,
				nodeResolve: true,
				fileExtensions: ['.ts']
			},
		}),
	);
	return config;
};
