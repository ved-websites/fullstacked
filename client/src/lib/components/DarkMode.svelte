<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { themeStore } from '$lib/stores';
	import { Button, ButtonGroup } from 'flowbite-svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import Icon from './Icon.svelte';

	interface Props {
		[key: string]: any;
	}

	let { ...rest }: Props = $props();

	let mediaDarkScheme = new MediaQuery('prefers-color-scheme: dark');

	let isDark = $derived.by(() => {
		if (!$themeStore) {
			return mediaDarkScheme;
		}

		return $themeStore == 'dark';
	});

	const handleThemeSubmit = async (event: SubmitEvent) => {
		event.preventDefault();

		const theme = event.submitter?.dataset?.theme;

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

	const flowbiteDarkToken = 'dark';

	$effect(() => {
		if (isDark) {
			document.documentElement.classList.add(flowbiteDarkToken);
		} else {
			document.documentElement.classList.remove(flowbiteDarkToken);
		}
	});
</script>

<form method="POST" use:enhance onsubmit={handleThemeSubmit} {...rest}>
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
	<input type="hidden" name="redirectTo" value={page.url.href.replace(page.url.origin, '')} />
</form>
