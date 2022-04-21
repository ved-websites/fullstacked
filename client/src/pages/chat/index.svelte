<script lang="ts">
	import type { UserMessage } from '$/types/chat';
	import { onMountPromise } from '$/utils';
	import { subscribe } from '$/utils/urql';
	import { ChatMessageFragment, GetMessagesDocument, NewMessagesDocument, NewMessagesStartingWithDocument } from '$gql';
	import CircularProgress from '@smui/circular-progress';
	import { getClient } from '@urql/svelte';
	import { delayer } from 'minimum-delayer';
	import Message from './_component/Message.svelte';
	import Form from './_component/MessageForm.svelte';

	type ChatMessage = ChatMessageFragment & { active: boolean };

	let username: string | undefined = undefined;
	let messages: ChatMessage[] = [];

	const client = getClient();

	const messagesPromise = onMountPromise(async () => {
		const response = await delayer(() => client.query(GetMessagesDocument).toPromise(), { delay: 500 });

		if (response.error) {
			throw response.error.message;
		}

		const messageQuery = response.data;

		if (messageQuery) {
			const fetchedMessages = messageQuery.messages.map((message) => ({ active: true, ...message }));

			messages = [...fetchedMessages, ...messages];
		}
	});

	subscribe(NewMessagesDocument, ({ data }) => {
		if (!data) {
			return;
		}

		if (data.messageAdded.user.username == username) {
			messages = messages.map((m) => {
				if (m.text == data.messageAdded.text) {
					m = { ...data.messageAdded, active: true };
				}
				return m;
			});
		} else {
			messages = [
				...messages.filter((m) => m.active),
				{
					...data.messageAdded,
					active: true,
				},
				...messages.filter((m) => !m.active),
			];
		}
	});

	subscribe([NewMessagesStartingWithDocument, { text: 'this' }], ({ data }) => {
		if (!data) {
			return;
		}

		console.log(`A new message was logged that starts with 'this'!`, data.messageAdded);
	});

	function handleSend(e: CustomEvent) {
		const { username, text } = e.detail as UserMessage;

		const newMessage: ChatMessage = {
			active: false,
			user: { username },
			text,
			time: undefined,
		};

		messages = [...messages, newMessage];
	}
</script>

<!-- routify:meta title="Chat" -->
<!-- routify:meta icon="chat" -->
<!-- routify:meta dirname="Comms" -->
<!-- routify:meta diricon="email" -->

<div class="p-3 border border-sky-500 dark:border-red-500">
	{#await messagesPromise}
		<div class="flex justify-center">
			<span class="self-center">Loading chat service...</span>
			<CircularProgress class="my-four-colors" style="height: 32px; width: 32px;" indeterminate fourColor />
		</div>
	{:then}
		{#if messages.length == 0}
			<span>No messages yet! Be the first to send one!</span>
		{:else}
			<ul id="messages" class="list-disc list-inside px-5">
				{#each messages as { user: { username }, text, time, active }}
					<Message {username} {text} {time} {active} />
				{/each}
			</ul>
		{/if}
		<Form on:send={handleSend} bind:username />
	{:catch error}
		<div class="flex justify-center">
			<span>pls <span class="text-red-600 font-bold">{error}</span></span>
		</div>
	{/await}
</div>
