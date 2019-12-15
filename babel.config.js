/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-env node */

module.exports = function (api) {
	api.cache(true);
	const testPresetOpts = {
		targets: {
			node: 'current',
		},
	};
	const config = {
		presets: [
			[
				'@babel/preset-env',
				testPresetOpts,
			],
			'@babel/preset-typescript',
		],
	};

	return config;
};
