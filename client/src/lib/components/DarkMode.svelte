<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { themeStore, useMediaQuery } from '$lib/stores';
	import { Button, ButtonGroup } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import { classList } from '../stores/utils/classlist';
	import Icon from './Icon.svelte';

	const mediaDarkScheme = useMediaQuery('(prefers-color-scheme: dark)');

	let isDark = derived([themeStore, mediaDarkScheme], ([$theme, $mediaDark]) => {
		if (!$theme) {
			return $mediaDark;
		}

		return $theme == 'dark';
	});

	let classListStore: ReturnType<typeof classList>;

	const handleThemeSubmit = async ({ submitter }: SubmitEvent) => {
		const theme = submitter?.dataset?.theme;

		switch (theme) {
			case 'dark':
				$themeStore != 'dark' && themeStore.set('dark');
				break;
			case 'light':
				$themeStore != 'light' && themeStore.set('light');
				break;
			case 'media':
				$themeStore != null && themeStore.set(null);
				break;
		}
	};

	onMount(() => {
		classListStore = classList(document.documentElement, '');

		return () => {
			classListStore.destroy();
		};
	});

	$: classListStore?.update(`${$isDark ? 'dark' : ''}`);
</script>

<form method="POST" use:enhance on:submit|preventDefault={handleThemeSubmit} {...$$restProps}>
	<ButtonGroup>
		<Button
			data-theme="dark"
			type="submit"
			title="dark theme"
			shadow={$themeStore == 'dark'}
			color={$themeStore == 'dark' ? 'blue' : 'alternative'}
			formaction="/?/theme&value=dark"
		>
			<Icon class="i-mdi-weather-night s-4" />
		</Button>
		<Button
			data-theme="media"
			type="submit"
			title="system theme"
			shadow={$themeStore == null}
			color={$themeStore == null ? 'purple' : 'alternative'}
			formaction="/?/theme&value=null"
		>
			<Icon class="i-mdi-theme-light-dark s-4" />
		</Button>
		<Button
			data-theme="light"
			type="submit"
			title="light theme"
			shadow={$themeStore == 'light'}
			color={$themeStore == 'light' ? 'green' : 'alternative'}
			formaction="/?/theme&value=light"
		>
			<Icon class="i-mdi-white-balance-sunny s-4" />
		</Button>
	</ButtonGroup>
	<input type="hidden" name="redirectTo" value={$page.url.href.replace($page.url.origin, '')} />
</form>
