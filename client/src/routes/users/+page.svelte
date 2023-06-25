<script lang="ts">
	import { userHasRole } from '$/lib/components/nav/utils.js';
	import { Badge, Heading, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';

	export let data;

	$: ({ users, user: authUser } = data);

	$: canActions = userHasRole(authUser, 'admin');
</script>

<Heading tag="h2">This is the users list</Heading>

<Table divClass="mt-10 relative overflow-x-auto">
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
				<TableBodyCell>{user.firstName}</TableBodyCell>
				<TableBodyCell>{user.lastName}</TableBodyCell>
				<TableBodyCell>
					{#if user.roles}
						{#each user.roles as role}
							<Badge>{role.text}</Badge>
						{/each}
					{:else}
						~ No Roles ~
					{/if}
				</TableBodyCell>
				{#if canActions}
					<TableBodyCell>
						<a href="/users/{user.email}" class="font-medium text-primary-600 hover:underline dark:text-primary-500"> Edit </a>
					</TableBodyCell>
				{/if}
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
