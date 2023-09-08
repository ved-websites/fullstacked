<script lang="ts" context="module">
	import { mdiSecurity } from '@mdi/js';

	export const name = 'Security';
	export const icon = mdiSecurity;
</script>

<script lang="ts">
	import SettingPage from '../components/SettingPage.svelte';

	export let data;

	$: sessionUser = data.sessionUser!;
</script>

<SettingPage routesInfo={data.routesInfo} {sessionUser} label={name}>
	<div>Hello from no security whatsoever</div>
</SettingPage>
