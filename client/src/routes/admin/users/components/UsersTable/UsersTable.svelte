<script lang="ts" generics="T extends BaseUser = BaseUser">
	import { getI18n } from '$i18n';
	import UserAvatar from '$lib/components/UserAvatar.svelte';
	import {
		Badge,
		Button,
		Hr,
		Popover,
		Spinner,
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
	let i18n = getI18n();
	$: ({ t } = $i18n);

	// eslint-disable-next-line no-undef
	export let users: T[] | undefined;
	export let name: string = '';

	export let tableClass: string = '';
	export let tableBodyClass: string = 'divide-y';

	$: sortedUsers = (users ?? []).sort((a, b) => a.email.localeCompare(b.email));

	type Events = {
		// eslint-disable-next-line no-undef
		deleteUser: T;
	};

	const dispatch = createEventDispatcher<Events>();
</script>

<Table class={tableClass}>
	<TableHead>
		<TableHeadCell>{$t('admin.users.tables.columns.user')}</TableHeadCell>
		<TableHeadCell>{$t('admin.users.tables.columns.actions')}</TableHeadCell>
	</TableHead>
	<TableBody {tableBodyClass}>
		{#if sortedUsers.length}
			{#each sortedUsers as user, i (user.email)}
				{@const popoverId = `info-${name}${i}`}
				<TableBodyRow>
					<TableBodyCell>
						<slot name="user" {user} {popoverId}>
							<div id="info-{name}{i}" class="inline-flex items-center gap-2">
								<UserAvatar {...user} class="hidden sm:flex lg:hidden xl:flex" />
								<span>{user.email}</span>
							</div>
						</slot>
					</TableBodyCell>
					<TableBodyCell>
						<Button size="xs" href="/admin/users/{user.email}">{$t('admin.users.tables.actions.edit')}</Button>
						<Button size="xs" on:click={() => dispatch('deleteUser', user)} color="red">{$t('admin.users.tables.actions.delete')}</Button>
						<slot name="more-actions" {user} {popoverId} />
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		{:else}
			<TableBodyRow>
				<TableBodyCell colspan="2">
					<div class="flex justify-center py-3">
						{#if users === undefined}
							<Spinner />
						{:else}
							<span class="italic">{$t('admin.users.tables.unregistered.nobody')}</span>
						{/if}
					</div>
				</TableBodyCell>
			</TableBodyRow>
		{/if}
	</TableBody>
</Table>

{#each sortedUsers as user, i (user.email)}
	<Popover defaultClass="p-3 flex flex-col gap-3" class="w-64 text-sm font-light" triggeredBy="#info-{name}{i}">
		<div slot="title" class="font-semibold text-gray-900 dark:text-white text-center">{$t('admin.users.tables.userinfo.heading')}</div>
		<div class="flex justify-between gap-3">
			<UserAvatar {...user} />
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
			<span class="self-center leading-none text-gray-900 dark:text-white">{$t('admin.users.tables.userinfo.fields.roles.title')}</span>
			<div class="flex gap-1 flex-wrap justify-stretch">
				{#each user.roles ?? [] as role}
					<Badge color="indigo">{$t(`shared.userform.roles.${role.text}`)}</Badge>
				{:else}
					<span class="italic">{$t('admin.users.tables.userinfo.fields.roles.empty')}</span>
				{/each}
			</div>
		</div>
	</Popover>
{/each}
