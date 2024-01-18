<script lang="ts">
	import { ResendInviteLinkStore } from '$houdini';
	import { getI18n } from '$i18n';
	import { createToasts, setPageToasts, type ToastData } from '$lib/components/ToastManager/helper';
	import { Button } from 'flowbite-svelte';
	import { k } from '~shared';
	import type { BaseUser } from '../../types';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	export let user: BaseUser & { registerToken: string | null };
	export let showInviteResentTextDuration: number = 3000;

	const inviteLinkResender = new ResendInviteLinkStore();
	let isSendingNewInvite = false;

	async function handleResend() {
		isSendingNewInvite = true;

		let toasts: ToastData[];

		try {
			const { errors } = await inviteLinkResender.mutate({ email: user.email });

			if (!errors?.length) {
				toasts = createToasts([
					{
						text: $t('admin.users.tables.actions.resend-invite.toasts.success', { email: user.email }),
						timeout: showInviteResentTextDuration,
					},
				]);
			} else {
				toasts = createToasts([
					{
						text: k('admin.users.tables.actions.resend-invite.toasts.error-server'),
						timeout: showInviteResentTextDuration,
						extraData: `<div class="mt-3 italic">${errors}</div>`,
					},
				]);
			}
		} catch (error) {
			toasts = createToasts([
				{
					text: k('admin.users.tables.actions.resend-invite.toasts.error-local'),
					type: 'warning',
					timeout: showInviteResentTextDuration,
					extraData: `<div class="mt-3 italic">${error}</div>`,
				},
			]);
		}

		setPageToasts(toasts);

		isSendingNewInvite = false;
	}
</script>

<Button size="xs" on:click={handleResend} color="green" disabled={isSendingNewInvite}>
	{$t('admin.users.tables.actions.resend-invite.button')}
</Button>
