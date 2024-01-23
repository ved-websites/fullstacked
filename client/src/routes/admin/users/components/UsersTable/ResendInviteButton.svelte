<script lang="ts">
	import { getI18n } from '$i18n';
	import { createToasts, setPageToasts, type ToastData } from '$lib/components/ToastManager/helper';
	import type { TsRestClient } from '$lib/ts-rest/client';
	import { Button } from 'flowbite-svelte';
	import { StatusCodes } from 'http-status-codes';
	import { k } from '~shared';
	import type { BaseUser } from '../../types';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	export let user: BaseUser & { registerToken: string | null };
	export let showInviteResentTextDuration: number = 3000;

	export let tsrest: TsRestClient;

	let isSendingNewInvite = false;

	async function handleResend() {
		isSendingNewInvite = true;

		let toasts: ToastData[];

		try {
			const result = await tsrest.users.admin.resendInviteLink({ body: { email: user.email }, skipErrorHandling: true });

			if (result.status !== StatusCodes.OK) {
				return;
			}

			const success = result.body;

			if (success) {
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
						// extraData: `<div class="mt-3 italic">${errors}</div>`,
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
