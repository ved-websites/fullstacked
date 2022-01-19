<script lang="ts">
	import { client } from '$/utils/urql';
	import { Router } from '@roxi/routify';
	import { setClient } from '@urql/svelte';
	import { routes } from '../.routify/routes';

	setClient(client);
</script>

<Router {routes} />
