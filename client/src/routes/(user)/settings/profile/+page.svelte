<script lang="ts">
	import UserForm from '$/lib/components/UserForm/UserForm.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import SettingPage from '../components/SettingPage.svelte';
	import ProfilePictureForm from './ProfilePictureForm.svelte';

	export let data;

	$: sessionUser = data.sessionUser!;

	$: superFormData = superForm(data.form, { dataType: 'json' });
</script>

<SettingPage {sessionUser} label="Profile">
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-y-5 lg:gap-10">
		<UserForm action="?/basicUserInfo" {superFormData} class="col-span-2 order-1 lg:order-none"></UserForm>
		<ProfilePictureForm
			hasJs={data.userHasJs}
			class="col-span-1 order-2 lg:order-none"
			currentProfilePictureRef={data.sessionUser?.profilePictureRef}
		/>
	</div>
</SettingPage>
