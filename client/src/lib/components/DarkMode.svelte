<script lang="ts">
	import { themeStore, useMediaQuery } from '$/lib/stores';
	import { ButtonGroup, Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import { classList } from '../stores/classlist';
	import Icon from './Icon.svelte';
	import { mdiThemeLightDark, mdiWeatherNight, mdiWhiteBalanceSunny } from '@mdi/js';

	const mediaDarkScheme = useMediaQuery('(prefers-color-scheme: dark)');

	let isDark = derived([themeStore, mediaDarkScheme], ([$theme, $mediaDark]) => {
		if (!$theme) {
			return $mediaDark;
		}

		return $theme == 'dark';
	});

	let classListStore: ReturnType<typeof classList>;

	onMount(() => {
		classListStore = classList(document.documentElement, '');

		return () => {
			classListStore.destroy();
		};
	});

	$: classListStore?.update(`${$isDark ? 'dark' : ''}`);
</script>

<ButtonGroup {...$$restProps}>
	<Button
		shadow={$themeStore == 'dark'}
		color={$themeStore == 'dark' ? 'blue' : 'alternative'}
		on:click={() => $themeStore != 'dark' && themeStore.set('dark')}
	>
		<Icon path={mdiWeatherNight} size="18px" />
	</Button>
	<Button
		shadow={$themeStore == null}
		color={$themeStore == null ? 'purple' : 'alternative'}
		on:click={() => $themeStore != null && themeStore.set(null)}
	>
		<Icon path={mdiThemeLightDark} size="18px" />
	</Button>
	<Button
		shadow={$themeStore == 'light'}
		color={$themeStore == 'light' ? 'green' : 'alternative'}
		on:click={() => $themeStore != 'light' && themeStore.set('light')}
	>
		<Icon path={mdiWhiteBalanceSunny} size="18px" />
	</Button>
</ButtonGroup>
