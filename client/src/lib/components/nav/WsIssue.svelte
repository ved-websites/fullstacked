<script lang="ts">
	import { contextPublic } from '$lib/runes';
	import { wsClient } from '$lib/ts-ws/client';
	import { cn } from '$lib/twMerge';
	import { Popover } from 'flowbite-svelte';
	import { WsStatusCodes } from '~contract';
	import Icon from '../Icon.svelte';

	let {
		i18n: { t },
		sessionUser,
	} = $derived(contextPublic());

	let issueMessage = $state<string | undefined>(undefined);
	let iconColor = $state<string | undefined>(undefined);

	let showWsIssue = $derived(issueMessage !== undefined || sessionUser === undefined);

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
	<Popover class="max-w-[14rem]" triggeredBy="#ws-issue-indicator">
		<div class="flex flex-col gap-3 p-1">
			<div class={cn('text-center', issueMessage && 'font-bold')}>
				{$t('common.errors.realtime.not-connected')}
			</div>
			{#if issueMessage}
				<div class="italic">
					{$t('common.errors.realtime.issue', { issue: $t(issueMessage) })}
				</div>
			{/if}
		</div>
	</Popover>
{/if}
