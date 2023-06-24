<script lang="ts">
	import { Badge, Heading, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';

	export let data;

	$: ({ users } = data);
</script>

<Heading tag="h2">This is the users list</Heading>

<Table divClass="mt-10 relative overflow-x-auto">
	<TableHead>
		<TableHeadCell>Email</TableHeadCell>
		<TableHeadCell>First Name</TableHeadCell>
		<TableHeadCell>Last Name</TableHeadCell>
		<TableHeadCell>Roles</TableHeadCell>
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
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
