<script lang="ts" context="module">
	export const meta: SettingsRouteMeta = {
		icon: 'i-mdi-account',
	};
</script>

<script lang="ts">
	import UserForm from '$lib/components/UserForm/UserForm.svelte';
	import { getSessionUser } from '$lib/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import type { SettingsRouteMeta } from '../types';
	import ProfilePictureForm from './ProfilePictureForm.svelte';

	export let data;

	let sessionUser = getSessionUser();

	const superFormData = superForm(data.form, { dataType: 'json' });
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-y-5 lg:gap-10">
	<UserForm action="?/basicUserInfo" {superFormData} class="col-span-2 order-1 lg:order-none" />
	<ProfilePictureForm
		hasJs={data.userHasJs}
		class="col-span-1 order-2 lg:order-none"
		currentProfilePictureRef={$sessionUser?.profilePictureRef}
	/>
</div>
