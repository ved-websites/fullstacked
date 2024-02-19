<script lang="ts">
	import { getI18n } from '$i18n';
	import { getSessionUser } from '$lib/stores';
	import { wsClient } from '$lib/ts-ws/client';
	import { cn } from '$lib/twMerge';
	import { Popover } from 'flowbite-svelte';
	import { WsStatusCodes } from '~contract';
	import Icon from '../Icon.svelte';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	let sessionUser = getSessionUser();

	let issueMessage: string | undefined = undefined;

	let iconColor: string | undefined = undefined;

	$: showWsIssue = issueMessage !== undefined || $sessionUser === undefined;

	wsClient.$socket.onConnChange = (event) => {
		if (event.type === 'open') {
			iconColor = undefined;
			issueMessage = undefined;
			return;
		}

		if (event.type === 'close' && event.code === WsStatusCodes.CLOSE_ABNORMAL) {
			iconColor = 'text-red-500';
			issueMessage = event.reason;
		}
	};
</script>

<Icon id="ws-issue-indicator" class={cn('i-mdi-wifi-strength-alert-outline', iconColor, !showWsIssue && 'hidden')} />

{#if showWsIssue}
	<!-- TODO : i18n -->
	<Popover class="max-w-[14rem]" triggeredBy="#ws-issue-indicator">
		<div class="flex flex-col gap-3 p-1">
			<div class={cn('text-center', issueMessage && 'font-bold')}>You are not connected to realtime updates!</div>
			{#if issueMessage}
				<div class="italic">
					Issue : {$t(issueMessage)}
				</div>
			{/if}
		</div>
	</Popover>
{/if}
