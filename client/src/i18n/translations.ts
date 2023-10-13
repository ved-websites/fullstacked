import i18n, { type Config } from 'sveltekit-i18n';
import { routing } from './routing';

const rawTranslationImports = import.meta.glob('./*/**/*.json', { import: 'default' });

const translationFiles = Object.entries(rawTranslationImports).map(([path, getFile]) => {
	const [, lang, ...keys] = path.split('/');

	if (!lang) {
		throw `No key given for file "${path}"!`;
	}

	const key = (() => {
		const fileName = keys.pop()!;

		const cleanKeys = [...keys, fileName.replace('.json', '')];

		return cleanKeys.join('.');
	})();

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

export const fallbackLocale = 'en';

const config: Config<Params> = {
	loaders: translationFiles.map(({ locale, routes, key, loader }) => ({
		locale,
		key,
		routes,
		loader,
	})),
	fallbackValue: 'MISSING TRANSLATION',
	fallbackLocale,
};

export const { t, l, locale, locales, loading, loadTranslations, setLocale } = new i18n(config);
