<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import UserForm from '../components/UserForm.svelte';

	export let data;

	const superFormData = superForm(data.form, { dataType: 'json' });
</script>

<UserForm headerText="Creating New User" roles={data.roles} {superFormData} />
