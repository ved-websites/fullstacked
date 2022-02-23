<script lang="ts">
	import { SendNewMessageDocument } from '$/graphql/@generated';
	import type { UserMessage } from '$/types/chat';
	import Button,{ Icon as ButtonIcon,Label } from '@smui/button';
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import TextfieldIcon from '@smui/textfield/icon';
	import { getClient } from '@urql/svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let username: string | null = null;
	export let message: string | null = null;

	let isSending = false;

	$: canSend = username && message && !isSending;

	let messageRef: HTMLElement | undefined;

	const client = getClient();

	async function handleSend() {
		if (username && message) {
			try {
				isSending = true;

				const data: UserMessage = { username, text: message };

				dispatch('send', data);
				
				const { error } = await client.mutation(SendNewMessageDocument, data).toPromise();

				// const mutateMessage = mutation(operationStore(SendNewMessageDocument));

				// const { error } = await mutateMessage(data);

				if (error) {
					throw error;
				}

				message = null;
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
	<!-- <TextField bind:value={username} disabled={isSending} class="mt-3">Username</TextField>
	<TextField bind:value={message} disabled={isSending} class="mt-5" bind:inputElement={messageRef} autocomplete="off">Message</TextField>
	<div class="flex justify-center mt-5">
		<Button disabled={!canSend} on:click={handleSend}>
			Send Message
			<Icon path={mdiSend} class="ml-3" />
		</Button>
	</div> -->
	<Textfield bind:value={username} label="Username">
		<TextfieldIcon class="material-icons" slot="leadingIcon">person</TextfieldIcon>
		<HelperText slot="helper">Your beautiful username!</HelperText>
	</Textfield>
	<Textfield bind:value={message} label="Message">
		<TextfieldIcon class="material-icons" slot="leadingIcon">notes</TextfieldIcon>
		<HelperText slot="helper">Your non-discrete message...</HelperText>
	</Textfield>
	<Button disabled={!canSend} on:click={handleSend}>
		<Label>Send</Label>
		<ButtonIcon class="material-icons">send</ButtonIcon>
	</Button>
</form>
