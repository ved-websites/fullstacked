<script lang="ts">
	import type { ConfirmedSessionUser } from '$auth/auth-handler';
	import { getI18n } from '$i18n';
	import Icon from '$lib/components/Icon.svelte';
	import ValidationErrors from '$lib/components/ValidationErrors.svelte';
	import { getSessionUser } from '$lib/stores';
	import { wsClient } from '$lib/ts-ws/client';
	import { Button, Input, Label } from 'flowbite-svelte';
	import { onMount, tick } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { ChatMessageType } from './types';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	export let data;
	let { chatMessages } = data;

	let sessionUser = getSessionUser<ConfirmedSessionUser>();

	let isSending = false;
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
				user: { email: $sessionUser.email },
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

	wsClient.messages.new(({ data }) => {
		if (data.user.email == $sessionUser.email) {
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

		messageViewElement.scrollTop = messageViewElement.scrollHeight;
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
			<p>{$t('chat.empty.header')}</p>
			<p class="italic">{$t('chat.empty.subheader')}</p>
		</div>
	{/each}
</div>

<form method="POST" use:enhance class="flex flex-col gap-3">
	<Label>
		<span>{$t('chat.form.label')}</span>
		<Input type="text" class="mt-2" name="message" disabled={isSending} bind:value={$form.message} autocomplete="off" {...$constraints} />
	</Label>
	<ValidationErrors errors={$errors.message} />

	<Button type="submit" disabled={!canSend}>
		{$t('chat.form.send')}
		<Icon class="i-mdi-send ml-2" />
	</Button>
</form>
