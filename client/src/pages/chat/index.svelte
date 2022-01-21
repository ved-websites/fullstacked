<!-- routify:options title="Chat" -->
<script lang="ts">
	import type { UserMessage } from '$/types/chat';
	import { onMountPromise } from '$/utils';
	import { client } from '$/utils/urql';
	import type { ChatMessageFragment } from '$gql';
	import { GetMessagesDocument, NewMessagesDocument } from '$gql';
	import { operationStore, subscription } from '@urql/svelte';
	import { delayer } from 'minimum-delayer';
	import ProgressCircular from 'svelte-materialify/src/components/ProgressCircular/ProgressCircular.svelte';
	import Message from './_component/Message.svelte';
	import Form from './_component/MessageForm.svelte';

	type ChatMessage = ChatMessageFragment & { active: boolean };

	let username: string | undefined = undefined;
	let messages: ChatMessage[] = [];

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

	subscription(operationStore(NewMessagesDocument), (prevMessages: ChatMessageFragment[] = [], data) => {
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

		return [...prevMessages, data.messageAdded];
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

<div class="block border p-3">
	{#await messagesPromise}
		<div class="flex justify-center">
			<span class="self-center">Loading chat service...</span>
			<ProgressCircular indeterminate color="primary" class="ml-3" />
		</div>
	{:then}
		{#if messages.length == 0}
			<span>No messages yet! Be the first to send one!</span>
		{:else}
			<ul id="messages" class="list-disc list-inside px-5 pt-2 pb-5">
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
