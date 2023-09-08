<script lang="ts" context="module">
	import { mdiSecurity } from '@mdi/js';

	export const name = 'Security';
	export const icon = mdiSecurity;
</script>

<script lang="ts">
	import { Button, Helper, Input, Label } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import SettingPage from '../components/SettingPage.svelte';

	export let data;

	$: sessionUser = data.sessionUser!;

	$: ({ form, errors, constraints, enhance } = superForm(data.form));
</script>

<SettingPage routesInfo={data.routesInfo} {sessionUser} label={name}>
	<form method="POST" use:enhance>
		<Label>
			<span> New Password </span>
			<Input name="password" class="mt-2" type="password" bind:value={$form.password} {...$constraints.password} />
			{#if $errors.password}<Helper class="mt-2" color="red">{$errors.password}</Helper>{/if}
		</Label>

		<Button type="submit" class="mt-3">Submit</Button>
	</form>
</SettingPage>
