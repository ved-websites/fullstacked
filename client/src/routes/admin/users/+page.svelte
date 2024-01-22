<script lang="ts">
	import { enhance } from '$app/forms';
	// import { AdminUserDataStore } from '$houdini';
	import { getI18n } from '$i18n';
	// import { subscribe } from '$lib/houdini/helper';
	import { wsClient } from '$lib/ts-ws/client';
	import { Button, Heading, Modal } from 'flowbite-svelte';
	import type { ComponentEvents } from 'svelte';
	import CopyInviteButton from './components/UsersTable/CopyInviteButton.svelte';
	import ResendInviteButton from './components/UsersTable/ResendInviteButton.svelte';
	import UsersTable from './components/UsersTable/UsersTable.svelte';
	import type { BaseUser } from './types';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	export let data;

	let registeredUsers: Awaited<typeof data.streamed.users>[0] | undefined;
	let unregisteredUsers: Omit<Awaited<typeof data.streamed.users>[1][number], 'online'>[] | undefined;

	wsClient.users.edited({}, ({ data: editedUser }) => {
		if (editedUser.registerToken) {
			unregisteredUsers = unregisteredUsers?.map((u) => {
				if (u.email === editedUser.email) {
					return editedUser;
				}

				return u;
			});
		} else {
			registeredUsers = registeredUsers?.map((u) => {
				if (u.email === editedUser.email) {
					return editedUser;
				}

				return u;
			});
		}
	});

	wsClient.users.onlineChange({}, ({ data: user }) => {
		registeredUsers = registeredUsers?.map((u) => {
			if (u.email === user.email) {
				return { ...u, online: user.online };
			}

			return u;
		});
	});

	wsClient.users.created({}, ({ data: user }) => {
		unregisteredUsers = [...(unregisteredUsers ?? []), user];
	});

	wsClient.users.deleted({}, ({ data: { email } }) => {
		if (unregisteredUsers?.some((u) => u.email === email)) {
			unregisteredUsers = unregisteredUsers?.filter((u) => u.email !== email);
		}
		if (registeredUsers?.some((u) => u.email === email)) {
			registeredUsers = registeredUsers?.filter((u) => u.email !== email);
		}
	});

	data.streamed.users
		.then(([streamedRegisteredUsers, streamedUnregisteredUsers]) => {
			registeredUsers = streamedRegisteredUsers;
			unregisteredUsers = streamedUnregisteredUsers;
		})
		.catch(() => {
			registeredUsers = [];
			unregisteredUsers = [];
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

<div class="grid gap-10 grid-cols-1 lg:grid-cols-2">
	<div>
		<Heading tag="h4" class="mb-2">{$t('admin.users.tables.registered.heading')}</Heading>

		<UsersTable users={registeredUsers} showUserAvatars on:deleteUser={onDeleteUser} />
	</div>

	<div>
		<Heading tag="h4" class="mb-2">{$t('admin.users.tables.unregistered.heading')}</Heading>

		<UsersTable name="unregistered" users={unregisteredUsers} on:deleteUser={onDeleteUser}>
			<svelte:fragment slot="more-actions" let:user>
				<ResendInviteButton {user} />
				<CopyInviteButton {user} />
			</svelte:fragment>
		</UsersTable>
	</div>
</div>

<Modal title={$t('admin.users.modal.title')} open={!!deletionUser}>
	<div class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
		<p>{$t('admin.users.modal.body.warning')}</p>
		<p>{@html $t('admin.users.modal.body.confirmation', { email: deletionUser?.email })}</p>
	</div>

	<form method="post" action="?/delete" class="flex" use:enhance on:submit={() => (deletionUser = undefined)}>
		<Button class="ml-auto" color="red" type="submit">{$t('common.confirm')}</Button>
		<input type="hidden" name="email" value={deletionUser?.email} />
	</form>
</Modal>
