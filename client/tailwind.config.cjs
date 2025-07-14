const { iconsPlugin, getIconCollections } = require('@egoist/tailwindcss-icons');
const plugin = require('tailwindcss/plugin');

const sizePlugin = plugin(({ matchUtilities, theme }) => {
	matchUtilities(
		{
			s: (value) => ({
				width: value,
				height: value,
			}),
		},
		{ values: theme('width') },
	);
});

/** @type {import('tailwindcss').Config} */
const config = {
	plugins: [
		iconsPlugin({
			collections: getIconCollections(['mdi']),
		}),
		sizePlugin,
	],
};

module.exports = config;
