<script lang="ts">
	import { getI18n } from '$i18n';
	import { P } from 'flowbite-svelte';
	let i18n = getI18n();
	$: ({ t } = $i18n);
</script>

<P>{$t('about.main')}</P>
