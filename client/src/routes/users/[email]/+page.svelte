<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import UserForm from '../components/UserForm.svelte';

	export let data;

	const superFormData = superForm(data.form, { dataType: 'json' });
</script>

<UserForm headerText="Editing user {data.editableUser?.email}" {superFormData} roles={data.roles} />
