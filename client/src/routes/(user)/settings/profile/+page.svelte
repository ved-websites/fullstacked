<script lang="ts" context="module">
	export const meta: SettingsRouteMeta = {
		icon: 'i-mdi-account',
		order: 1,
	};
</script>

<script lang="ts">
	import type { ConfirmedSessionUser } from '$auth/auth-handler';
	import { getI18n } from '$i18n';
	import UserForm from '$lib/components/UserForm/UserForm.svelte';
	import { getSessionUser } from '$lib/stores';
	import { Badge, Heading } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { SettingsRouteMeta } from '../types';
	import ProfilePictureForm from './ProfilePictureForm.svelte';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	export let data;

	let sessionUser = getSessionUser<ConfirmedSessionUser>();

	const superFormData = superForm(data.form, { dataType: 'json' });
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-y-10 lg:gap-10">
	<div class="col-span-2 order-2 lg:order-none flex flex-col gap-y-5">
		<UserForm action="?/basicUserInfo" {superFormData} />
		<div class="flex flex-col gap-y-5">
			<Heading tag="h4">{$t('settings.profile.roles.header')}</Heading>
			<div class="flex gap-3 flex-wrap justify-stretch">
				{#each $sessionUser.roles as role}
					<Badge color="indigo" large>{$t(`shared.userform.roles.${role.text}`)}</Badge>
				{:else}
					<span class="italic">{$t('settings.profile.roles.no-roles')}</span>
				{/each}
			</div>
		</div>
	</div>
	<ProfilePictureForm
		hasJs={data.userHasJs}
		class="col-span-1 order-1 lg:order-none"
		currentProfilePictureRef={$sessionUser?.profilePictureRef}
	/>
</div>
