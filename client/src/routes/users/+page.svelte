<script lang="ts">
	import { userHasRole } from '$/lib/components/nav/utils.js';
	import { enhance } from '$app/forms';
	import { Badge, Button, Heading, Modal, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';

	export let data;

	$: ({ users, sessionUser } = data);

	$: canActions = userHasRole(sessionUser, 'admin');

	let deleteModalOpen = false;
	let deletionUser: (typeof users)[number] | undefined;
</script>

<Heading tag="h2" class="mb-5">This is the users list</Heading>
<div class="flex mb-5 place-content-center">
	<Button href="/users/new">Create New User</Button>
</div>

<Table>
	<TableHead>
		<TableHeadCell>Email</TableHeadCell>
		<TableHeadCell>First Name</TableHeadCell>
		<TableHeadCell>Last Name</TableHeadCell>
		<TableHeadCell>Roles</TableHeadCell>
		{#if canActions}
			<TableHeadCell>Actions</TableHeadCell>
		{/if}
	</TableHead>
	<TableBody tableBodyClass="divide-y">
		{#each users as user}
			<TableBodyRow>
				<TableBodyCell>{user.email}</TableBodyCell>
				<TableBodyCell>{user.firstName ?? '-'}</TableBodyCell>
				<TableBodyCell>{user.lastName ?? '-'}</TableBodyCell>
				<TableBodyCell>
					{#if user.roles}
						{#each user.roles as role}
							<Badge color="indigo">{role.text}</Badge>
						{/each}
					{:else}
						~ No Roles ~
					{/if}
				</TableBodyCell>
				{#if canActions}
					<TableBodyCell>
						<Button size="xs" href="/users/{user.email}">Edit</Button>
						<Button
							size="xs"
							on:click={() => {
								deleteModalOpen = true;
								deletionUser = user;
							}}
							color="red">Delete</Button
						>
					</TableBodyCell>
				{/if}
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>

<Modal title="Confirmation" bind:open={deleteModalOpen}>
	<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
		Deleting a user is permanent! Are you sure you want to delete the user <span class="font-bold">{deletionUser?.email}</span>?
	</p>

	<form method="post" action="?/delete" use:enhance on:submit={() => (deleteModalOpen = false)}>
		<Button color="red" type="submit">Confirm</Button>
		<input type="hidden" name="email" value={deletionUser?.email} />
	</form>
</Modal>
