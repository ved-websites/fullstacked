import vedConfigs from '@v-ed/eslint-config';

/** @type { import('eslint').Linter.Config[] } */
export default [
	{
		ignores: ['**/.vercel/', '**/.svelte-kit/', '**/tailwind.config.cjs'],
	},
	...vedConfigs,
	{
		rules: {
			'@typescript-eslint/no-magic-numbers': 'off',
		},
	},
];
