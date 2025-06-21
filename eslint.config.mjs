import vedConfigs from '@v-ed/eslint-config';

/** @type { import('eslint').Linter.Config[] } */
export default [
	{
		ignores: ['**/.vercel/', '**/.svelte-kit/', '**/tailwind.config.cjs'],
	},
	...vedConfigs,
	{
		files: ['**/schemas/**/*.ts', '**/schemas.ts'],
		rules: {
			camelcase: [
				'error',
				{
					allow: ['required_error'],
				},
			],
		},
	},
	{
		rules: {
			'@typescript-eslint/no-magic-numbers': 'off',
		},
	},
];
