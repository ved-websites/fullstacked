<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import UserForm from '../components/UserForm.svelte';
	import type { PageData } from './$houdini';

	export let data: PageData;

	$: ({ GetRolesForNewUser } = data);

	const superFormData = superForm(data.form, { dataType: 'json' });
</script>

<UserForm headerText="Creating New User" {superFormData} roles={$GetRolesForNewUser.data?.getRoles ?? []} />
