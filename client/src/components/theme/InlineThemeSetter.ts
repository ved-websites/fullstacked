import themes from '$/theme/variables.module.scss';

export const inlineThemeVarSetter = `
<script>
	(function () {
		function getInitialTheme() {
			try {
				const theme = JSON.parse(localStorage.getItem('theme'));

				if (!theme && supportDarkMode) {
					return 'dark';
				}

				if (theme) {
					return theme;
				}
			} catch (e) {}

			try {
				return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
			} catch (e) {}

			return null;
		}

		const theme = getInitialTheme();

		if (!theme) {
			return;
		}

		function setVariable(name, valueIfDark, valueIfLight) {
			document.documentElement.style.setProperty(\`--\${name}\`, theme === 'light' ? valueIfLight : valueIfDark);
		}

		setVariable('mdc-theme-primary', '${themes['colors-dark-primary']}', '${themes['colors-light-primary']}');
		setVariable('mdc-theme-secondary', '${themes['colors-dark-secondary']}', '${themes['colors-light-secondary']}');
		setVariable('mdc-theme-background', '${themes['colors-dark-background']}', '${themes['colors-light-background']}');
		setVariable('mdc-theme-on-surface', '${themes['colors-dark-on-surface']}', '${themes['colors-light-on-surface']}');
	})();
</script>
`;
