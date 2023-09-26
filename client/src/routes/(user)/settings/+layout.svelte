<script lang="ts">
	import { page } from '$app/stores';
	import SettingPage from './components/SettingPage.svelte';

	export let data;

	$: sessionUser = data.sessionUser!;
	$: routesInfo = data.routesInfo;
	$: label = routesInfo.find(({ url }) => url === $page.url.pathname)?.name;
</script>

<SettingPage {sessionUser} {routesInfo} {label}>
	<slot />
</SettingPage>
