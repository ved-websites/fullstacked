<script lang="ts">
	import { browser } from '$app/env';
</script>

{#if !browser}
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
				document.documentElement.style.setProperty(`--${name}`, theme === 'light' ? valueIfLight : valueIfDark);
			}

			setVariable('mdc-theme-primary', '#ff3e00', '#ff3e00');
			setVariable('mdc-theme-secondary', '#5d5d78', '#676778');
			setVariable('mdc-theme-background', '#464646', '#fff');
			setVariable('mdc-theme-on-surface', '#fff', '#000');
		})();
	</script>
{/if}
