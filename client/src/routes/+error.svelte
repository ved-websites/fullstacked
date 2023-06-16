<script lang="ts">
	import { page } from '$app/stores';
	import { P } from 'flowbite-svelte';
</script>

<P>Oh no, something wrong happened!</P>

<P>{$page.status}: {$page.error?.message}</P>
