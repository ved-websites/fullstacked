<script lang="ts">
	import { isDrawerOpen, themeStore } from '$/stores';
	import { mdiGithub, mdiMenu, mdiWeatherNight, mdiWeb, mdiWhiteBalanceSunny } from '@mdi/js';
	import { Icon } from '@smui/common';
	import { Svg } from '@smui/common/elements';
	import IconButton from '@smui/icon-button';
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	import ServiceWorkerBanner from '../ServiceWorkerBanner.svelte';
</script>

<TopAppBar variant="static" style="position: sticky !important; top: 0;">
	<Row>
		<Section>
			<IconButton class="material-icons" aria-label="Toggle Drawer" on:click={isDrawerOpen.toggle}>
				<Icon component={Svg} viewBox="0 0 24 24">
					<path fill="currentColor" d={mdiMenu} />
				</Icon>
			</IconButton>
			<Title>My App</Title>
		</Section>
		<Section align="end" toolbar>
			<IconButton aria-label="GitHub" href="https://github.com/hperrin/svelte-material-ui">
				<Icon component={Svg} viewBox="0 0 24 24">
					<path fill="currentColor" d={mdiGithub} />
				</Icon>
			</IconButton>
			<IconButton aria-label="Demo Site" href="https://sveltematerialui.com">
				<Icon component={Svg} viewBox="0 0 24 24">
					<path fill="currentColor" d={mdiWeb} />
				</Icon>
			</IconButton>
			<IconButton title="Switch Theme" aria-label="Switch Theme" on:click={themeStore.toggle}>
				<Icon component={Svg} viewBox="0 0 24 24">
					<path
						class="light"
						class:media={!$themeStore}
						class:hidden={$themeStore && $themeStore != 'light'}
						fill="currentColor"
						d={mdiWhiteBalanceSunny}
					/>
					<path
						class="dark"
						class:media={!$themeStore}
						class:hidden={$themeStore && $themeStore != 'dark'}
						fill="currentColor"
						d={mdiWeatherNight}
					/>
				</Icon>
			</IconButton>
		</Section>
	</Row>

	<ServiceWorkerBanner />
</TopAppBar>

<style>
	path.hidden {
		display: none;
	}

	@media only screen and (prefers-color-scheme: dark) {
		path.media.light {
			display: none;
		}
	}

	@media not screen and (prefers-color-scheme: dark) {
		path.media.dark {
			display: none;
		}
	}
</style>
