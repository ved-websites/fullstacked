<script lang="ts">
	import { HASJS_COOKIE_NAME } from '$/lib/utils/js-handling';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	$: {
		$page.form;

		if (browser) {
			const date = new Date();
			date.setFullYear(date.getFullYear() + 2);

			document.cookie = `${HASJS_COOKIE_NAME}=true; expires=${date.toUTCString()}; path=/`;
		}
	}
</script>
