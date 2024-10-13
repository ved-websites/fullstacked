<script lang="ts" generics="T extends BaseUser = BaseUser">
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { BaseUser } from '../../types';

	import { getI18n } from '$i18n';
	import Icon from '$lib/components/Icon.svelte';
	import UserAvatar from '$lib/components/UserAvatar.svelte';
	import VSelect from '$lib/components/flowbite-custom/VSelect/VSelect.svelte';
	import type { VSelectOptionType } from '$lib/components/flowbite-custom/VSelect/types';
	import {
		Badge,
		Button,
		Heading,
		Hr,
		Input,
		Label,
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
	let i18n = getI18n();
	$: ({ t } = $i18n);

	// eslint-disable-next-line no-undef
	export let users: T[] | undefined;
	export let name: string = '';
	export let heading: string;

	export let tableClass: string = '';
	export let tableBodyClass: string = 'divide-y';

	type Events = {
		// eslint-disable-next-line no-undef
		deleteUser: T;
	};

	const dispatch = createEventDispatcher<Events>();

	type UserType = '' | 'registered' | 'unregistered';

	const userTypes: VSelectOptionType<UserType>[] = [
		{ name: 'admin.users.tables.filters.types.all' satisfies I18nKey, value: '', selected: true },
		{ name: 'admin.users.tables.filters.types.registered' satisfies I18nKey, value: 'registered' },
		{ name: 'admin.users.tables.filters.types.unregistered' satisfies I18nKey, value: 'unregistered' },
	];

	let filterOpen = true;
	let searchTerm: string = '';
	let userTypeChoice: UserType = '';

	$: shownUsers = users?.filter((u) => {
		// Check registration type
		const isRegistered = !u.registerToken;

		if (userTypeChoice === 'registered' && !isRegistered) {
			return false;
		}
		if (userTypeChoice === 'unregistered' && isRegistered) {
			return false;
		}

		// Check search terms
		const safeSearchTerm = searchTerm.toLowerCase();

		const email = u.email.toLowerCase();
		const name = u.fullName?.toLowerCase();

		if (email.includes(safeSearchTerm)) {
			return true;
		}
		if (name?.includes(safeSearchTerm)) {
			return true;
		}

		return false;
	});
</script>

<div class="flex justify-between">
	<Heading tag="h4" class="mb-2">{heading}</Heading>
	<div class="sm:hidden">
		<Button size="sm" pill on:click={() => (filterOpen = !filterOpen)}>
			<Icon class="i-mdi-magnify-expand mr-1" />
			{$t('admin.users.tables.filters.toggle')}
			<Icon class="ml-1 {filterOpen ? 'i-mdi-chevron-down' : 'i-mdi-chevron-up'}" />
		</Button>
	</div>
</div>

<div class="{filterOpen ? 'hidden' : ''} sm:block">
	<div class="flex flex-col gap-3 sm:flex-row justify-between">
		<div class="w-full max-w-full sm:max-w-[50vw]">
			<Input type="text" placeholder={$t('admin.users.tables.filters.fields.search')} bind:value={searchTerm}>
				<Icon slot="left" class="i-mdi-magnify" />
			</Input>
		</div>

		<Label class="flex content-center gap-5">
			<span class="my-auto text-nowrap">{$t('admin.users.tables.filters.fields.type')} :</span>
			<VSelect items={userTypes} placeholder="" bind:value={userTypeChoice}></VSelect>
		</Label>
	</div>
</div>

<Table class={tableClass}>
	<TableHead>
		<TableHeadCell>{$t('admin.users.tables.columns.user')}</TableHeadCell>
		<TableHeadCell class="text-right">{$t('admin.users.tables.columns.actions')}</TableHeadCell>
	</TableHead>
	<TableBody {tableBodyClass}>
		{#if shownUsers === undefined}
			<TableBodyRow>
				<TableBodyCell colspan="2">
					<div class="flex justify-center py-3">
						<Spinner />
					</div>
				</TableBodyCell>
			</TableBodyRow>
		{:else if !shownUsers.length}
			<TableBodyRow>
				<TableBodyCell class="px-4" colspan="2">
					<div class="flex justify-center py-3">
						<span class="italic">{$t('admin.users.tables.empty')}</span>
					</div>
				</TableBodyCell>
			</TableBodyRow>
		{:else}
			{#each shownUsers as user, i (user.email)}
				{@const popoverId = `info-${name}${i}`}
				<TableBodyRow>
					<TableBodyCell class="px-4">
						<div id={popoverId} class="inline-flex items-center gap-2">
							<UserAvatar {...user} />
							<span class="max-w-[25vw] md:max-w-full text-nowrap text-ellipsis overflow-hidden">{user.email}</span>
						</div>
					</TableBodyCell>
					<TableBodyCell class="px-4">
						<div class="flex justify-end gap-1 flex-wrap">
							<Button size="xs" href="/admin/users/{user.email}">{$t('admin.users.tables.actions.edit')}</Button>
							<Button size="xs" on:click={() => dispatch('deleteUser', user)} color="red">
								{$t('admin.users.tables.actions.delete')}
							</Button>
							<slot name="more-actions" {user} {popoverId} />
						</div>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		{/if}
	</TableBody>
</Table>

{#if shownUsers?.length}
	{#each shownUsers as user, i (user.email)}
		<Popover defaultClass="p-3 flex flex-col gap-3" class="w-64 text-sm font-light" triggeredBy="#info-{name}{i}">
			<div slot="title" class="font-semibold text-gray-900 dark:text-white text-center">{$t('admin.users.tables.userinfo.heading')}</div>
			<div class="flex justify-between gap-3">
				<UserAvatar {...user} />
				<div class="self-center text-right min-w-0">
					<div class="text-base font-semibold leading-none text-gray-900 dark:text-white">
						{#if user.fullName}
							<span>{user.fullName}</span>
						{:else}
							<span>{$t('admin.users.tables.userinfo.fields.name.none')}</span>
						{/if}
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
{/if}
