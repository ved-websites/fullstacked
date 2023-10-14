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

export const locales = Array.from(new Set(translationFiles.map((loader) => loader.locale)));

export const fallbackLocale = 'en';

const config: Config<Params> = {
	loaders: translationFiles,
	fallbackLocale,
};

export async function loadI18n(locale: string, route: string) {
	const i18nInstance = new i18n(config);

	await i18nInstance.loadTranslations(locale, route);

	return {
		t: i18nInstance.t,
		locale: i18nInstance.locale,
		setLocale: i18nInstance.setLocale,
	};
}

export type I18nInstanceType = Awaited<ReturnType<typeof loadI18n>>;
