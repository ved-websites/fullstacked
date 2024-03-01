<script lang="ts">
	import { enhance } from '$app/forms';
	import { getI18n } from '$i18n';
	import { createLayoutAlert } from '$lib/components/LayoutAlert/helper';
	import { wsClient } from '$lib/ts-ws/client';
	import { handleStreamed, type StreamedData } from '$lib/utils/streaming';
	import { Button, Heading, Modal } from 'flowbite-svelte';
	import type { ComponentEvents } from 'svelte';
	import CopyInviteButton from './components/UsersTable/CopyInviteButton.svelte';
	import ResendInviteButton from './components/UsersTable/ResendInviteButton.svelte';
	import UsersTable from './components/UsersTable/UsersTable.svelte';
	import type { BaseUser } from './types';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	export let data;

	let users: StreamedData<typeof data.users> | undefined;

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

	let deletionUser: BaseUser | undefined;

	function onDeleteUser(event: ComponentEvents<UsersTable>['deleteUser']) {
		const { detail: user } = event;

		deletionUser = user;
	}
</script>

<Heading tag="h2">{$t('admin.users.heading')}</Heading>

<div class="self-center">
	<Button href="/admin/users/new">{$t('admin.users.create-button')}</Button>
</div>

<UsersTable heading={$t('admin.users.tables.heading')} {users} on:deleteUser={onDeleteUser}>
	<svelte:fragment slot="more-actions" let:user>
		{#if user.registerToken}
			<ResendInviteButton {user} tsrest={data.tsrest} />
			<CopyInviteButton {user} />
		{/if}
	</svelte:fragment>
</UsersTable>

<Modal title={$t('admin.users.modal.title')} open={!!deletionUser}>
	<div class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
		<p>{$t('admin.users.modal.body.warning')}</p>
		<p>{@html $t('admin.users.modal.body.confirmation', { email: deletionUser?.email })}</p>
	</div>

	<form method="POST" action="?/delete" class="flex" use:enhance on:submit={() => (deletionUser = undefined)}>
		<Button class="ml-auto" color="red" type="submit">{$t('common.confirm')}</Button>
		<input type="hidden" name="email" value={deletionUser?.email} />
	</form>
</Modal>
