<script lang="ts">
	import ProfilePictureForm from '$/lib/components/UserForm/ProfilePictureForm.svelte';
	import UserForm from '$/lib/components/UserForm/UserForm.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import SettingPage from '../components/SettingPage.svelte';

	export let data;

	$: sessionUser = data.sessionUser!;

	$: superFormData = superForm(data.form, { dataType: 'json' });
</script>

<SettingPage {sessionUser}>
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-y-5 lg:gap-10">
		<UserForm action="?/basicUserInfo" {superFormData} class="col-span-2 order-1 lg:order-none"></UserForm>
		<ProfilePictureForm class="col-span-1 order-2 lg:order-none" currentProfilePictureRef={data.sessionUser?.profilePictureRef} />
	</div>
</SettingPage>
