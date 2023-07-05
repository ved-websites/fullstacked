<script lang="ts">
	import { ChatMessageFragmentDoc, type NewMessageSubscription, type NewMessageSubscriptionVariables } from '$/graphql/@generated';
	import Icon from '$/lib/components/Icon.svelte';
	import { subscribe } from '$/lib/urql';
	import { browser } from '$app/environment';
	import { mdiSend } from '@mdi/js';
	import { gql } from '@urql/svelte';
	import { Button, Helper, Input, Label, P } from 'flowbite-svelte';
	import { onMount, tick } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { ChatMessage } from './index.js';

	export let data;

	let isSending = false;
	let messageViewElement: HTMLDivElement;

	const { enhance, form, constraints, errors } = superForm(data.form, {
		resetForm: true,
		async onSubmit({ formData, cancel }) {
			const message = formData.get('message')?.toString();

			if (!message) {
				return cancel();
			}

			isSending = true;

			const newMessage: ChatMessage = {
				active: false,
				user: { email: sessionUser!.email },
				text: message,
				time: new Date().toDateString(),
			};

			messages = [...messages, newMessage];

			await tick();

			messageViewElement.scrollTop = messageViewElement.scrollHeight;
		},
		onError() {
			isSending = false;
		},
		onResult() {
			isSending = false;

			messageViewElement.scrollTop = messageViewElement.scrollHeight;
		},
	});

	subscribe(
		gql<NewMessageSubscription, NewMessageSubscriptionVariables>`
			${ChatMessageFragmentDoc}

			subscription NewMessage {
				messageAdded {
					...ChatMessage
				}
			}
		`,
		({ data }) => {
			if (!data) {
				return;
			}

			if (data.messageAdded.user.email == sessionUser?.email) {
				messages = messages.map((m) => {
					if (!m.id && m.text == data.messageAdded.text) {
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
		},
	);

	$: ({ messages: rawMessages, sessionUser } = data);

	$: messages = rawMessages.map<ChatMessage>((rawMessage) => ({
		id: rawMessage.id,
		user: {
			email: rawMessage.user.email,
			name: rawMessage.user.firstName
				? `${rawMessage.user.firstName}${rawMessage.user.lastName ? ` ${rawMessage.user.lastName}` : ''}`
				: undefined,
		},
		text: rawMessage.text,
		time: rawMessage.time,
		active: true,
	}));

	$: canSend = !browser || (!!$form.message && !isSending);

	onMount(() => {
		messageViewElement.scrollTop = messageViewElement.scrollHeight;
	});
</script>

<div bind:this={messageViewElement} class="h-[55vh] overflow-y-scroll mb-5">
	{#each messages as message (message.id)}
		<P class={message.active ? '' : 'text-gray-500 dark:text-gray-400 italic'}>{message.user.email} : {message.text}</P>
	{/each}
</div>

<form method="POST" use:enhance>
	<div class="mb-3">
		<Label for="message" class="mb-2">Message</Label>
		<Input type="text" name="message" disabled={isSending} bind:value={$form.message} autocomplete="off" {...$constraints} />
		{#if $errors.message}<Helper color="red">{$errors.message}</Helper>{/if}
	</div>

	<Button type="submit" disabled={!canSend}>
		Send
		<Icon path={mdiSend} class="ml-2" />
	</Button>
</form>
