<script lang="ts">
	import { page } from '$app/state';
	import RequestPage from './RequestPage.svelte';
	import ResetPage from './ResetPage.svelte';

	let { data } = $props();

	let validToken = $derived(!page.url.searchParams.has('resetToken') || data.resetToken !== null);
</script>

{#if data.resetToken === null}
	<RequestPage sForm={data.form} {validToken}></RequestPage>
{:else}
	<ResetPage sForm={data.form} user={data.user}></ResetPage>
{/if}
