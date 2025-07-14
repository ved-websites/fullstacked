import i18n, { type Config } from 'sveltekit-i18n';
import { routing } from './routing';

export type ManualRouting = NonNullable<Config['loaders']>[number]['routes'] | true;
export type RoutingMap = Record<string, ManualRouting>;

const rawTranslationImports = import.meta.glob('./*/**/*.json', { import: 'default' });

const translationFiles = Object.entries(rawTranslationImports).map(([path, getFile]) => {
	const [, lang, ...keys] = path.split('/') as ['.', string, ...string[]];

	const fileName = keys.pop()!;

	const cleanKeys = [...keys, fileName.replace('.json', '')];

	const key = cleanKeys.join('.');

	const routes = (() => {
		const greedyManualRoutes = (routing as RoutingMap)[`${key}!`];

		const manualRoutes = greedyManualRoutes ?? (routing as RoutingMap)[key];

		if (manualRoutes === true) {
			// Load this file for all routes
			return;
		}

		if (Array.isArray(greedyManualRoutes)) {
			return greedyManualRoutes;
		}

		// allow to match filesystem of sveltekit (ignore "(group)" and dynamic "[param]")
		const kitKeys = cleanKeys
			.filter((k) => !(k.startsWith('(') && k.endsWith(')')))
			.map((k) => {
				// handle cases with `[param]`
				if (k.startsWith('[') && k.endsWith(']')) {
					return '.*';
				}

				return k;
			});

		const routePath = new RegExp(`/${kitKeys.join('/')}`);

		return [routePath, ...(manualRoutes ?? [])];
	})();

	return {
		locale: lang,
		key,
		routes,
		loader: async () => {
			const file = (await getFile()) as Record<string, { link: string }>;

			return file;
		},
	} satisfies NonNullable<Config['loaders']>[number];
});

export type Params = {
	[x: string]: unknown;
	default?: string;
};

export const locales = Array.from(new Set(translationFiles.map((loader) => loader.locale)));

export const fallbackLocale = 'en';

const config: Config<Params> = {
	loaders: translationFiles,
	fallbackLocale,
	log: {
		level: 'error',
	},
};

export async function loadI18n(locale: string, route: string) {
	const i18nInstance = new i18n(config);

	await i18nInstance.loadTranslations(locale, route);

	return {
		t: i18nInstance.t,
		locale: i18nInstance.locale,
		locales: i18nInstance.locales,
		setLocale: i18nInstance.setLocale,
		tPayload: <T extends Record<string, unknown> | undefined>(
			i18nPayload: T,
		): T extends undefined ? undefined : Record<keyof T, string> => {
			if (!i18nPayload) {
				return undefined as never;
			}

			const translatedEntries = Object.entries(i18nPayload).map(([key, value]) => [key, i18nInstance.t.get(String(value))]);

			return Object.fromEntries(translatedEntries);
		},
	};
}

export type I18nInstanceType = Awaited<ReturnType<typeof loadI18n>>;
