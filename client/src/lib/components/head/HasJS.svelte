<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { HASJS_COOKIE_NAME } from '$lib/utils/js-handling';

	$: {
		$page.form;

		if (browser) {
			const expiryInYears = 2;

			const date = new Date();

			date.setFullYear(date.getFullYear() + expiryInYears);

			document.cookie = `${HASJS_COOKIE_NAME}=true; expires=${date.toUTCString()}; path=/`;
		}
	}
</script>
