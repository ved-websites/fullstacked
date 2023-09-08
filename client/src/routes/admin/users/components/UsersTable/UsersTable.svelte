<script lang="ts" generics="T extends BaseUser = BaseUser">
	import { getProfilePictureImageUrl } from '$/lib/utils/images';
	import {
		Avatar,
		Badge,
		Button,
		Hr,
		Popover,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
	} from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { BaseUser } from '../../types';

	// eslint-disable-next-line no-undef
	export let users: T[];
	export let name: string = '';
	export let tableClass: string = '';
	export let tableBodyClass: string = 'divide-y';

	type Events = {
		// eslint-disable-next-line no-undef
		deleteUser: T;
	};

	const dispatch = createEventDispatcher<Events>();
</script>

<Table class={tableClass}>
	<TableHead>
		<TableHeadCell>User</TableHeadCell>
		<TableHeadCell>Actions</TableHeadCell>
	</TableHead>
	<TableBody {tableBodyClass}>
		{#each users as user, i}
			{@const popoverId = `info-${name}${i}`}
			<TableBodyRow>
				<TableBodyCell>
					<slot name="user" {user} {popoverId}>
						<div id="info-{name}{i}" class="inline-flex gap-2">
							<Avatar class="hidden sm:block lg:hidden xl:block" src={getProfilePictureImageUrl(user.profilePictureRef)}></Avatar>
							<span class="self-center">{user.email}</span>
						</div>
					</slot>
				</TableBodyCell>
				<TableBodyCell>
					<Button size="xs" href="/admin/users/{user.email}">Edit</Button>
					<Button size="xs" on:click={() => dispatch('deleteUser', user)} color="red">Delete</Button>
					<slot name="more-actions" {user} {popoverId} />
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>

{#each users as user, i}
	<Popover defaultClass="p-3 flex flex-col gap-3" class="w-64 text-sm font-light" triggeredBy="#info-{name}{i}">
		<div slot="title" class="font-semibold text-gray-900 dark:text-white text-center">Info Card</div>
		<div class="flex justify-between gap-3">
			<Avatar src={getProfilePictureImageUrl(user.profilePictureRef)}></Avatar>
			<div class="self-center text-right min-w-0">
				<div class="text-base font-semibold leading-none text-gray-900 dark:text-white">
					{user.firstName}
					{user.lastName}
				</div>
				<div class="whitespace-nowrap text-xs mt-1 text-ellipsis overflow-hidden">
					{user.email}
				</div>
			</div>
		</div>
		<Hr hrClass="h-px bg-gray-200 border-0 dark:bg-gray-700" />
		<div class="flex gap-5 justify-between p-2">
			<span class="self-center leading-none text-gray-900 dark:text-white">Roles</span>
			<div class="flex gap-1 flex-wrap justify-stretch">
				{#each user.roles ?? [] as role}
					<Badge color="indigo">{role.text}</Badge>
				{:else}
					<span class="italic"> ~ No Roles ~ </span>
				{/each}
			</div>
		</div>
	</Popover>
{/each}
