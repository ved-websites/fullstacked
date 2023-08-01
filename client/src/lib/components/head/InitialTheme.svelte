<svelte:head>
	<script>
		(function () {
			function getCookie(name) {
				const value = `; ${document.cookie}`;
				const parts = value.split(`; ${name}=`);
				if (parts.length === 2) return parts.pop().split(';').shift();
			}

			function getInitialTheme() {
				try {
					const theme = getCookie('color-theme');

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

			if (theme == 'light') {
				window.document.documentElement.classList.remove('dark');
			}
		})();
	</script>
</svelte:head>
