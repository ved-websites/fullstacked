<svelte:head>
	<script>
		(function () {
			function getInitialTheme() {
				try {
					const theme = localStorage.getItem('color-theme');

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

			if (theme == 'dark') {
				window.document.documentElement.classList.add('dark');
			}
		})();
	</script>
</svelte:head>
