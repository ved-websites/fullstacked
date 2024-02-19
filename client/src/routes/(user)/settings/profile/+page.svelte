<script lang="ts" context="module">
	export const meta: SettingsRouteMeta = {
		icon: 'i-mdi-account',
		order: 1,
	};
</script>

<script lang="ts">
	import { getI18n } from '$i18n';
	import UserForm from '$lib/components/UserForm/UserForm.svelte';
	import { getSessionUser } from '$lib/stores';
	import { Button, Heading } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { SettingsRouteMeta } from '../types';
	import ProfilePictureForm from './ProfilePictureForm.svelte';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	export let data;

	let sessionUser = getSessionUser();

	const superFormData = superForm(data.form, { dataType: 'json' });
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-y-5 lg:gap-10">
	<div class="col-span-2 order-1 lg:order-none flex flex-col gap-y-5">
		<UserForm action="?/basicUserInfo" {superFormData} />
		<div class="flex flex-col gap-y-5 my-5">
			<Heading tag="h4">{$t('settings.profile.email.header')}</Heading>
			<Button href="/settings/profile/email">{$t('shared.userform.labels.new-email')}</Button>
		</div>
	</div>
	<ProfilePictureForm
		hasJs={data.userHasJs}
		class="col-span-1 order-2 lg:order-none"
		currentProfilePictureRef={$sessionUser?.profilePictureRef}
	/>
</div>
