<script lang="ts">
	import { createToasts, setPageToasts } from '$lib/components/ToastManager/helper';
	import { context } from '$lib/runes';
	import { Button } from 'flowbite-svelte';
	import type { BaseUser } from '../../types';

	let {
		i18n: { t },
	} = context();

	interface Props {
		user: BaseUser & { registerToken: string | null };
		showCopiedTextDuration?: number;
	}

	let { user, showCopiedTextDuration = 3000 }: Props = $props();
</script>

<Button
	size="xs"
	onclick={() => {
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
