<script lang="ts">
	import { enhance } from '$app/forms';
	import { ResendInviteLinkStore } from '$houdini';
	import { Button, Heading, Modal } from 'flowbite-svelte';
	import type { ComponentEvents } from 'svelte';
	import type { PageData } from './$houdini';
	import CopyInviteButton from './components/UsersTable/CopyInviteButton.svelte';
	import UsersTable from './components/UsersTable/UsersTable.svelte';
	import type { BaseUser } from './types';

	export let data: PageData;

	$: ({ ManageGetUsers } = data);

	$: users = $ManageGetUsers.data?.users ?? [];
	$: unregisteredUsers = $ManageGetUsers.data?.unregisteredUsers ?? [];

	let deleteModalOpen = false;
	let deletionUser: BaseUser | undefined;

	// eslint-disable-next-line no-inner-declarations
	function onDeleteUser(event: ComponentEvents<UsersTable>['deleteUser']) {
		const { detail: user } = event;

		deletionUser = user;
		deleteModalOpen = true;
	}

	const inviteLinkResender = new ResendInviteLinkStore();
</script>

<Heading tag="h2">User Management</Heading>

<div class="self-center">
	<Button href="/admin/users/new">Create New User</Button>
</div>

<div class="grid gap-10 grid-cols-1 lg:grid-cols-2">
	<div>
		<Heading tag="h4" class="mb-2">Registered Users</Heading>

		<UsersTable {users} on:deleteUser={onDeleteUser} />
	</div>

	<!-- <Hr /> -->

	<div>
		<Heading tag="h4" class="mb-2">Unregistered Users List</Heading>

		<UsersTable name="unregistered" users={unregisteredUsers} on:deleteUser={onDeleteUser}>
			<span slot="user" let:user let:popoverId id={popoverId}>{user.email}</span>
			<svelte-fragment slot="more-actions" let:user>
				<Button
					size="xs"
					on:click={async () => {
						await inviteLinkResender.mutate({ email: user.email });
					}}
					color="green"
				>
					Resend invite email
				</Button>
				<CopyInviteButton {user} />
			</svelte-fragment>
		</UsersTable>
	</div>
</div>

<Modal title="Confirmation" bind:open={deleteModalOpen}>
	<div class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
		<p>Deleting a user is permanent!</p>
		<p>
			Are you sure you want to delete the user <span class="font-bold">{deletionUser?.email}</span>?
		</p>
	</div>

	<form method="post" action="?/delete" use:enhance on:submit={() => (deleteModalOpen = false)}>
		<Button color="red" type="submit">Confirm</Button>
		<input type="hidden" name="email" value={deletionUser?.email} />
	</form>
</Modal>
