<script lang="ts">
	import { createToasts, setPageToasts } from '$lib/components/ToastManager/helper';
	import { Button } from 'flowbite-svelte';
	import type { BaseUser } from '../../types';

	export let user: BaseUser & { registerToken: string | null };
	export let showCopiedTextDuration: number = 3000;
</script>

<Button
	size="xs"
	on:click={() => {
		navigator.clipboard.writeText(`${window.location.origin}/register?token=${user.registerToken}`);

		setPageToasts(
			createToasts([
				{
					text: `Copied link to register user ${user.email}!`,
					timeout: showCopiedTextDuration,
				},
			]),
		);
	}}
	color="green"
>
	Copy invite link
</Button>
