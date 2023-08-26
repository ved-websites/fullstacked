<script lang="ts">
	import { Heading } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import UserForm from '../components/UserForm.svelte';
	import type { PageData } from './$houdini';

	export let data: PageData;

	$: ({ GetRolesForNewUser } = data);

	const superFormData = superForm(data.form, { dataType: 'json' });
</script>

<Heading tag="h2">Creating New User</Heading>

<UserForm {superFormData} roles={$GetRolesForNewUser.data?.getRoles ?? []} />
