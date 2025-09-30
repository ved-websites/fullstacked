export const themeCookieName = 'color-theme';

export const themes = ['dark', 'light'] as const;
export type Theme = (typeof themes)[number];

export const isTheme = (theme: string | null) => {
	if (!theme) {
		return false;
	}
	return (themes as readonly string[]).includes(theme);
};
