<script lang="ts">
	import { getI18n } from '$i18n';
	import { createToasts, setPageToasts } from '$lib/components/ToastManager/helper';
	import { Button } from 'flowbite-svelte';
	import type { BaseUser } from '../../types';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	export let user: BaseUser & { registerToken: string | null };
	export let showCopiedTextDuration: number = 3000;
</script>

<Button
	size="xs"
	on:click={() => {
		navigator.clipboard.writeText(`${window.location.origin}/register?token=${user.registerToken}`);

		setPageToasts(
			createToasts({
				text: $t('admin.users.tables.actions.copy-invite.toast', { email: user.email }),
				timeout: showCopiedTextDuration,
			}),
		);
	}}
	color="green"
>
	{$t('admin.users.tables.actions.copy-invite.button')}
</Button>
