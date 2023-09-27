import i18n, { type Config } from 'sveltekit-i18n';
import { routing } from './routing';

const rawTranslationImports = import.meta.glob('./*/**/*.json', { import: 'default' });

const translationFiles = Object.entries(rawTranslationImports).map(([path, getFile]) => {
	const [, lang, ...keys] = path.split('/');

	if (!lang) {
		throw `No key given for file "${path}"!`;
	}

	const key = keys.reduce(
		(fullKey, currentKey) => {
			const cleanKey = currentKey.replace('.json', '');

			if (!fullKey) {
				return cleanKey;
			}

			return `${fullKey}.${cleanKey}`;
		},
		undefined as string | undefined,
	);

	if (!key) {
		throw `Couldn't map key for file "${path}"!`;
	}

	return {
		locale: lang,
		key,
		routes: routing[key],
		loader: async () => {
			const file = (await getFile()) as Record<string, { link: string }>;

			return file;
		},
	} satisfies NonNullable<Config['loaders']>[number];
});

export type Params = {
	[x: string]: unknown;
};

const config: Config<Params> = {
	loaders: translationFiles.map(({ locale, routes, key, loader }) => ({
		locale,
		key,
		routes,
		loader,
	})),
	fallbackValue: 'MISSING TRANSLATION',
	fallbackLocale: 'en',
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
