<script lang="ts">
	import Icon from '$/lib/components/Icon.svelte';
	import { subscribe } from '$/lib/houdini/helper.js';
	import { NewMessageStore } from '$houdini';
	import { mdiSend } from '@mdi/js';
	import { Button, Helper, Input, Label, P } from 'flowbite-svelte';
	import { onMount, tick } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$houdini.js';
	import type { ChatMessageType } from './index.js';

	export let data: PageData;

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

			const newMessage: ChatMessageType = {
				active: false,
				user: { email: sessionUser!.email },
				text: message,
				time: new Date(),
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

	$: ({ GetChatMessages, sessionUser } = data);

	subscribe(NewMessageStore, ({ data }) => {
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
	});

	$: messages = ($GetChatMessages.data?.messages ?? []).map<ChatMessageType>((rawMessage) => ({
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

	$: canSend = !data.userHasJs || (!!$form.message && !isSending);

	onMount(() => {
		messageViewElement.scrollTop = messageViewElement.scrollHeight;
	});
</script>

<div bind:this={messageViewElement} class="h-[55vh] overflow-y-scroll mb-5">
	{#each messages as message (message.id)}
		<P class={message.active ? '' : 'text-gray-500 dark:text-gray-400 italic'}>{message.user.email} : {message.text}</P>
	{/each}
</div>

<form method="POST" use:enhance class="flex flex-col gap-3">
	<div>
		<Label for="message" class="mb-2">Message</Label>
		<Input type="text" name="message" disabled={isSending} bind:value={$form.message} autocomplete="off" {...$constraints} />
		{#if $errors.message}<Helper class="mt-1" color="red">{$errors.message}</Helper>{/if}
	</div>

	<Button type="submit" disabled={!canSend}>
		Send
		<Icon path={mdiSend} class="ml-2" />
	</Button>
</form>
