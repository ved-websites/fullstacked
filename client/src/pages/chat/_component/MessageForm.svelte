<script lang="ts">
	import { SendNewMessageDocument } from '$/graphql/@generated';
	import type { UserMessage } from '$/types/chat';
	import { client } from '$/utils/urql';
	import { mdiSend } from '@mdi/js';
	import { createEventDispatcher } from 'svelte';
	import Button from 'svelte-materialify/src/components/Button/Button.svelte';
	import Icon from 'svelte-materialify/src/components/Icon/Icon.svelte';
	import TextField from 'svelte-materialify/src/components/TextField/TextField.svelte';

	const dispatch = createEventDispatcher();

	export let username: string | undefined = undefined;
	export let message: string | undefined = undefined;

	let isSending = false;

	$: canSend = username && message && !isSending;

	let messageRef: HTMLElement | undefined;

	async function handleSend() {
		if (username && message) {
			try {
				isSending = true;

				const data: UserMessage = { username, text: message };

				dispatch('send', data);

				const { error } = await client.mutation(SendNewMessageDocument, data).toPromise();

				if (error) {
					throw error;
				}

				message = undefined;
			} catch (error) {
				// no error management yet
			} finally {
				isSending = false;

				messageRef?.focus();
			}
		}
	}
</script>

<form on:submit|preventDefault>
	<TextField bind:value={username} disabled={isSending} class="mt-3">Username</TextField>
	<TextField bind:value={message} disabled={isSending} class="mt-5" bind:inputElement={messageRef} autocomplete="off">Message</TextField>
	<div class="flex justify-center mt-5">
		<Button disabled={!canSend} on:click={handleSend}>
			Send Message
			<Icon path={mdiSend} class="ml-3" />
		</Button>
	</div>
</form>
