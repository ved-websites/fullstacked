<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import FormInput from '$lib/components/forms/FormInput.svelte';
	import { context } from '$lib/runes';
	import { wsClient } from '$lib/ts-ws/client';
	import { Button } from 'flowbite-svelte';
	import { onMount, tick } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { ChatMessageType } from './types';

	let {
		i18n: { t },
		sessionUser,
	} = context();

	let { data } = $props();
	let { chatMessages } = data;

	let isSending = $state(false);

	let messageViewElement: HTMLDivElement;

	const { enhance, form, constraints, errors } = superForm(data.form, {
		resetForm: true,
		invalidateAll: false,
		async onSubmit({ formData }) {
			const message = formData.get('message')?.toString();

			if (!message) {
				return;
			}

			isSending = true;

			const newMessage: ChatMessageType = {
				active: false,
				user: { email: sessionUser.email },
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

	wsClient.messages.new(async ({ data }) => {
		if (data.user.email == sessionUser.email) {
			messages = messages.map((m) => {
				if (!m.id && m.text == data.text) {
					m = { ...data, active: true };
				}
				return m;
			});
		} else {
			messages = [
				...messages.filter((m) => m.active),
				{
					...data,
					active: true,
				},
				...messages.filter((m) => !m.active),
			];
		}

		await tick();

		messageViewElement.scrollTop = messageViewElement.scrollHeight;
	});

	let messages = $derived(
		chatMessages.map<ChatMessageType>((rawMessage) => ({
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
		})),
	);

	let canSend = $derived(!data.userHasJs || (!!$form.message && !isSending));

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
			<p>{$t('chat.empty.header')}</p>
			<p class="italic">{$t('chat.empty.subheader')}</p>
		</div>
	{/each}
</div>

<form method="POST" use:enhance class="flex flex-col gap-3">
	<FormInput
		type="text"
		name="message"
		disabled={isSending}
		autocomplete="off"
		noAsterix
		bind:value={$form.message}
		{...$constraints.message}
		errors={$errors.message}
	>
		{$t('chat.form.label')}
	</FormInput>

	<Button type="submit" disabled={!canSend}>
		{$t('chat.form.send')}
		<Icon class="i-mdi-send ml-2" />
	</Button>
</form>
