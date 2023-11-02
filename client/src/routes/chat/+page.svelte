<script lang="ts">
	import type { ConfirmedSessionUser } from '$auth/auth-handler';
	import { NewMessageStore } from '$houdini';
	import Icon from '$lib/components/Icon.svelte';
	import ValidationErrors from '$lib/components/ValidationErrors.svelte';
	import { subscribe } from '$lib/houdini/helper';
	import { getSessionUser } from '$lib/stores';
	import { Button, Input, Label } from 'flowbite-svelte';
	import { onMount, tick } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { ChatMessageType } from './types';

	export let data;
	$: ({ chatMessages } = data);

	let sessionUser = getSessionUser<ConfirmedSessionUser>();

	let isSending = false;
	let messageViewElement: HTMLDivElement;

	const { enhance, form, constraints, errors } = superForm(data.form, {
		resetForm: true,
		async onSubmit({ formData }) {
			const message = formData.get('message')?.toString();

			if (!message) {
				return;
			}

			isSending = true;

			const newMessage: ChatMessageType = {
				active: false,
				user: { email: $sessionUser.email },
				text: message!,
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

	subscribe(NewMessageStore, ({ data }) => {
		if (!data) {
			return;
		}

		if (data.messageAdded.user.email == $sessionUser.email) {
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

	$: messages = chatMessages.map<ChatMessageType>((rawMessage) => ({
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

<div bind:this={messageViewElement} class="h-[55vh] overflow-y-scroll mb-5 flex flex-col">
	{#each messages as message (message.id)}
		<div class={message.active ? '' : 'text-gray-500 dark:text-gray-400 italic'}>
			<span>{message.user.email}</span>
			<span> : </span>
			<span>{message.text}</span>
		</div>
	{:else}
		<div class="self-center text-center">
			<p>No messages yet!</p>
			<p class="italic">Be the first?</p>
		</div>
	{/each}
</div>

<form method="POST" use:enhance class="flex flex-col gap-3">
	<Label>
		<span>Message</span>
		<Input type="text" class="mt-2" name="message" disabled={isSending} bind:value={$form.message} autocomplete="off" {...$constraints} />
	</Label>
	<ValidationErrors errors={$errors.message} />

	<Button type="submit" disabled={!canSend}>
		Send
		<Icon class="i-mdi-send ml-2" />
	</Button>
</form>
