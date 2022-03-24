<script lang="ts">
	import { SendNewMessageDocument } from '$/graphql/@generated';
	import type { UserMessage } from '$/types/chat';
	import Button, { Icon as ButtonIcon, Label } from '@smui/button';
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

	let focusMessageField: (() => void) | undefined;

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

				focusMessageField?.();
			}
		}
	}
</script>

<form on:submit|preventDefault>
	<Textfield bind:value={username} disabled={isSending} label="Username">
		<TextfieldIcon class="material-icons" slot="leadingIcon">person</TextfieldIcon>
		<HelperText slot="helper">Your beautiful username!</HelperText>
	</Textfield>
	<Textfield bind:value={message} disabled={isSending} bind:focus={focusMessageField} label="Message">
		<TextfieldIcon class="material-icons" slot="leadingIcon">notes</TextfieldIcon>
		<HelperText slot="helper">Your non-discrete message...</HelperText>
	</Textfield>
	<Button disabled={!canSend} on:click={handleSend}>
		<Label>Send</Label>
		<ButtonIcon class="material-icons">send</ButtonIcon>
	</Button>
</form>
