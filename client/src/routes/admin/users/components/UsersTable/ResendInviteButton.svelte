<script lang="ts">
	import { createToasts, setPageToasts, type ToastData } from '$lib/components/ToastManager/helper';
	import { context } from '$lib/runes';
	import type { TsRestClient } from '$lib/ts-rest/client';
	import { Button } from 'flowbite-svelte';
	import { StatusCodes } from 'http-status-codes';
	import type { BaseUser } from '../../types';

	let {
		i18n: { t },
	} = $derived(context());

	interface Props {
		user: BaseUser & { registerToken: string | null };
		showInviteResentTextDuration?: number;
		tsrest: TsRestClient;
	}

	let { user, showInviteResentTextDuration = 3000, tsrest }: Props = $props();

	let isSendingNewInvite = $state(false);

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
				toasts = createToasts({
					text: $t('admin.users.tables.actions.resend-invite.toasts.success', { email: user.email }),
					timeout: showInviteResentTextDuration,
				});
			} else {
				toasts = createToasts({
					text: 'admin.users.tables.actions.resend-invite.toasts.error-server' satisfies I18nKey,
					timeout: showInviteResentTextDuration,
					// extraData: `<div class="mt-3 italic">${errors}</div>`,
				});
			}
		} catch (error) {
			toasts = createToasts({
				text: 'admin.users.tables.actions.resend-invite.toasts.error-local' satisfies I18nKey,
				type: 'warning',
				timeout: showInviteResentTextDuration,
				extraData: `<div class="mt-3 italic">${error}</div>`,
			});
		}

		setPageToasts(toasts);

		isSendingNewInvite = false;
	}
</script>

<Button size="xs" onclick={handleResend} color="green" disabled={isSendingNewInvite}>
	{$t('admin.users.tables.actions.resend-invite.button')}
</Button>
