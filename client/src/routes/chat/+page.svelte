<script lang="ts">
	import type { GetChatMessagesQuery, SendMessageMutation, SendMessageMutationVariables } from '$/graphql/@generated';
	import { mutationStore, queryStore } from '$/lib/urql';
	import { gql } from '@urql/svelte';
	import { Button, Input, Label, P } from 'flowbite-svelte';

	const messages = queryStore({
		query: gql<GetChatMessagesQuery>`
			query GetChatMessages {
				messages {
					text
					user {
						username
					}
				}
			}
		`,
	});

	function sendMessage(username: string, text: string) {
		const result = mutationStore({
			query: gql<SendMessageMutation, SendMessageMutationVariables>`
				mutation SendMessage($text: String!, $username: String!) {
					addMessage(data: { text: $text, user: { connect: { username: $username } } }) {
						text
						user {
							username
						}
					}
				}
			`,
			variables: {
				text,
				username,
			},
		});
	}

	function handleSend() {
		if (!username || !message) {
			return;
		}

		sendMessage(username, message);
	}

	let username: string | null = null;
	let message: string | null = null;
</script>

{#if $messages.fetching}
	<P>Fetching...</P>
{:else if $messages.error || !$messages.data}
	<P color="red">Error!</P>
	<P color="red">{$messages.error}</P>
{:else}
	{#each $messages.data.messages as message}
		<P>{message.user.username} : {message.text}</P>
	{/each}
{/if}

<form on:submit|preventDefault>
	<div class="gap-6 mb-6 md:grid-cols-2">
		<div>
			<Label for="username" class="mb-2">Username</Label>
			<Input type="text" name="username" placeholder="Joe Blo" bind:value={username} />
		</div>
		<div>
			<Label for="message" class="mb-2">Message</Label>
			<Input type="text" name="message" bind:value={message} />
		</div>

		<Button type="submit" on:click={() => handleSend()}>Submit</Button>
	</div>
</form>
