<script lang="ts">
	import { enhance } from '$app/forms';
	import { createLayoutAlert } from '$lib/components/LayoutAlert/helper';
	import { context } from '$lib/runes';
	import { wsClient } from '$lib/ts-ws/client';
	import { handleStreamed, type StreamedData } from '$lib/utils/streaming';
	import { Button, Heading, Modal } from 'flowbite-svelte';
	import CopyInviteButton from './components/UsersTable/CopyInviteButton.svelte';
	import ResendInviteButton from './components/UsersTable/ResendInviteButton.svelte';
	import UsersTable from './components/UsersTable/UsersTable.svelte';
	import type { BaseUser } from './types';

	let {
		i18n: { t },
	} = context();

	let { data } = $props();

	let users: StreamedData<typeof data.users> | undefined = $state();

	wsClient.users.edited({}, ({ data: editedUser }) => {
		users = users?.map((u) => {
			if (u.id === editedUser.id) {
				return editedUser;
			}

			return u;
		});
	});

	wsClient.users.onlineChange({}, ({ data: user }) => {
		users = users?.map((u) => {
			if (u.id === user.id) {
				return { ...u, online: user.online };
			}

			return u;
		});
	});

	wsClient.users.created({}, ({ data: user }) => {
		users = [...(users ?? []), { ...user, online: null }];
	});

	wsClient.users.deleted({}, ({ data: { id } }) => {
		if (users?.some((u) => u.id === id)) {
			users = users?.filter((u) => u.id !== id);
		}
	});

	handleStreamed(data.users, {
		onData: (streamedUsers) => {
			users = streamedUsers;
		},
		onError: (error) => {
			users = [];

			return {
				layoutAlert: createLayoutAlert({
					text: error,
					type: 'error',
				}),
			};
		},
	});

	let deletionUser = $state<BaseUser | undefined>();
</script>

<Heading tag="h2">{$t('admin.users.heading')}</Heading>

<div class="self-center">
	<Button href="/admin/users/new">{$t('admin.users.create-button')}</Button>
</div>

<UsersTable heading={$t('admin.users.tables.heading')} {users} onDeleteUser={(user) => (deletionUser = user)}>
	{#snippet moreActions({ user })}
		{#if user.registerToken}
			<ResendInviteButton {user} tsrest={data.tsrest} />
			<CopyInviteButton {user} />
		{/if}
	{/snippet}
</UsersTable>

<Modal title={$t('admin.users.modal.title')} open={!!deletionUser}>
	<div class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
		<p>{$t('admin.users.modal.body.warning')}</p>
		<p>{@html $t('admin.users.modal.body.confirmation', { email: deletionUser?.email })}</p>
	</div>

	<form method="POST" action="?/delete" class="flex" use:enhance onsubmit={() => (deletionUser = undefined)}>
		<Button class="ml-auto" color="red" type="submit">{$t('common.confirm')}</Button>
		<input type="hidden" name="email" value={deletionUser?.email} />
	</form>
</Modal>
