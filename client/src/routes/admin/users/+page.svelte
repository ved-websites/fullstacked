<script lang="ts">
	import { enhance } from '$app/forms';
	import { getI18n } from '$i18n';
	import { Button, Heading, Modal } from 'flowbite-svelte';
	import type { ComponentEvents } from 'svelte';
	import type { PageData } from './$houdini';
	import CopyInviteButton from './components/UsersTable/CopyInviteButton.svelte';
	import ResendInviteButton from './components/UsersTable/ResendInviteButton.svelte';
	import UsersTable from './components/UsersTable/UsersTable.svelte';
	import type { BaseUser } from './types';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	export let data: PageData;

	$: ({ ManageGetUsers } = data);

	$: users = $ManageGetUsers.data?.users;
	$: unregisteredUsers = $ManageGetUsers.data?.unregisteredUsers.map((u) => ({ ...u, sendingNewInvite: false as boolean }));

	let deleteModalOpen = false;
	let deletionUser: BaseUser | undefined;

	function onDeleteUser(event: ComponentEvents<UsersTable>['deleteUser']) {
		const { detail: user } = event;

		deletionUser = user;
		deleteModalOpen = true;
	}
</script>

<Heading tag="h2">{$t('admin.users.heading')}</Heading>

<div class="self-center">
	<Button href="/admin/users/new">{$t('admin.users.create-button')}</Button>
</div>

<div class="grid gap-10 grid-cols-1 lg:grid-cols-2">
	<div>
		<Heading tag="h4" class="mb-2">{$t('admin.users.tables.registered.heading')}</Heading>

		<UsersTable {users} on:deleteUser={onDeleteUser} />
	</div>

	<!-- <Hr /> -->

	<div>
		<Heading tag="h4" class="mb-2">{$t('admin.users.tables.unregistered.heading')}</Heading>

		<UsersTable name="unregistered" users={unregisteredUsers} on:deleteUser={onDeleteUser}>
			<span slot="user" let:user let:popoverId id={popoverId}>{user.email}</span>
			<svelte-fragment slot="more-actions" let:user>
				<ResendInviteButton {user} />
				<CopyInviteButton {user} />
			</svelte-fragment>
		</UsersTable>
	</div>
</div>

<Modal title={$t('admin.users.modal.title')} bind:open={deleteModalOpen}>
	<div class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
		<p>{$t('admin.users.modal.body.warning')}</p>
		<p>{@html $t('admin.users.modal.body.confirmation', { email: deletionUser?.email })}</p>
	</div>

	<form method="post" action="?/delete" class="flex" use:enhance on:submit={() => (deleteModalOpen = false)}>
		<Button class="ml-auto" color="red" type="submit">{$t('common.confirm')}</Button>
		<input type="hidden" name="email" value={deletionUser?.email} />
	</form>
</Modal>
