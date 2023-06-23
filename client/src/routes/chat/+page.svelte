<script lang="ts">
	import type { GetChatMessagesQuery, SendMessageMutation, SendMessageMutationVariables } from '$/graphql/@generated';
	import { mutation, queryStore } from '$/lib/urql';
	import { gql } from '@urql/svelte';
	import { Button, Input, Label, P } from 'flowbite-svelte';

	const messages = queryStore({
		query: gql<GetChatMessagesQuery>`
			query GetChatMessages {
				messages {
					text
					user {
						email
					}
				}
			}
		`,
	});

	const useSendMessage = mutation(gql<SendMessageMutation, SendMessageMutationVariables>`
		mutation SendMessage($message: String!, $email: String!) {
			addMessage(data: { text: $message, user: { connect: { email: $email } } }) {
				text
			}
		}
	`);

	function handleSend() {
		if (!message) {
			return;
		}

		useSendMessage({ email: data.user!.email, message });
	}

	export let data;

	let message: string | null = null;
</script>

{#if $messages.fetching}
	<P>Fetching...</P>
{:else if $messages.error || !$messages.data}
	<P color="red">Error!</P>
	<P color="red">{$messages.error}</P>
{:else}
	{#each $messages.data.messages as message}
		<P>{message.user.email} : {message.text}</P>
	{/each}
{/if}

<form on:submit|preventDefault>
	<div class="gap-6 mb-6 md:grid-cols-2">
		<div>
			<Label for="message" class="mb-2">Message</Label>
			<Input type="text" name="message" bind:value={message} />
		</div>

		<Button type="submit" on:click={() => handleSend()}>Submit</Button>
	</div>
</form>
